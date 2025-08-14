#!/bin/bash

# Script to add a new domain to the proxy
set -e

if [ $# -lt 2 ]; then
    echo "Usage: $0 <domain> <upstream_host:port> [email] [staging]"
    echo "Example: $0 example.com app:3000 admin@example.com false"
    exit 1
fi

DOMAIN=$1
UPSTREAM=$2
EMAIL=${3:-$SSL_EMAIL}
STAGING=${4:-false}

# Parse upstream host and port
IFS=':' read -r UPSTREAM_HOST UPSTREAM_PORT <<< "$UPSTREAM"
UPSTREAM_PORT=${UPSTREAM_PORT:-80}

if [ -z "$EMAIL" ]; then
    echo "Error: Email is required for Let's Encrypt"
    exit 1
fi

echo "Adding domain: $DOMAIN -> $UPSTREAM_HOST:$UPSTREAM_PORT"

# Create upstream name
UPSTREAM_NAME=$(echo "$DOMAIN" | tr '.' '_')

# Export variables
export DOMAIN UPSTREAM_NAME UPSTREAM_HOST UPSTREAM_PORT

# Generate configurations
envsubst '${DOMAIN}' < /etc/nginx/templates/http-redirect.conf.template > /etc/nginx/sites-available/${DOMAIN}-http.conf
ln -sf /etc/nginx/sites-available/${DOMAIN}-http.conf /etc/nginx/sites-enabled/

# Test and reload nginx
nginx -t && nginx -s reload

# Request certificate
STAGING_FLAG=""
if [ "$STAGING" = "true" ]; then
    STAGING_FLAG="--staging"
fi

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

if [ $? -eq 0 ]; then
    # Generate HTTPS configuration
    envsubst '${DOMAIN} ${UPSTREAM_NAME} ${UPSTREAM_HOST} ${UPSTREAM_PORT}' \
        < /etc/nginx/templates/https-proxy.conf.template \
        > /etc/nginx/sites-available/${DOMAIN}-https.conf
    ln -sf /etc/nginx/sites-available/${DOMAIN}-https.conf /etc/nginx/sites-enabled/
    
    # Test and reload nginx
    nginx -t && nginx -s reload
    
    echo "Domain $DOMAIN added successfully"
else
    echo "Failed to obtain certificate for $DOMAIN"
    exit 1
fi