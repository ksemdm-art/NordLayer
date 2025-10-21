#!/bin/bash

# Comprehensive Health Check Script for NordLayer 3D Printing Platform
# This script performs detailed health checks on all system components

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_FILE="/tmp/nordlayer-health-check.log"
ALERT_THRESHOLD_CPU=80
ALERT_THRESHOLD_MEMORY=80
ALERT_THRESHOLD_DISK=85
ALERT_THRESHOLD_RESPONSE_TIME=1000

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Status functions
status_ok() {
    echo -e "${GREEN}✓${NC} $1"
}

status_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

status_error() {
    echo -e "${RED}✗${NC} $1"
}

status_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check system resources
check_system_resources() {
    echo ""
    echo "=== SYSTEM RESOURCES ==="
    
    # CPU Usage
    if command_exists top; then
        cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
        cpu_usage=${cpu_usage%.*}  # Remove decimal part
        
        if [ "$cpu_usage" -gt "$ALERT_THRESHOLD_CPU" ]; then
            status_error "High CPU usage: ${cpu_usage}%"
        elif [ "$cpu_usage" -gt 60 ]; then
            status_warning "Moderate CPU usage: ${cpu_usage}%"
        else
            status_ok "CPU usage: ${cpu_usage}%"
        fi
    else
        status_warning "Cannot check CPU usage (top not available)"
    fi
    
    # Memory Usage
    if command_exists free; then
        memory_info=$(free | grep Mem)
        total_mem=$(echo $memory_info | awk '{print $2}')
        used_mem=$(echo $memory_info | awk '{print $3}')
        memory_usage=$((used_mem * 100 / total_mem))
        
        if [ "$memory_usage" -gt "$ALERT_THRESHOLD_MEMORY" ]; then
            status_error "High memory usage: ${memory_usage}%"
        elif [ "$memory_usage" -gt 60 ]; then
            status_warning "Moderate memory usage: ${memory_usage}%"
        else
            status_ok "Memory usage: ${memory_usage}%"
        fi
        
        # Show memory details
        echo "   $(free -h | head -2 | tail -1)"
    else
        status_warning "Cannot check memory usage (free not available)"
    fi
    
    # Disk Usage
    disk_usage=$(df / | tail -1 | awk '{print $5}' | cut -d'%' -f1)
    
    if [ "$disk_usage" -gt "$ALERT_THRESHOLD_DISK" ]; then
        status_error "High disk usage: ${disk_usage}%"
    elif [ "$disk_usage" -gt 70 ]; then
        status_warning "Moderate disk usage: ${disk_usage}%"
    else
        status_ok "Disk usage: ${disk_usage}%"
    fi
    
    # Show disk details
    echo "   $(df -h / | tail -1)"
    
    # Load Average
    if [ -f /proc/loadavg ]; then
        load_avg=$(cat /proc/loadavg | awk '{print $1}')
        cpu_cores=$(nproc)
        load_per_core=$(echo "$load_avg / $cpu_cores" | bc -l)
        
        if (( $(echo "$load_per_core > 1.0" | bc -l) )); then
            status_warning "High load average: $load_avg (${cpu_cores} cores)"
        else
            status_ok "Load average: $load_avg (${cpu_cores} cores)"
        fi
    fi
}

# Check Docker services
check_docker_services() {
    echo ""
    echo "=== DOCKER SERVICES ==="
    
    if ! command_exists docker; then
        status_error "Docker not installed or not in PATH"
        return 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        status_error "Docker daemon not running or not accessible"
        return 1
    fi
    
    # Check if docker-compose file exists
    if [ ! -f "$PROJECT_ROOT/docker-compose.yml" ]; then
        status_error "docker-compose.yml not found in project root"
        return 1
    fi
    
    cd "$PROJECT_ROOT"
    
    # Get service status
    if command_exists docker-compose; then
        services=$(docker-compose ps --services)
        
        for service in $services; do
            status=$(docker-compose ps -q $service | xargs docker inspect --format='{{.State.Status}}' 2>/dev/null)
            
            if [ "$status" = "running" ]; then
                status_ok "Service $service: running"
                
                # Check service health
                health=$(docker-compose ps -q $service | xargs docker inspect --format='{{.State.Health.Status}}' 2>/dev/null)
                if [ "$health" = "healthy" ]; then
                    status_ok "  Health: healthy"
                elif [ "$health" = "unhealthy" ]; then
                    status_error "  Health: unhealthy"
                elif [ "$health" != "" ]; then
                    status_warning "  Health: $health"
                fi
            else
                status_error "Service $service: $status"
            fi
        done
    else
        status_warning "docker-compose not available, checking containers manually"
        
        # Check individual containers
        containers=$(docker ps -a --format "table {{.Names}}\t{{.Status}}" | grep -E "(backend|frontend|db|redis|telegram)" || true)
        if [ -n "$containers" ]; then
            echo "$containers"
        else
            status_warning "No NordLayer containers found"
        fi
    fi
}

# Check application health
check_application_health() {
    echo ""
    echo "=== APPLICATION HEALTH ==="
    
    # Backend health check
    backend_url="http://localhost:8000"
    
    if curl -s --max-time 10 "$backend_url/health" >/dev/null 2>&1; then
        response=$(curl -s --max-time 10 "$backend_url/health")
        status_ok "Backend health endpoint accessible"
        
        # Parse response if it's JSON
        if echo "$response" | jq . >/dev/null 2>&1; then
            db_status=$(echo "$response" | jq -r '.database // "unknown"')
            cache_status=$(echo "$response" | jq -r '.cache // "unknown"')
            
            if [ "$db_status" = "healthy" ]; then
                status_ok "  Database: healthy"
            else
                status_error "  Database: $db_status"
            fi
            
            if [ "$cache_status" = "healthy" ]; then
                status_ok "  Cache: healthy"
            else
                status_warning "  Cache: $cache_status"
            fi
        fi
    else
        status_error "Backend health endpoint not accessible"
    fi
    
    # Frontend health check
    frontend_url="http://localhost:3000"
    
    if curl -s --max-time 10 "$frontend_url" >/dev/null 2>&1; then
        status_ok "Frontend accessible"
    else
        status_error "Frontend not accessible"
    fi
    
    # API response time check
    start_time=$(date +%s%3N)
    if curl -s --max-time 10 "$backend_url/api/v1/projects?per_page=5" >/dev/null 2>&1; then
        end_time=$(date +%s%3N)
        response_time=$((end_time - start_time))
        
        if [ "$response_time" -gt "$ALERT_THRESHOLD_RESPONSE_TIME" ]; then
            status_error "Slow API response time: ${response_time}ms"
        elif [ "$response_time" -gt 500 ]; then
            status_warning "Moderate API response time: ${response_time}ms"
        else
            status_ok "API response time: ${response_time}ms"
        fi
    else
        status_error "API not responding"
    fi
}

# Check database
check_database() {
    echo ""
    echo "=== DATABASE ==="
    
    cd "$PROJECT_ROOT"
    
    if command_exists docker-compose; then
        # Check if database container is running
        if docker-compose ps db | grep -q "Up"; then
            status_ok "Database container running"
            
            # Check database connectivity
            if docker-compose exec -T db pg_isready >/dev/null 2>&1; then
                status_ok "Database accepting connections"
                
                # Check database size
                db_size=$(docker-compose exec -T db psql -U postgres -d printing_platform -t -c "SELECT pg_size_pretty(pg_database_size('printing_platform'));" 2>/dev/null | xargs)
                if [ -n "$db_size" ]; then
                    status_info "Database size: $db_size"
                fi
                
                # Check active connections
                active_connections=$(docker-compose exec -T db psql -U postgres -d printing_platform -t -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';" 2>/dev/null | xargs)
                if [ -n "$active_connections" ]; then
                    status_info "Active connections: $active_connections"
                fi
                
                # Check for long-running queries
                long_queries=$(docker-compose exec -T db psql -U postgres -d printing_platform -t -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '5 minutes';" 2>/dev/null | xargs)
                if [ "$long_queries" -gt 0 ]; then
                    status_warning "Long-running queries detected: $long_queries"
                fi
                
            else
                status_error "Database not accepting connections"
            fi
        else
            status_error "Database container not running"
        fi
    else
        status_warning "Cannot check database (docker-compose not available)"
    fi
}

# Check cache (Redis)
check_cache() {
    echo ""
    echo "=== CACHE (REDIS) ==="
    
    cd "$PROJECT_ROOT"
    
    if command_exists docker-compose; then
        if docker-compose ps redis | grep -q "Up"; then
            status_ok "Redis container running"
            
            # Check Redis connectivity
            if docker-compose exec -T redis redis-cli ping 2>/dev/null | grep -q "PONG"; then
                status_ok "Redis responding to ping"
                
                # Check memory usage
                memory_info=$(docker-compose exec -T redis redis-cli info memory 2>/dev/null | grep "used_memory_human" | cut -d: -f2 | tr -d '\r')
                if [ -n "$memory_info" ]; then
                    status_info "Redis memory usage: $memory_info"
                fi
                
                # Check connected clients
                clients=$(docker-compose exec -T redis redis-cli info clients 2>/dev/null | grep "connected_clients" | cut -d: -f2 | tr -d '\r')
                if [ -n "$clients" ]; then
                    status_info "Connected clients: $clients"
                fi
                
            else
                status_error "Redis not responding"
            fi
        else
            status_warning "Redis container not running (cache may be disabled)"
        fi
    else
        status_warning "Cannot check Redis (docker-compose not available)"
    fi
}

# Check file storage
check_file_storage() {
    echo ""
    echo "=== FILE STORAGE ==="
    
    upload_dir="$PROJECT_ROOT/backend/uploads"
    
    if [ -d "$upload_dir" ]; then
        status_ok "Upload directory exists"
        
        # Check permissions
        if [ -w "$upload_dir" ]; then
            status_ok "Upload directory writable"
        else
            status_error "Upload directory not writable"
        fi
        
        # Check disk usage
        upload_size=$(du -sh "$upload_dir" 2>/dev/null | cut -f1)
        if [ -n "$upload_size" ]; then
            status_info "Upload directory size: $upload_size"
        fi
        
        # Check file count
        file_count=$(find "$upload_dir" -type f 2>/dev/null | wc -l)
        status_info "Total files: $file_count"
        
        # Check for recent uploads
        recent_files=$(find "$upload_dir" -type f -mtime -1 2>/dev/null | wc -l)
        status_info "Files uploaded in last 24h: $recent_files"
        
    else
        status_error "Upload directory not found: $upload_dir"
    fi
}

# Check SSL certificates
check_ssl_certificates() {
    echo ""
    echo "=== SSL CERTIFICATES ==="
    
    if command_exists certbot; then
        cert_info=$(certbot certificates 2>/dev/null | grep -A 5 "Certificate Name" || true)
        
        if [ -n "$cert_info" ]; then
            status_ok "SSL certificates found"
            echo "$cert_info" | while read line; do
                if [[ $line == *"Expiry Date"* ]]; then
                    expiry_date=$(echo "$line" | awk '{print $3}')
                    days_until_expiry=$(( ($(date -d "$expiry_date" +%s) - $(date +%s)) / 86400 ))
                    
                    if [ "$days_until_expiry" -lt 30 ]; then
                        status_error "SSL certificate expires in $days_until_expiry days"
                    elif [ "$days_until_expiry" -lt 60 ]; then
                        status_warning "SSL certificate expires in $days_until_expiry days"
                    else
                        status_ok "SSL certificate expires in $days_until_expiry days"
                    fi
                fi
            done
        else
            status_warning "No SSL certificates found or certbot not configured"
        fi
    else
        status_info "Certbot not installed, skipping SSL check"
    fi
}

# Check backups
check_backups() {
    echo ""
    echo "=== BACKUPS ==="
    
    backup_dir="/var/backups/nordlayer"
    
    if [ -d "$backup_dir" ]; then
        status_ok "Backup directory exists"
        
        # Check for recent backups
        recent_backup=$(find "$backup_dir" -name "nordlayer_*" -mtime -1 2>/dev/null | head -1)
        
        if [ -n "$recent_backup" ]; then
            status_ok "Recent backup found: $(basename "$recent_backup")"
            
            # Check backup size
            backup_size=$(du -sh "$recent_backup" 2>/dev/null | cut -f1)
            status_info "Backup size: $backup_size"
            
            # Check backup integrity
            if [[ "$recent_backup" == *.gz ]]; then
                if gzip -t "$recent_backup" 2>/dev/null; then
                    status_ok "Backup integrity verified"
                else
                    status_error "Backup file appears corrupted"
                fi
            fi
        else
            status_error "No recent backups found (last 24 hours)"
        fi
        
        # Check backup count
        backup_count=$(find "$backup_dir" -name "nordlayer_*" 2>/dev/null | wc -l)
        status_info "Total backups: $backup_count"
        
    else
        status_warning "Backup directory not found: $backup_dir"
    fi
}

# Check logs for errors
check_logs() {
    echo ""
    echo "=== LOG ANALYSIS ==="
    
    cd "$PROJECT_ROOT"
    
    if command_exists docker-compose; then
        # Check for recent errors
        error_count=$(docker-compose logs --since 24h 2>/dev/null | grep -i error | wc -l)
        
        if [ "$error_count" -gt 50 ]; then
            status_error "High error count in logs: $error_count (last 24h)"
        elif [ "$error_count" -gt 10 ]; then
            status_warning "Moderate error count in logs: $error_count (last 24h)"
        else
            status_ok "Error count in logs: $error_count (last 24h)"
        fi
        
        # Check for critical errors
        critical_errors=$(docker-compose logs --since 24h 2>/dev/null | grep -i -E "(critical|fatal|exception)" | wc -l)
        
        if [ "$critical_errors" -gt 0 ]; then
            status_error "Critical errors found: $critical_errors (last 24h)"
        else
            status_ok "No critical errors in logs (last 24h)"
        fi
        
    else
        status_warning "Cannot analyze logs (docker-compose not available)"
    fi
}

# Generate summary report
generate_summary() {
    echo ""
    echo "=== HEALTH CHECK SUMMARY ==="
    echo "Timestamp: $(date)"
    echo "Hostname: $(hostname)"
    echo "Uptime: $(uptime -p 2>/dev/null || uptime)"
    echo ""
    
    # Count status types from log
    ok_count=$(grep -c "✓" "$LOG_FILE" 2>/dev/null || echo "0")
    warning_count=$(grep -c "⚠" "$LOG_FILE" 2>/dev/null || echo "0")
    error_count=$(grep -c "✗" "$LOG_FILE" 2>/dev/null || echo "0")
    
    echo "Results:"
    echo "  ✓ OK: $ok_count"
    echo "  ⚠ Warnings: $warning_count"
    echo "  ✗ Errors: $error_count"
    echo ""
    
    if [ "$error_count" -gt 0 ]; then
        echo "🔴 CRITICAL: System has errors that need immediate attention"
        exit_code=2
    elif [ "$warning_count" -gt 0 ]; then
        echo "🟡 WARNING: System has warnings that should be investigated"
        exit_code=1
    else
        echo "🟢 HEALTHY: All systems operating normally"
        exit_code=0
    fi
    
    echo ""
    echo "Full log saved to: $LOG_FILE"
    
    return $exit_code
}

# Main execution
main() {
    echo "NordLayer 3D Printing Platform - Comprehensive Health Check"
    echo "=========================================================="
    
    # Clear previous log
    > "$LOG_FILE"
    
    # Run all checks
    check_system_resources
    check_docker_services
    check_application_health
    check_database
    check_cache
    check_file_storage
    check_ssl_certificates
    check_backups
    check_logs
    
    # Generate summary and exit with appropriate code
    generate_summary
}

# Run main function
main "$@"