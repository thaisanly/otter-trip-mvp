#!/bin/bash

# Script to remove a domain from the proxy
set -e

if [ $# -lt 1 ]; then
    echo "Usage: $0 <domain>"
    echo "Example: $0 example.com"
    exit 1
fi

DOMAIN=$1

echo "Removing domain: $DOMAIN"

# Remove nginx configurations
rm -f /etc/nginx/sites-enabled/${DOMAIN}-http.conf
rm -f /etc/nginx/sites-enabled/${DOMAIN}-https.conf
rm -f /etc/nginx/sites-available/${DOMAIN}-http.conf
rm -f /etc/nginx/sites-available/${DOMAIN}-https.conf

# Test and reload nginx
nginx -t && nginx -s reload

# Optionally revoke certificate
read -p "Do you want to revoke the SSL certificate for $DOMAIN? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    certbot revoke --cert-path /etc/letsencrypt/live/$DOMAIN/cert.pem --non-interactive
    certbot delete --cert-name $DOMAIN --non-interactive
fi

echo "Domain $DOMAIN removed successfully"