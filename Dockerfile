# Development Dockerfile for Next.js 15 with Server Components
FROM node:22-alpine

WORKDIR /app

# Install libc6-compat for better Alpine compatibility
RUN apk add --no-cache libc6-compat

# Set development environment
ENV NODE_ENV=development

# Disable Next.js telemetry in development
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install all dependencies (including dev dependencies)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create .next directory and set permissions - DO NOT RUN AS ROOT
RUN mkdir -p .next .next/cache .next/types .next/server && \
    chmod -R 777 /app/.next && \
    chmod -R 777 /app

# Expose port 3000 for Next.js dev server
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start development server with hot reload
CMD ["npm", "run", "dev"]