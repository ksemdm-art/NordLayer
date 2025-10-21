#!/bin/bash

# NordLayer Test Runner Script
# This script runs different types of tests for the 3D printing platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if service is running
check_service() {
    local service=$1
    local port=$2
    
    if nc -z localhost $port 2>/dev/null; then
        print_success "$service is running on port $port"
        return 0
    else
        print_warning "$service is not running on port $port"
        return 1
    fi
}

# Function to start services
start_services() {
    print_status "Starting required services..."
    
    # Check if Docker is available
    if command_exists docker; then
        # Start PostgreSQL
        if ! check_service "PostgreSQL" 5432; then
            print_status "Starting PostgreSQL with Docker..."
            docker run -d --name test-postgres \
                -e POSTGRES_PASSWORD=postgres \
                -e POSTGRES_DB=test_db \
                -p 5432:5432 \
                postgres:15 || print_warning "Failed to start PostgreSQL"
        fi
        
        # Start Redis
        if ! check_service "Redis" 6379; then
            print_status "Starting Redis with Docker..."
            docker run -d --name test-redis \
                -p 6379:6379 \
                redis:7 || print_warning "Failed to start Redis"
        fi
        
        # Wait for services to be ready
        sleep 5
    else
        print_warning "Docker not available. Please ensure PostgreSQL and Redis are running manually."
    fi
}

# Function to stop services
stop_services() {
    print_status "Stopping test services..."
    
    if command_exists docker; then
        docker stop test-postgres test-redis 2>/dev/null || true
        docker rm test-postgres test-redis 2>/dev/null || true
    fi
}

# Function to setup environment
setup_environment() {
    print_status "Setting up test environment..."
    
    # Backend setup
    cd backend
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/test_db" >> .env
        echo "REDIS_URL=redis://localhost:6379" >> .env
        echo "ENVIRONMENT=testing" >> .env
        print_status "Created .env file for testing"
    fi
    
    # Install Python dependencies
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        print_status "Created Python virtual environment"
    fi
    
    source venv/bin/activate
    pip install -r requirements.txt
    pip install pytest-cov pytest-xdist pytest-html
    
    # Run database migrations
    print_status "Running database migrations..."
    alembic upgrade head
    
    cd ..
    
    # Frontend setup
    if [ -d "frontend" ]; then
        cd frontend
        if [ ! -d "node_modules" ]; then
            print_status "Installing frontend dependencies..."
            npm install
        fi
        cd ..
    fi
    
    # Telegram bot setup
    if [ -d "telegram-bot" ]; then
        cd telegram-bot
        if [ ! -f .env ]; then
            cp .env.example .env
            echo "TELEGRAM_BOT_TOKEN=test_token" >> .env
            echo "API_BASE_URL=http://localhost:8000" >> .env
            echo "ENVIRONMENT=testing" >> .env
        fi
        cd ..
    fi
}

# Function to run backend tests
run_backend_tests() {
    print_status "Running backend tests..."
    
    cd backend
    source venv/bin/activate
    
    # Run different types of tests based on arguments
    case $1 in
        "unit")
            print_status "Running unit tests..."
            pytest tests/ -v -m "unit" --cov=app --cov-report=html --cov-report=xml
            ;;
        "integration")
            print_status "Running integration tests..."
            pytest tests/ -v -m "integration" --tb=short
            ;;
        "e2e")
            print_status "Running E2E tests..."
            pytest tests/e2e/ -v --tb=short
            ;;
        "performance")
            print_status "Running performance tests..."
            pytest tests/e2e/test_3d_viewer_performance.py -v -m "performance"
            ;;
        "all"|"")
            print_status "Running all backend tests..."
            pytest tests/ -v --cov=app --cov-report=html --cov-report=xml --html=report.html --self-contained-html
            ;;
        *)
            print_error "Unknown test type: $1"
            exit 1
            ;;
    esac
    
    cd ..
}

# Function to run frontend tests
run_frontend_tests() {
    if [ ! -d "frontend" ]; then
        print_warning "Frontend directory not found, skipping frontend tests"
        return
    fi
    
    print_status "Running frontend tests..."
    
    cd frontend
    
    # Run linting
    print_status "Running ESLint..."
    npm run lint
    
    # Run type checking
    print_status "Running TypeScript type checking..."
    npm run type-check
    
    # Run unit tests
    print_status "Running frontend unit tests..."
    npm run test:unit -- --coverage
    
    # Build application
    print_status "Building frontend application..."
    npm run build
    
    cd ..
}

# Function to run telegram bot tests
run_telegram_tests() {
    if [ ! -d "telegram-bot" ]; then
        print_warning "Telegram bot directory not found, skipping telegram tests"
        return
    fi
    
    print_status "Running Telegram bot tests..."
    
    cd telegram-bot
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    pip install -r requirements.txt
    pip install pytest pytest-asyncio pytest-cov
    
    pytest -v --cov=. --cov-report=html --cov-report=xml
    
    cd ..
}

# Function to run security tests
run_security_tests() {
    print_status "Running security tests..."
    
    # Backend security
    cd backend
    source venv/bin/activate
    
    # Install security tools
    pip install safety bandit
    
    # Check for known vulnerabilities
    print_status "Checking for known vulnerabilities..."
    safety check -r requirements.txt
    
    # Run static security analysis
    print_status "Running static security analysis..."
    bandit -r app/ -f json -o bandit-report.json
    
    cd ..
    
    # Frontend security
    if [ -d "frontend" ]; then
        cd frontend
        print_status "Running npm audit..."
        npm audit --audit-level moderate
        cd ..
    fi
}

# Function to generate test report
generate_report() {
    print_status "Generating test report..."
    
    # Create reports directory
    mkdir -p reports
    
    # Copy backend coverage reports
    if [ -d "backend/htmlcov" ]; then
        cp -r backend/htmlcov reports/backend-coverage
    fi
    
    if [ -f "backend/coverage.xml" ]; then
        cp backend/coverage.xml reports/backend-coverage.xml
    fi
    
    if [ -f "backend/report.html" ]; then
        cp backend/report.html reports/backend-test-report.html
    fi
    
    # Copy frontend coverage reports
    if [ -d "frontend/coverage" ]; then
        cp -r frontend/coverage reports/frontend-coverage
    fi
    
    # Copy telegram bot coverage reports
    if [ -d "telegram-bot/htmlcov" ]; then
        cp -r telegram-bot/htmlcov reports/telegram-bot-coverage
    fi
    
    print_success "Test reports generated in ./reports/ directory"
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up..."
    stop_services
    
    # Remove temporary files
    find . -name "*.pyc" -delete
    find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
    find . -name ".pytest_cache" -type d -exec rm -rf {} + 2>/dev/null || true
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS] [TEST_TYPE]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -s, --setup         Setup environment only"
    echo "  -c, --cleanup       Cleanup only"
    echo "  --no-services       Don't start/stop services"
    echo "  --report            Generate test report"
    echo ""
    echo "Test Types:"
    echo "  unit                Run unit tests only"
    echo "  integration         Run integration tests only"
    echo "  e2e                 Run E2E tests only"
    echo "  performance         Run performance tests only"
    echo "  frontend            Run frontend tests only"
    echo "  telegram            Run telegram bot tests only"
    echo "  security            Run security tests only"
    echo "  all                 Run all tests (default)"
    echo ""
    echo "Examples:"
    echo "  $0                  Run all tests"
    echo "  $0 unit             Run unit tests only"
    echo "  $0 e2e              Run E2E tests only"
    echo "  $0 --setup          Setup environment only"
    echo "  $0 --cleanup        Cleanup only"
}

# Main execution
main() {
    local test_type="all"
    local setup_only=false
    local cleanup_only=false
    local no_services=false
    local generate_report_only=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -s|--setup)
                setup_only=true
                shift
                ;;
            -c|--cleanup)
                cleanup_only=true
                shift
                ;;
            --no-services)
                no_services=true
                shift
                ;;
            --report)
                generate_report_only=true
                shift
                ;;
            unit|integration|e2e|performance|frontend|telegram|security|all)
                test_type=$1
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Handle cleanup only
    if [ "$cleanup_only" = true ]; then
        cleanup
        exit 0
    fi
    
    # Handle report generation only
    if [ "$generate_report_only" = true ]; then
        generate_report
        exit 0
    fi
    
    # Trap to cleanup on exit
    trap cleanup EXIT
    
    print_status "Starting NordLayer test suite..."
    
    # Start services if needed
    if [ "$no_services" = false ]; then
        start_services
    fi
    
    # Setup environment
    setup_environment
    
    # Handle setup only
    if [ "$setup_only" = true ]; then
        print_success "Environment setup completed"
        exit 0
    fi
    
    # Run tests based on type
    case $test_type in
        "frontend")
            run_frontend_tests
            ;;
        "telegram")
            run_telegram_tests
            ;;
        "security")
            run_security_tests
            ;;
        "all")
            run_backend_tests "all"
            run_frontend_tests
            run_telegram_tests
            run_security_tests
            ;;
        *)
            run_backend_tests $test_type
            ;;
    esac
    
    # Generate report
    generate_report
    
    print_success "All tests completed successfully!"
}

# Run main function with all arguments
main "$@"