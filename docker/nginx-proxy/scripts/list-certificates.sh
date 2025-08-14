#!/bin/bash

# Script to list all certificates and their status
echo "=== SSL Certificates Status ==="
echo

# List certificates using certbot
certbot certificates

echo
echo "=== Nginx Sites Configuration ==="
echo

# List enabled sites
echo "Enabled sites:"
ls -la /etc/nginx/sites-enabled/ 2>/dev/null || echo "No sites enabled"

echo
echo "=== Certificate Expiry Dates ==="
echo

# Check expiry dates for all certificates
for cert in /etc/letsencrypt/live/*/cert.pem; do
    if [ -f "$cert" ]; then
        domain=$(basename $(dirname "$cert"))
        expiry=$(openssl x509 -in "$cert" -noout -enddate | cut -d= -f2)
        echo "$domain: $expiry"
    fi
done

echo
echo "=== Next Renewal Dates ==="
echo

# Show renewal configuration
if [ -f /etc/letsencrypt/renewal/*.conf ]; then
    for renewal in /etc/letsencrypt/renewal/*.conf; do
        domain=$(basename "$renewal" .conf)
        next_renewal=$(grep -h "^renew_before_expiry" "$renewal" 2>/dev/null || echo "30 days")
        echo "$domain: $next_renewal before expiry"
    done
else
    echo "No renewal configurations found"
fi