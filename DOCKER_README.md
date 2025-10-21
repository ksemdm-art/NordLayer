# Docker Setup Guide for NordLayer 3D Printing Platform

This guide covers the complete Docker containerization setup for the NordLayer 3D Printing Platform.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Docker Compose Files](#docker-compose-files)
- [Environment Configuration](#environment-configuration)
- [Development Workflow](#development-workflow)
- [Production Deployment](#production-deployment)
- [Testing](#testing)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

## 🔧 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Make (optional, for convenience commands)
- 4GB+ RAM available for containers
- 10GB+ disk space

## 🚀 Quick Start

### Development Environment

1. **Clone and setup environment:**
   ```bash
   git clone <repository-url>
   cd nordlayer-3d-platform
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Start the development environment:**
   ```bash
   # Using Make (recommended)
   make up
   
   # Or using Docker Compose directly
   docker-compose up -d
   ```

3. **Access the services:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Telegram Bot Health: http://localhost:8080/health

4. **Check service health:**
   ```bash
   make health
   # Or
   ./scripts/health-check-docker.sh
   ```

### Production Environment

1. **Setup production environment:**
   ```bash
   cp .env.example .env.production
   # Configure production values in .env.production
   ```

2. **Generate SSL certificates:**
   ```bash
   make generate-ssl
   # Or provide your own certificates in nginx/ssl/
   ```

3. **Deploy to production:**
   ```bash
   make prod-up
   ```

## 📁 Docker Compose Files

### Core Files

- **`docker-compose.yml`** - Main development configuration
- **`docker-compose.prod.yml`** - Production configuration with optimizations
- **`docker-compose.override.yml`** - Development overrides (auto-loaded)
- **`docker-compose.test.yml`** - Testing configuration
- **`docker-compose.ci.yml`** - CI/CD optimized configuration

### Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │   Frontend      │    │    Backend      │
│  (Reverse Proxy)│◄──►│   (Vue.js)      │◄──►│   (FastAPI)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                              │
         ▼                                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Telegram Bot    │    │   PostgreSQL    │    │     Redis       │
│   (Python)      │◄──►│   (Database)    │◄──►│    (Cache)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ⚙️ Environment Configuration

### Required Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Database
POSTGRES_PASSWORD=your-secure-password
DATABASE_URL=postgresql://postgres:your-secure-password@postgres:5432/printing_platform

# Security
SECRET_KEY=your-very-secure-secret-key-here

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
ADMIN_CHAT_IDS=123456789,987654321

# Domain (for production)
DOMAIN_NAME=yourdomain.com
```

### Development vs Production

| Setting | Development | Production |
|---------|-------------|------------|
| Debug Mode | Enabled | Disabled |
| SSL/TLS | HTTP only | HTTPS required |
| File Volumes | Bind mounts | Named volumes |
| Resource Limits | None | Configured |
| Health Checks | Basic | Comprehensive |
| Monitoring | Optional | Enabled |

## 🔄 Development Workflow

### Starting Development

```bash
# Start all services
make up

# View logs
make logs-f

# Check health
make health
```

### Making Changes

The development setup includes:
- **Hot reload** for backend (uvicorn --reload)
- **Hot reload** for frontend (Vite HMR)
- **Volume mounts** for live code updates
- **Debug logging** enabled

### Database Operations

```bash
# Run migrations
make db-migrate

# Reset database
make db-reset

# Seed with sample data
make db-seed

# Backup database
make backup-db

# Access database shell
make shell-db
```

### Container Access

```bash
# Backend shell
make shell-backend

# Frontend shell
make shell-frontend

# Bot shell
make shell-bot
```

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] SSL certificates configured
- [ ] Environment variables set
- [ ] Domain DNS configured
- [ ] Firewall rules configured
- [ ] Backup strategy in place

### Deployment Steps

1. **Build production images:**
   ```bash
   make prod-build
   ```

2. **Deploy services:**
   ```bash
   make prod-up
   ```

3. **Verify deployment:**
   ```bash
   curl -f https://yourdomain.com/health
   ```

### Production Features

- **Multi-stage builds** for optimized images
- **Non-root users** for security
- **Resource limits** and reservations
- **Health checks** for all services
- **Nginx optimization** with caching
- **SSL/TLS termination**
- **Rate limiting** and security headers
- **Log aggregation** with Fluentd
- **Monitoring** with Prometheus/Grafana

## 🧪 Testing

### Running Tests

```bash
# All tests
make test

# Specific service tests
make test-backend
make test-frontend
make test-bot
```

### CI/CD Testing

```bash
# Run CI pipeline locally
docker-compose -f docker-compose.ci.yml up --abort-on-container-exit
```

### Test Coverage

Test results and coverage reports are generated in:
- Backend: `backend/htmlcov/`
- Frontend: `frontend/coverage/`
- Bot: `telegram-bot/htmlcov/`

## 📊 Monitoring

### Built-in Monitoring

The production setup includes:

- **Prometheus** (http://localhost:9090) - Metrics collection
- **Grafana** (http://localhost:3001) - Dashboards
- **Health checks** - All services monitored
- **Log aggregation** - Centralized logging

### Health Check Endpoints

| Service | Endpoint | Purpose |
|---------|----------|---------|
| Backend | `/health` | API health |
| Frontend | `/health` | Web app health |
| Bot | `/health` | Bot connectivity |
| Nginx | `/health` | Proxy health |

### Monitoring Commands

```bash
# Check all services
make health

# Monitor logs
make monitor-logs

# Monitor resources
make monitor-resources
```

## 🔧 Troubleshooting

### Common Issues

#### Services Won't Start

```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs [service-name]

# Check health
./scripts/health-check-docker.sh
```

#### Database Connection Issues

```bash
# Check PostgreSQL
make shell-db
# Or
docker-compose exec postgres pg_isready -U postgres
```

#### File Upload Issues

```bash
# Check upload directory permissions
docker-compose exec backend ls -la uploads/

# Check nginx configuration
docker-compose exec nginx nginx -t
```

#### Memory Issues

```bash
# Check resource usage
docker stats

# Increase Docker memory limit in Docker Desktop
# Or add swap space on Linux
```

### Debug Mode

Enable debug logging:

```bash
# Set in .env
DEBUG=true
LOG_LEVEL=DEBUG

# Restart services
make restart
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Check slow queries (if database issues)
docker-compose exec postgres psql -U postgres -d printing_platform -c "SELECT * FROM pg_stat_activity;"
```

## 🛠️ Maintenance

### Regular Maintenance

```bash
# Update dependencies
make update-deps

# Clean up unused resources
make clean

# Full cleanup (careful!)
make clean-all
```

### Backup and Restore

```bash
# Backup database
make backup-db

# Restore database
make restore-db
```

### Updates and Upgrades

1. **Update application code:**
   ```bash
   git pull origin main
   make build
   make up
   ```

2. **Update base images:**
   ```bash
   docker-compose pull
   make build
   ```

3. **Database migrations:**
   ```bash
   make db-migrate
   ```

### Security Updates

```bash
# Scan for vulnerabilities
docker-compose -f docker-compose.ci.yml up security-scan

# Update base images
docker-compose pull
make build
```

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Docker Guide](https://fastapi.tiangolo.com/deployment/docker/)
- [Vue.js Docker Guide](https://vuejs.org/guide/best-practices/production-deployment.html)
- [Nginx Docker Guide](https://hub.docker.com/_/nginx)

## 🆘 Support

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Run the health check script: `./scripts/health-check-docker.sh`
3. Check service logs: `make logs`
4. Review the Docker Compose configuration
5. Open an issue with detailed logs and configuration

---

**Note:** This setup is optimized for the NordLayer 3D Printing Platform and includes all necessary services for development, testing, and production deployment.