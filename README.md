# Otter Trip - Travel Platform

A React-based travel platform connecting travelers with expert local guides.

## Project Status

**First Release**: Using static JSON data for all content and functionality.

## Tech Stack

- React 18
- TypeScript  
- Vite
- Tailwind CSS
- React Router v6

## Getting Started

### Local Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

**Note**: For local development, always use `yarn dev`. Docker is only for production server deployment.

## Production Deployment

### Prerequisites

- A server with a public IP address
- Domain name pointing to your server
- Docker and Docker Compose installed on server
- Ports 80 and 443 open
- User must be in docker group (see Ubuntu/Linux Setup below)

### Deployment Steps

#### 1. Upload Files to Server

```bash
# Use the deploy script
./deploy.sh

# Or manually with rsync
rsync -avz ./ user@server:~/otter-trip-mvp/
```

#### 2. Configure Environment on Server

```bash
cd ~/otter-trip-mvp

# Create .env file
cat > .env << EOF
DOMAIN=yourdomain.com
SSL_EMAIL=admin@yourdomain.com
STAGING=false
VITE_API_BASE_URL=https://api.yourdomain.com
EOF
```

#### 3. Deploy with Docker Compose

```bash
# Build and start services (use --build on first run)
docker compose -f docker-compose.production.yml up -d --build

# Check status
docker compose -f docker-compose.production.yml ps

# View logs
docker compose -f docker-compose.production.yml logs -f
```

#### Ubuntu/Linux Docker Setup

If you get a permission denied error, add your user to the docker group:

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Apply changes (or logout/login)
newgrp docker

# Verify docker works
docker ps
```

### SSL Certificate Management

The nginx-proxy container automatically handles SSL certificates using Let's Encrypt:

- Certificates are generated automatically on first deployment
- Auto-renewal runs twice daily via cron
- Supports both staging (testing) and production certificates

#### Certificate Commands

```bash
# List all certificates
docker compose -f docker-compose.production.yml exec nginx-proxy list-certificates

# Manual renewal
docker compose -f docker-compose.production.yml exec nginx-proxy certbot-renew

# Add new domain
docker compose -f docker-compose.production.yml exec nginx-proxy \
  add-domain newdomain.com app:3000 admin@newdomain.com false

# Remove domain
docker compose -f docker-compose.production.yml exec nginx-proxy \
  remove-domain olddomain.com
```

### Multiple Domains

To proxy multiple domains to different services, configure in docker-compose.production.yml:

```yaml
environment:
  - AUTO_DOMAINS=example.com:app:3000,api.example.com:api:8080
  - SSL_EMAIL=admin@example.com
```

## File Structure

```
.
├── Dockerfile                    # Production Dockerfile (server only)
├── docker-compose.production.yml # Production deployment with nginx proxy & SSL
├── nginx.conf                   # Simple nginx config for app container
├── deploy.sh                    # Deployment script
├── .rsyncignore                # Files to ignore during deployment
└── docker/
    └── nginx-proxy/            # Production proxy with Certbot
        ├── Dockerfile
        ├── nginx.conf
        ├── nginx-templates/
        └── scripts/
```

## Architecture

### Local Development
```
yarn dev → Vite Dev Server → http://localhost:5173
```

### Production Server
```
Internet (HTTPS:443) → nginx-proxy (SSL/Certbot) → app:3000 → Static React files
```

## Troubleshooting

### Certificate Issues

```bash
# Check DNS
dig +short yourdomain.com

# Use staging for testing
STAGING=true docker compose -f docker-compose.production.yml up -d

# Force renewal
docker compose -f docker-compose.production.yml exec nginx-proxy \
  certbot renew --force-renewal
```

### Connection Issues

```bash
# Check if services are running
docker compose -f docker-compose.production.yml ps

# Check nginx configuration
docker compose -f docker-compose.production.yml exec nginx-proxy nginx -t

# Check app connectivity
docker compose -f docker-compose.production.yml exec nginx-proxy ping app
```

## Data Source

The first release uses static JSON data stored locally. Future releases will integrate with a backend API.