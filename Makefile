# Makefile for NordLayer 3D Printing Platform

.PHONY: help build up down logs clean test lint format

# Default target
help:
	@echo "NordLayer 3D Printing Platform - Docker Commands"
	@echo ""
	@echo "Development Commands:"
	@echo "  make build          - Build all Docker images"
	@echo "  make up             - Start development environment"
	@echo "  make down           - Stop development environment"
	@echo "  make restart        - Restart development environment"
	@echo "  make logs           - Show logs from all services"
	@echo "  make logs-f         - Follow logs from all services"
	@echo ""
	@echo "Production Commands:"
	@echo "  make prod-build     - Build production images"
	@echo "  make prod-up        - Start production environment"
	@echo "  make prod-down      - Stop production environment"
	@echo "  make prod-logs      - Show production logs"
	@echo ""
	@echo "Testing Commands:"
	@echo "  make test           - Run all tests"
	@echo "  make test-backend   - Run backend tests only"
	@echo "  make test-frontend  - Run frontend tests only"
	@echo "  make test-bot       - Run telegram bot tests only"
	@echo ""
	@echo "Maintenance Commands:"
	@echo "  make clean          - Clean up Docker resources"
	@echo "  make clean-all      - Clean up everything including volumes"
	@echo "  make health         - Check health of all services"
	@echo "  make shell-backend  - Open shell in backend container"
	@echo "  make shell-frontend - Open shell in frontend container"
	@echo "  make shell-bot      - Open shell in telegram bot container"

# Development environment
build:
	docker-compose build

up:
	docker-compose up -d
	@echo "Development environment started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend API: http://localhost:8000"
	@echo "Backend Docs: http://localhost:8000/docs"
	@echo "Telegram Bot Health: http://localhost:8080/health"

down:
	docker-compose down

restart: down up

logs:
	docker-compose logs

logs-f:
	docker-compose logs -f

# Production environment
prod-build:
	docker-compose -f docker-compose.prod.yml build

prod-up:
	docker-compose -f docker-compose.prod.yml up -d
	@echo "Production environment started!"
	@echo "Application: https://yourdomain.com"
	@echo "Monitoring: http://localhost:9090 (Prometheus)"
	@echo "Dashboards: http://localhost:3001 (Grafana)"

prod-down:
	docker-compose -f docker-compose.prod.yml down

prod-logs:
	docker-compose -f docker-compose.prod.yml logs

# Testing
test:
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build --abort-on-container-exit
	docker-compose -f docker-compose.yml -f docker-compose.test.yml down

test-backend:
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build backend-test --abort-on-container-exit
	docker-compose -f docker-compose.yml -f docker-compose.test.yml down

test-frontend:
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build frontend-test --abort-on-container-exit
	docker-compose -f docker-compose.yml -f docker-compose.test.yml down

test-bot:
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build telegram-bot-test --abort-on-container-exit
	docker-compose -f docker-compose.yml -f docker-compose.test.yml down

# Health checks
health:
	@echo "Checking service health..."
	@curl -f http://localhost:8000/health && echo " ✓ Backend healthy" || echo " ✗ Backend unhealthy"
	@curl -f http://localhost:3000/health && echo " ✓ Frontend healthy" || echo " ✗ Frontend unhealthy"
	@curl -f http://localhost:8080/health && echo " ✓ Telegram Bot healthy" || echo " ✗ Telegram Bot unhealthy"

# Shell access
shell-backend:
	docker-compose exec backend bash

shell-frontend:
	docker-compose exec frontend sh

shell-bot:
	docker-compose exec telegram-bot bash

shell-db:
	docker-compose exec postgres psql -U postgres -d printing_platform

# Maintenance
clean:
	docker-compose down --rmi local --volumes --remove-orphans
	docker system prune -f

clean-all:
	docker-compose down --rmi all --volumes --remove-orphans
	docker system prune -a -f --volumes

# Database operations
db-migrate:
	docker-compose exec backend alembic upgrade head

db-reset:
	docker-compose exec backend alembic downgrade base
	docker-compose exec backend alembic upgrade head

db-seed:
	docker-compose exec backend python -m app.scripts.init_services
	docker-compose exec backend python -m app.scripts.seed_colors
	docker-compose exec backend python -m app.scripts.populate_projects

# Backup and restore
backup-db:
	docker-compose exec postgres pg_dump -U postgres printing_platform > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore-db:
	@read -p "Enter backup file path: " backup_file; \
	docker-compose exec -T postgres psql -U postgres printing_platform < $$backup_file

# Monitoring
monitor-logs:
	docker-compose logs -f backend frontend telegram-bot

monitor-resources:
	docker stats

# SSL certificate generation (for production)
generate-ssl:
	mkdir -p nginx/ssl
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout nginx/ssl/private.key \
		-out nginx/ssl/certificate.crt \
		-subj "/C=RU/ST=Karelia/L=Petrozavodsk/O=NordLayer/CN=yourdomain.com"

# Update dependencies
update-deps:
	docker-compose exec backend pip list --outdated
	docker-compose exec frontend npm outdated