# Unified Nginx Proxy with Certbot for SSL management
FROM nginx:alpine

# Install certbot, certbot-nginx, bash, and other utilities
RUN apk add --no-cache \
    certbot \
    certbot-nginx \
    bash \
    openssl \
    curl \
    tzdata

# Create necessary directories
RUN mkdir -p \
    /etc/letsencrypt \
    /var/www/certbot \
    /etc/nginx/sites-available \
    /etc/nginx/sites-enabled \
    /etc/nginx/ssl \
    /var/log/letsencrypt \
    /usr/local/bin

# Copy nginx configuration templates
COPY nginx-templates /etc/nginx/templates

# Copy management scripts
COPY scripts/docker-entrypoint.sh /docker-entrypoint.sh
COPY scripts/certbot-renew.sh /usr/local/bin/certbot-renew
COPY scripts/add-domain.sh /usr/local/bin/add-domain
COPY scripts/remove-domain.sh /usr/local/bin/remove-domain
COPY scripts/list-certificates.sh /usr/local/bin/list-certificates

# Make scripts executable
RUN chmod +x /docker-entrypoint.sh \
    /usr/local/bin/certbot-renew \
    /usr/local/bin/add-domain \
    /usr/local/bin/remove-domain \
    /usr/local/bin/list-certificates

# Copy base nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create a cron job for certificate renewal (runs twice daily)
RUN echo "0 0,12 * * * /usr/local/bin/certbot-renew >> /var/log/letsencrypt/renewal.log 2>&1" | crontab -

# Generate DH parameters for better SSL security
RUN openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048

EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]