#!/bin/bash

# Certificate renewal script
echo "$(date): Starting certificate renewal check..."

# Renew certificates
certbot renew \
    --webroot \
    --webroot-path=/var/www/certbot \
    --quiet \
    --no-self-upgrade \
    --post-hook "nginx -s reload"

if [ $? -eq 0 ]; then
    echo "$(date): Certificate renewal check completed successfully"
else
    echo "$(date): Certificate renewal check failed"
    exit 1
fi