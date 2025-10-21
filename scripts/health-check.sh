#!/bin/bash

# Health check script for Docker containers
# Usage: ./health-check.sh [service_name]

SERVICE=${1:-"all"}
COMPOSE_FILE=${2:-"docker-compose.yml"}

check_service() {
    local service=$1
    echo "Checking health of $service..."
    
    # Get container ID
    container_id=$(docker-compose -f $COMPOSE_FILE ps -q $service)
    
    if [ -z "$container_id" ]; then
        echo "❌ $service: Container not found"
        return 1
    fi
    
    # Check if container is running
    if ! docker inspect --format='{{.State.Running}}' $container_id | grep -q true; then
        echo "❌ $service: Container not running"
        return 1
    fi
    
    # Check health status
    health_status=$(docker inspect --format='{{.State.Health.Status}}' $container_id 2>/dev/null)
    
    if [ "$health_status" = "healthy" ]; then
        echo "✅ $service: Healthy"
        return 0
    elif [ "$health_status" = "unhealthy" ]; then
        echo "❌ $service: Unhealthy"
        return 1
    elif [ "$health_status" = "starting" ]; then
        echo "🔄 $service: Starting..."
        return 2
    else
        echo "⚠️  $service: No health check configured"
        return 0
    fi
}

if [ "$SERVICE" = "all" ]; then
    services=("postgres" "redis" "backend" "frontend" "nginx" "telegram-bot")
    overall_status=0
    
    echo "🏥 Checking health of all services..."
    echo "=================================="
    
    for service in "${services[@]}"; do
        check_service $service
        status=$?
        if [ $status -eq 1 ]; then
            overall_status=1
        fi
    done
    
    echo "=================================="
    if [ $overall_status -eq 0 ]; then
        echo "✅ All services are healthy!"
    else
        echo "❌ Some services are unhealthy!"
    fi
    
    exit $overall_status
else
    check_service $SERVICE
    exit $?
fi