#!/bin/bash

# Otter Trip MVP Upload Script
# This script uploads the application to the server
# 
# Prerequisites:
# 1. Configure SSH host in ~/.ssh/config (default: otter_dev)
# 2. Make sure you have rsync and ssh installed
# 3. Test connection before upload: ./deploy.sh -t
#
# Example ~/.ssh/config entry:
#   Host otter_dev
#     HostName your-server.com
#     User your-username
#     IdentityFile ~/.ssh/your-private-key
#     Port 22

set -e  # Exit on any error

# Configuration
SSH_HOST="otter_dev"
SERVER_DEST="~/otter-trip-mvp"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v rsync &> /dev/null; then
        print_error "rsync is required but not installed. Please install rsync."
        exit 1
    fi
    
    if ! command -v ssh &> /dev/null; then
        print_error "ssh is required but not installed. Please install ssh."
        exit 1
    fi
    
    print_status "Dependencies check passed"
}

# Function to deploy application
deploy_app() {
    print_status "Starting application upload..."
    
    # Create destination directory on server
    ssh "${SSH_HOST}" "mkdir -p ${SERVER_DEST}"
    
    # Upload application files
    print_status "Uploading application files..."
    rsync -avz --delete \
        --exclude-from=".rsyncignore" \
        --exclude ".git" \
        --exclude "node_modules" \
        --exclude "dist" \
        --exclude ".env" \
        --exclude ".env.local" \
        --exclude "*.log" \
        --progress \
        ./ \
        "${SSH_HOST}:${SERVER_DEST}/"
    
    print_status "Application upload completed successfully!"
    print_status ""
    print_status "To deploy with Docker and SSL on the server, run:"
    print_status "  cd ${SERVER_DEST}"
    print_status "  docker compose -f docker-compose.production.yml up -d"
}

# Function to test server connection
test_connection() {
    print_status "Testing server connection..."
    
    if ssh -o ConnectTimeout=10 "${SSH_HOST}" "echo 'Connection successful'"; then
        print_status "Server connection test passed"
    else
        print_error "Failed to connect to server. Please check your SSH config for '${SSH_HOST}'."
        exit 1
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "This script uploads the Otter Trip application to a server using SSH config."
    echo "Make sure you have configured SSH host '${SSH_HOST}' in ~/.ssh/config"
    echo ""
    echo "Options:"
    echo "  -h, --help      Show this help message"
    echo "  -t, --test      Test server connection only"
    echo "  -c, --config    Configure SSH host name"
    echo ""
    echo "Examples:"
    echo "  $0              Upload application to server"
    echo "  $0 -t           Test server connection"
    echo "  $0 -c           Configure SSH host name"
    echo ""
    echo "Current SSH Host: ${SSH_HOST}"
    echo "Server Destination: ${SERVER_DEST}"
    echo ""
    echo "Example ~/.ssh/config entry:"
    echo "  Host otter_dev"
    echo "    HostName your-server.com"
    echo "    User your-username"
    echo "    IdentityFile ~/.ssh/your-private-key"
    echo "    Port 22"
}

# Function to configure server settings
configure_server() {
    print_status "Configuring SSH host..."
    
    read -r -p "Enter SSH config name (e.g., sellup_dev): " NEW_SSH_HOST
    
    # Update the script with new values
    sed -i.bak "s/SSH_HOST=\".*\"/SSH_HOST=\"${NEW_SSH_HOST}\"/" "$0"
    
    # Remove backup file
    rm "$0.bak"
    
    print_status "SSH configuration updated successfully!"
    print_status "SSH Host: ${NEW_SSH_HOST}"
    print_status "Make sure '${NEW_SSH_HOST}' is configured in your ~/.ssh/config file"
}

# Main upload function
main() {
    print_status "Starting Otter Trip MVP upload..."
    
    check_dependencies
    
    case "${1:-deploy}" in
        -t|--test)
            test_connection
            print_status "Connection test completed successfully!"
            ;;
        -c|--config)
            configure_server
            ;;
        -h|--help)
            show_usage
            ;;
        deploy)
            test_connection
            deploy_app
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
    
    print_status "Upload process completed!"
}

# Run main function with all arguments
main "$@"
