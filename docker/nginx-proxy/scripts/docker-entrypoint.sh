#!/bin/bash
set -e

echo "Starting Nginx Proxy with Certbot..."

# Start cron for certificate renewal
echo "Starting cron daemon for certificate renewal..."
crond

# Function to setup a domain
setup_domain() {
    local DOMAIN=$1
    local UPSTREAM_HOST=$2
    local UPSTREAM_PORT=$3
    local EMAIL=$4
    local STAGING=$5
    
    echo "Setting up domain: $DOMAIN -> $UPSTREAM_HOST:$UPSTREAM_PORT"
    
    # Create upstream name from domain (replace dots with underscores)
    UPSTREAM_NAME=$(echo "$DOMAIN" | tr '.' '_')
    
    # Export variables for template substitution
    export DOMAIN
    export UPSTREAM_NAME
    export UPSTREAM_HOST
    export UPSTREAM_PORT
    
    # Generate HTTP redirect configuration
    envsubst '${DOMAIN}' < /etc/nginx/templates/http-redirect.conf.template > /etc/nginx/sites-available/${DOMAIN}-http.conf
    ln -sf /etc/nginx/sites-available/${DOMAIN}-http.conf /etc/nginx/sites-enabled/
    
    # Test nginx configuration
    nginx -t
    
    # Reload nginx to apply HTTP configuration
    if pgrep nginx > /dev/null; then
        nginx -s reload
    else
        nginx -g "daemon on;"
    fi
    
    # Wait for nginx to be ready
    sleep 2
    
    # Check if certificate already exists
    if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
        echo "Certificate already exists for $DOMAIN"
    else
        echo "Requesting new certificate for $DOMAIN"
        
        # Set staging flag if requested
        STAGING_FLAG=""
        if [ "$STAGING" = "true" ]; then
            echo "Using Let's Encrypt staging environment"
            STAGING_FLAG="--staging"
        fi
        
        # Request certificate
        certbot certonly \
            --webroot \
            --webroot-path=/var/www/certbot \
            --email "$EMAIL" \
            --agree-tos \
            --no-eff-email \
            --non-interactive \
            $STAGING_FLAG \
            --domains "$DOMAIN" \
            --expand
        
        if [ $? -ne 0 ]; then
            echo "Failed to obtain certificate for $DOMAIN"
            return 1
        fi
    fi
    
    # Generate HTTPS proxy configuration
    envsubst '${DOMAIN} ${UPSTREAM_NAME} ${UPSTREAM_HOST} ${UPSTREAM_PORT}' \
        < /etc/nginx/templates/https-proxy.conf.template \
        > /etc/nginx/sites-available/${DOMAIN}-https.conf
    ln -sf /etc/nginx/sites-available/${DOMAIN}-https.conf /etc/nginx/sites-enabled/
    
    echo "Domain $DOMAIN configured successfully"
    return 0
}

# Process environment variables for automatic setup
if [ -n "$AUTO_DOMAINS" ]; then
    echo "Auto-configuring domains..."
    IFS=',' read -ra DOMAINS <<< "$AUTO_DOMAINS"
    
    for domain_config in "${DOMAINS[@]}"; do
        # Format: domain:upstream_host:upstream_port
        IFS=':' read -r domain upstream_host upstream_port <<< "$domain_config"
        
        # Use defaults if not specified
        upstream_host=${upstream_host:-app}
        upstream_port=${upstream_port:-3000}
        
        setup_domain "$domain" "$upstream_host" "$upstream_port" "$SSL_EMAIL" "$STAGING"
    done
fi

# Single domain setup (backward compatibility)
if [ -n "$DOMAIN" ] && [ -z "$AUTO_DOMAINS" ]; then
    UPSTREAM_HOST=${UPSTREAM_HOST:-app}
    UPSTREAM_PORT=${UPSTREAM_PORT:-3000}
    setup_domain "$DOMAIN" "$UPSTREAM_HOST" "$UPSTREAM_PORT" "$SSL_EMAIL" "$STAGING"
fi

# Test final nginx configuration
nginx -t

# Stop background nginx if running
if pgrep nginx > /dev/null; then
    nginx -s stop
    sleep 2
fi

# Start nginx in foreground
echo "Starting nginx in foreground..."
exec "$@"