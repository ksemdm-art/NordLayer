#!/bin/bash

# Deployment script for 3D Printing Platform
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_DIR="/opt/printing-platform"
BACKUP_DIR="/opt/backups"
COMPOSE_FILE="docker-compose.prod.yml"

echo "🚀 Starting deployment to $ENVIRONMENT environment..."

# Create backup directory if it doesn't exist
sudo mkdir -p $BACKUP_DIR

# Function to create backup
create_backup() {
    echo "📦 Creating backup..."
    BACKUP_NAME="printing-platform-$(date +%Y%m%d-%H%M%S)"
    sudo cp -r $PROJECT_DIR $BACKUP_DIR/$BACKUP_NAME
    echo "✅ Backup created: $BACKUP_DIR/$BACKUP_NAME"
}

# Function to rollback
rollback() {
    echo "🔄 Rolling back to previous version..."
    LATEST_BACKUP=$(ls -t $BACKUP_DIR | head -n1)
    if [ -n "$LATEST_BACKUP" ]; then
        sudo rm -rf $PROJECT_DIR
        sudo cp -r $BACKUP_DIR/$LATEST_BACKUP $PROJECT_DIR
        cd $PROJECT_DIR
        sudo docker-compose -f $COMPOSE_FILE up -d
        echo "✅ Rollback completed"
    else
        echo "❌ No backup found for rollback"
        exit 1
    fi
}

# Function to check health
check_health() {
    echo "🏥 Checking application health..."
    sleep 30
    
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo "✅ Application is healthy"
        return 0
    else
        echo "❌ Health check failed"
        return 1
    fi
}

# Trap to handle errors
trap 'echo "❌ Deployment failed! Rolling back..."; rollback' ERR

# Change to project directory
cd $PROJECT_DIR

# Create backup before deployment
create_backup

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Stop services
echo "🛑 Stopping services..."
sudo docker-compose -f $COMPOSE_FILE down

# Pull latest images
echo "📥 Pulling latest Docker images..."
sudo docker-compose -f $COMPOSE_FILE pull

# Start services
echo "🚀 Starting services..."
sudo docker-compose -f $COMPOSE_FILE up -d

# Check health
if check_health; then
    echo "🎉 Deployment completed successfully!"
    
    # Clean up old backups (keep last 5)
    echo "🧹 Cleaning up old backups..."
    cd $BACKUP_DIR
    ls -t | tail -n +6 | xargs -r sudo rm -rf
    
    echo "✅ Deployment finished!"
else
    echo "❌ Health check failed, rolling back..."
    rollback
    exit 1
fi