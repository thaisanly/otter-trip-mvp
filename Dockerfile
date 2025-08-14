# Production Dockerfile - for server deployment only
# Build stage
FROM node:22-alpine AS builder

ARG NODE_ENV=production
ARG VITE_APP_NAME="Otter Trip"
ARG VITE_API_BASE_URL

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install ALL dependencies (including devDependencies for build)
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=$NODE_ENV
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the application
RUN yarn build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy simple nginx config (proxy handles SSL)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# The app runs on port 3000 internally (nginx-proxy connects to this)
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]