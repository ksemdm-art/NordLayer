#!/bin/bash

# Production Deployment Script for 3D Printing Platform
# Usage: ./scripts/deploy.sh [--quick] [--rollback]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"
BACKUP_DIR="backups"
LOG_FILE="deploy.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Check if running as root or with sudo
check_permissions() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root or with sudo"
    fi
}

# Check if Docker and Docker Compose are installed
check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
    fi
    
    success "Dependencies check passed"
}

# Setup environment file
setup_environment() {
    log "Setting up environment..."
    
    if [ ! -f "$ENV_FILE" ]; then
        if [ -f ".env.production.template" ]; then
            cp .env.production.template "$ENV_FILE"
            log "Created .env from template"
            
            # Generate secure passwords
            SECRET_KEY=$(openssl rand -hex 32)
            DB_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)
            POSTGRES_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)
            GRAFANA_PASSWORD=$(openssl rand -base64 12 | tr -d "=+/" | cut -c1-12)
            
            # Update environment variables
            sed -i "s/your_postgres_password_here/$POSTGRES_PASSWORD/g" "$ENV_FILE"
            sed -i "s/your_very_secure_secret_key_here_min_32_chars/$SECRET_KEY/" "$ENV_FILE"
            sed -i "s/your_grafana_password_here/$GRAFANA_PASSWORD/" "$ENV_FILE"
            
            warning "Please update the following in $ENV_FILE:"
            warning "- TELEGRAM_BOT_TOKEN"
            warning "- ADMIN_CHAT_IDS"
            warning "- Domain name (yourdomain.com)"
            warning "- SSL certificate paths if using custom certificates"
            
            read -p "Press Enter after updating the configuration..."
        else
            error ".env file not found and no template available"
        fi
    fi
    
    success "Environment setup completed"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    mkdir -p "$BACKUP_DIR"
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    
    # Backup database
    if docker-compose -f "$COMPOSE_FILE" ps postgres | grep -q "Up"; then
        docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_dump -U postgres printing_platform > "$BACKUP_DIR/${BACKUP_NAME}_db.sql"
        success "Database backup created: $BACKUP_DIR/${BACKUP_NAME}_db.sql"
    fi
    
    # Backup uploads
    if [ -d "uploads" ]; then
        tar -czf "$BACKUP_DIR/${BACKUP_NAME}_uploads.tar.gz" uploads/
        success "Uploads backup created: $BACKUP_DIR/${BACKUP_NAME}_uploads.tar.gz"
    fi
    
    # Backup environment
    if [ -f "$ENV_FILE" ]; then
        cp "$ENV_FILE" "$BACKUP_DIR/${BACKUP_NAME}_env"
        success "Environment backup created: $BACKUP_DIR/${BACKUP_NAME}_env"
    fi
}

# Deploy application
deploy() {
    log "Starting deployment..."
    
    # Pull latest images
    log "Pulling latest Docker images..."
    docker-compose -f "$COMPOSE_FILE" pull
    
    # Start services
    log "Starting services..."
    docker-compose -f "$COMPOSE_FILE" up -d --remove-orphans
    
    # Wait for services to be ready
    log "Waiting for services to start..."
    sleep 30
    
    # Run database migrations
    log "Running database migrations..."
    docker-compose -f "$COMPOSE_FILE" exec -T backend alembic upgrade head
    
    success "Deployment completed"
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Check if containers are running
    RUNNING_CONTAINERS=$(docker-compose -f "$COMPOSE_FILE" ps -q | wc -l)
    EXPECTED_CONTAINERS=6  # nginx, postgres, redis, backend, frontend, telegram-bot
    
    if [ "$RUNNING_CONTAINERS" -ge "$EXPECTED_CONTAINERS" ]; then
        success "$RUNNING_CONTAINERS containers are running"
    else
        warning "Only $RUNNING_CONTAINERS containers are running (expected at least $EXPECTED_CONTAINERS)"
    fi
    
    # Check service health
    sleep 10
    
    # Check backend health
    if docker-compose -f "$COMPOSE_FILE" exec -T backend curl -f http://localhost:8000/health > /dev/null 2>&1; then
        success "Backend health check passed"
    else
        warning "Backend health check failed"
    fi
    
    # Check frontend health
    if docker-compose -f "$COMPOSE_FILE" exec -T frontend curl -f http://localhost:3000 > /dev/null 2>&1; then
        success "Frontend health check passed"
    else
        warning "Frontend health check failed"
    fi
    
    # Show service status
    log "Service status:"
    docker-compose -f "$COMPOSE_FILE" ps
}

# Rollback to previous version
rollback() {
    log "Rolling back to previous version..."
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/*_db.sql 2>/dev/null | head -n1)
    
    if [ -z "$LATEST_BACKUP" ]; then
        error "No backup found for rollback"
    fi
    
    # Stop current services
    docker-compose -f "$COMPOSE_FILE" down
    
    # Restore database
    log "Restoring database from $LATEST_BACKUP..."
    docker-compose -f "$COMPOSE_FILE" up -d postgres
    sleep 10
    
    # Drop and recreate database
    docker-compose -f "$COMPOSE_FILE" exec -T postgres psql -U postgres -c "DROP DATABASE IF EXISTS printing_platform;"
    docker-compose -f "$COMPOSE_FILE" exec -T postgres psql -U postgres -c "CREATE DATABASE printing_platform;"
    
    # Restore backup
    docker-compose -f "$COMPOSE_FILE" exec -T postgres psql -U postgres printing_platform < "$LATEST_BACKUP"
    
    # Start all services
    docker-compose -f "$COMPOSE_FILE" up -d
    
    success "Rollback completed"
}

# Cleanup old images and containers
cleanup() {
    log "Cleaning up old Docker images and containers..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove old backups (keep last 5)
    if [ -d "$BACKUP_DIR" ]; then
        ls -t "$BACKUP_DIR"/*_db.sql 2>/dev/null | tail -n +6 | xargs -r rm
        ls -t "$BACKUP_DIR"/*_uploads.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm
        ls -t "$BACKUP_DIR"/*_env 2>/dev/null | tail -n +6 | xargs -r rm
    fi
    
    success "Cleanup completed"
}

# Show logs
show_logs() {
    log "Showing recent logs..."
    docker-compose -f "$COMPOSE_FILE" logs --tail=50 --follow
}

# Main execution
main() {
    log "Starting 3D Printing Platform deployment"
    
    case "${1:-deploy}" in
        "deploy")
            check_permissions
            check_dependencies
            setup_environment
            create_backup
            deploy
            health_check
            cleanup
            success "Deployment completed successfully!"
            ;;
        "quick")
            check_permissions
            log "Quick deployment (no backup)..."
            deploy
            health_check
            success "Quick deployment completed!"
            ;;
        "rollback")
            check_permissions
            rollback
            health_check
            success "Rollback completed!"
            ;;
        "logs")
            show_logs
            ;;
        "status")
            docker-compose -f "$COMPOSE_FILE" ps
            ;;
        "stop")
            log "Stopping services..."
            docker-compose -f "$COMPOSE_FILE" down
            success "Services stopped"
            ;;
        "restart")
            log "Restarting services..."
            docker-compose -f "$COMPOSE_FILE" restart
            success "Services restarted"
            ;;
        *)
            echo "Usage: $0 [deploy|quick|rollback|logs|status|stop|restart]"
            echo ""
            echo "Commands:"
            echo "  deploy   - Full deployment with backup (default)"
            echo "  quick    - Quick deployment without backup"
            echo "  rollback - Rollback to previous version"
            echo "  logs     - Show service logs"
            echo "  status   - Show service status"
            echo "  stop     - Stop all services"
            echo "  restart  - Restart all services"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"