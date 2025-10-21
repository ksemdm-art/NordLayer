#!/bin/bash

# Health check script for Docker services
# Usage: ./scripts/health-check-docker.sh [service_name]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service health
check_service_health() {
    local service_name=$1
    local health_url=$2
    local expected_status=${3:-200}
    
    echo -n "Checking $service_name health... "
    
    if curl -f -s -o /dev/null -w "%{http_code}" "$health_url" | grep -q "$expected_status"; then
        echo -e "${GREEN}✓ Healthy${NC}"
        return 0
    else
        echo -e "${RED}✗ Unhealthy${NC}"
        return 1
    fi
}

# Function to check Docker container status
check_container_status() {
    local container_name=$1
    
    echo -n "Checking $container_name container... "
    
    if docker-compose ps "$container_name" | grep -q "Up"; then
        echo -e "${GREEN}✓ Running${NC}"
        return 0
    else
        echo -e "${RED}✗ Not running${NC}"
        return 1
    fi
}

# Function to check Docker container health
check_container_health() {
    local container_name=$1
    
    echo -n "Checking $container_name health status... "
    
    health_status=$(docker inspect --format='{{.State.Health.Status}}' "$(docker-compose ps -q $container_name)" 2>/dev/null || echo "no-healthcheck")
    
    case $health_status in
        "healthy")
            echo -e "${GREEN}✓ Healthy${NC}"
            return 0
            ;;
        "unhealthy")
            echo -e "${RED}✗ Unhealthy${NC}"
            return 1
            ;;
        "starting")
            echo -e "${YELLOW}⚠ Starting${NC}"
            return 1
            ;;
        "no-healthcheck")
            echo -e "${YELLOW}⚠ No health check configured${NC}"
            return 0
            ;;
        *)
            echo -e "${RED}✗ Unknown status: $health_status${NC}"
            return 1
            ;;
    esac
}

# Main health check function
main_health_check() {
    echo "=== NordLayer 3D Printing Platform Health Check ==="
    echo ""
    
    local overall_status=0
    
    # Check container statuses
    echo "Container Status:"
    check_container_status "postgres" || overall_status=1
    check_container_status "redis" || overall_status=1
    check_container_status "backend" || overall_status=1
    check_container_status "frontend" || overall_status=1
    check_container_status "telegram-bot" || overall_status=1
    check_container_status "nginx" || overall_status=1
    
    echo ""
    
    # Check container health
    echo "Container Health:"
    check_container_health "postgres" || overall_status=1
    check_container_health "redis" || overall_status=1
    check_container_health "backend" || overall_status=1
    check_container_health "frontend" || overall_status=1
    check_container_health "telegram-bot" || overall_status=1
    check_container_health "nginx" || overall_status=1
    
    echo ""
    
    # Check service endpoints
    echo "Service Endpoints:"
    check_service_health "Backend API" "http://localhost:8000/health" || overall_status=1
    check_service_health "Frontend" "http://localhost:3000/health" || overall_status=1
    check_service_health "Telegram Bot" "http://localhost:8080/health" || overall_status=1
    check_service_health "Nginx" "http://localhost:80/health" || overall_status=1
    
    echo ""
    
    # Check database connectivity
    echo "Database Connectivity:"
    echo -n "Checking PostgreSQL connection... "
    if docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Connected${NC}"
    else
        echo -e "${RED}✗ Connection failed${NC}"
        overall_status=1
    fi
    
    echo -n "Checking Redis connection... "
    if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Connected${NC}"
    else
        echo -e "${RED}✗ Connection failed${NC}"
        overall_status=1
    fi
    
    echo ""
    
    # Overall status
    if [ $overall_status -eq 0 ]; then
        echo -e "${GREEN}=== Overall Status: All systems operational ✓ ===${NC}"
    else
        echo -e "${RED}=== Overall Status: Some issues detected ✗ ===${NC}"
    fi
    
    return $overall_status
}

# Function to check specific service
check_specific_service() {
    local service=$1
    
    case $service in
        "backend"|"api")
            check_container_status "backend"
            check_container_health "backend"
            check_service_health "Backend API" "http://localhost:8000/health"
            ;;
        "frontend"|"web")
            check_container_status "frontend"
            check_container_health "frontend"
            check_service_health "Frontend" "http://localhost:3000/health"
            ;;
        "bot"|"telegram")
            check_container_status "telegram-bot"
            check_container_health "telegram-bot"
            check_service_health "Telegram Bot" "http://localhost:8080/health"
            ;;
        "database"|"db"|"postgres")
            check_container_status "postgres"
            check_container_health "postgres"
            docker-compose exec -T postgres pg_isready -U postgres
            ;;
        "cache"|"redis")
            check_container_status "redis"
            check_container_health "redis"
            docker-compose exec -T redis redis-cli ping
            ;;
        "nginx"|"proxy")
            check_container_status "nginx"
            check_container_health "nginx"
            check_service_health "Nginx" "http://localhost:80/health"
            ;;
        *)
            echo "Unknown service: $service"
            echo "Available services: backend, frontend, bot, database, cache, nginx"
            exit 1
            ;;
    esac
}

# Function to show detailed logs for unhealthy services
show_unhealthy_logs() {
    echo ""
    echo "=== Logs for potentially unhealthy services ==="
    
    # Check each service and show logs if unhealthy
    services=("postgres" "redis" "backend" "frontend" "telegram-bot" "nginx")
    
    for service in "${services[@]}"; do
        if ! check_container_health "$service" >/dev/null 2>&1; then
            echo ""
            echo "--- Logs for $service ---"
            docker-compose logs --tail=20 "$service"
        fi
    done
}

# Main script logic
if [ $# -eq 0 ]; then
    # No arguments - run full health check
    main_health_check
    exit_code=$?
    
    if [ $exit_code -ne 0 ]; then
        echo ""
        read -p "Show logs for unhealthy services? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            show_unhealthy_logs
        fi
    fi
    
    exit $exit_code
else
    # Check specific service
    check_specific_service "$1"
fi