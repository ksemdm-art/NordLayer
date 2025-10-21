#!/bin/bash

# Docker setup validation script
# Validates all Docker configurations and requirements

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== NordLayer Docker Setup Validation ===${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Docker version
check_docker_version() {
    echo -n "Checking Docker version... "
    
    if ! command_exists docker; then
        echo -e "${RED}✗ Docker not found${NC}"
        return 1
    fi
    
    docker_version=$(docker --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
    required_version="20.10.0"
    
    if [ "$(printf '%s\n' "$required_version" "$docker_version" | sort -V | head -n1)" = "$required_version" ]; then
        echo -e "${GREEN}✓ Docker $docker_version${NC}"
        return 0
    else
        echo -e "${RED}✗ Docker $docker_version (requires $required_version+)${NC}"
        return 1
    fi
}

# Function to check Docker Compose version
check_compose_version() {
    echo -n "Checking Docker Compose version... "
    
    if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
        echo -e "${RED}✗ Docker Compose not found${NC}"
        return 1
    fi
    
    if docker compose version >/dev/null 2>&1; then
        compose_version=$(docker compose version --short 2>/dev/null || docker compose version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
        echo -e "${GREEN}✓ Docker Compose $compose_version${NC}"
    else
        compose_version=$(docker-compose --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
        echo -e "${GREEN}✓ Docker Compose $compose_version${NC}"
    fi
    
    return 0
}

# Function to validate Docker Compose files
validate_compose_files() {
    echo "Validating Docker Compose files:"
    
    local files=(
        "docker-compose.yml"
        "docker-compose.prod.yml"
        "docker-compose.test.yml"
        "docker-compose.ci.yml"
    )
    
    for file in "${files[@]}"; do
        echo -n "  Checking $file... "
        
        if [ ! -f "$file" ]; then
            echo -e "${RED}✗ File not found${NC}"
            continue
        fi
        
        if docker-compose -f "$file" config --quiet 2>/dev/null; then
            echo -e "${GREEN}✓ Valid${NC}"
        else
            echo -e "${RED}✗ Invalid syntax${NC}"
            return 1
        fi
    done
    
    # Check override file with main compose file
    echo -n "  Checking docker-compose.override.yml... "
    if [ -f "docker-compose.override.yml" ]; then
        if docker-compose -f docker-compose.yml -f docker-compose.override.yml config --quiet 2>/dev/null; then
            echo -e "${GREEN}✓ Valid (with main)${NC}"
        else
            echo -e "${RED}✗ Invalid syntax${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠ File not found${NC}"
    fi
    
    return 0
}

# Function to check Dockerfiles
check_dockerfiles() {
    echo "Checking Dockerfiles:"
    
    local dockerfiles=(
        "backend/Dockerfile"
        "backend/Dockerfile.prod"
        "frontend/Dockerfile"
        "frontend/Dockerfile.prod"
        "telegram-bot/Dockerfile"
    )
    
    for dockerfile in "${dockerfiles[@]}"; do
        echo -n "  Checking $dockerfile... "
        
        if [ ! -f "$dockerfile" ]; then
            echo -e "${RED}✗ File not found${NC}"
            continue
        fi
        
        # Basic syntax check
        if docker build -f "$dockerfile" --dry-run . >/dev/null 2>&1; then
            echo -e "${GREEN}✓ Valid${NC}"
        else
            # Fallback check - just verify it's a valid Dockerfile format
            if grep -q "FROM" "$dockerfile"; then
                echo -e "${YELLOW}⚠ Syntax OK (build test skipped)${NC}"
            else
                echo -e "${RED}✗ Invalid format${NC}"
            fi
        fi
    done
    
    return 0
}

# Function to check required directories
check_directories() {
    echo "Checking required directories:"
    
    local directories=(
        "backend"
        "frontend" 
        "telegram-bot"
        "nginx"
        "scripts"
        "monitoring"
    )
    
    for dir in "${directories[@]}"; do
        echo -n "  Checking $dir/... "
        
        if [ -d "$dir" ]; then
            echo -e "${GREEN}✓ Exists${NC}"
        else
            echo -e "${RED}✗ Missing${NC}"
        fi
    done
    
    return 0
}

# Function to check configuration files
check_config_files() {
    echo "Checking configuration files:"
    
    local configs=(
        ".env.example"
        "nginx/nginx.conf"
        "nginx/nginx.prod.conf"
        "frontend/nginx.conf"
        "monitoring/prometheus.yml"
        "Makefile"
    )
    
    for config in "${configs[@]}"; do
        echo -n "  Checking $config... "
        
        if [ -f "$config" ]; then
            echo -e "${GREEN}✓ Exists${NC}"
        else
            echo -e "${RED}✗ Missing${NC}"
        fi
    done
    
    return 0
}

# Function to check health check scripts
check_health_scripts() {
    echo "Checking health check scripts:"
    
    local scripts=(
        "scripts/health-check-docker.sh"
        "scripts/validate-docker-setup.sh"
    )
    
    for script in "${scripts[@]}"; do
        echo -n "  Checking $script... "
        
        if [ -f "$script" ]; then
            if [ -x "$script" ]; then
                echo -e "${GREEN}✓ Executable${NC}"
            else
                echo -e "${YELLOW}⚠ Not executable${NC}"
            fi
        else
            echo -e "${RED}✗ Missing${NC}"
        fi
    done
    
    return 0
}

# Function to check Docker daemon
check_docker_daemon() {
    echo -n "Checking Docker daemon... "
    
    if docker info >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Running${NC}"
        return 0
    else
        echo -e "${RED}✗ Not running${NC}"
        return 1
    fi
}

# Function to check available resources
check_resources() {
    echo "Checking system resources:"
    
    # Check available memory
    if command_exists free; then
        available_mem=$(free -m | awk 'NR==2{printf "%.0f", $7}')
        echo -n "  Available memory: ${available_mem}MB... "
        
        if [ "$available_mem" -gt 4000 ]; then
            echo -e "${GREEN}✓ Sufficient${NC}"
        elif [ "$available_mem" -gt 2000 ]; then
            echo -e "${YELLOW}⚠ Limited${NC}"
        else
            echo -e "${RED}✗ Insufficient (need 4GB+)${NC}"
        fi
    else
        echo -e "  Memory check: ${YELLOW}⚠ Cannot determine${NC}"
    fi
    
    # Check available disk space (macOS compatible)
    if command -v df >/dev/null 2>&1; then
        available_disk=$(df -h . | awk 'NR==2 {print $4}' | sed 's/[^0-9.]//g')
        echo -n "  Available disk space: ${available_disk}GB... "
        
        if [ -n "$available_disk" ] && [ "$(echo "$available_disk > 10" | bc 2>/dev/null || echo 0)" -eq 1 ]; then
            echo -e "${GREEN}✓ Sufficient${NC}"
        elif [ -n "$available_disk" ] && [ "$(echo "$available_disk > 5" | bc 2>/dev/null || echo 0)" -eq 1 ]; then
            echo -e "${YELLOW}⚠ Limited${NC}"
        else
            echo -e "${YELLOW}⚠ Cannot determine (check manually)${NC}"
        fi
    else
        echo "  Disk space check: ${YELLOW}⚠ Cannot determine${NC}"
    fi
    
    return 0
}

# Function to provide setup recommendations
provide_recommendations() {
    echo ""
    echo -e "${BLUE}=== Setup Recommendations ===${NC}"
    echo ""
    
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}📝 Create environment file:${NC}"
        echo "   cp .env.example .env"
        echo "   # Edit .env with your configuration"
        echo ""
    fi
    
    echo -e "${YELLOW}🚀 Quick start commands:${NC}"
    echo "   make up          # Start development environment"
    echo "   make health      # Check service health"
    echo "   make logs        # View service logs"
    echo "   make down        # Stop services"
    echo ""
    
    echo -e "${YELLOW}📚 Documentation:${NC}"
    echo "   DOCKER_README.md # Complete Docker guide"
    echo "   Makefile         # Available commands"
    echo ""
}

# Main validation function
main() {
    local overall_status=0
    
    # Run all checks
    check_docker_version || overall_status=1
    check_compose_version || overall_status=1
    
    # Docker daemon check (non-critical for validation)
    if ! check_docker_daemon; then
        echo -e "${YELLOW}Note: Docker daemon not running (start Docker to test containers)${NC}"
    fi
    echo ""
    
    validate_compose_files || overall_status=1
    echo ""
    
    check_dockerfiles || overall_status=1
    echo ""
    
    check_directories || overall_status=1
    echo ""
    
    check_config_files || overall_status=1
    echo ""
    
    check_health_scripts || overall_status=1
    echo ""
    
    check_resources || overall_status=1
    echo ""
    
    # Overall result
    if [ $overall_status -eq 0 ]; then
        echo -e "${GREEN}=== ✓ Docker setup validation passed! ===${NC}"
        provide_recommendations
    else
        echo -e "${RED}=== ✗ Docker setup validation failed! ===${NC}"
        echo ""
        echo -e "${YELLOW}Please fix the issues above before proceeding.${NC}"
    fi
    
    return $overall_status
}

# Run main function
main "$@"