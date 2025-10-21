# NordLayer 3D Printing Platform - Deployment Guide

This guide covers the complete deployment process for the NordLayer 3D printing platform, including development, staging, and production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Staging Deployment](#staging-deployment)
5. [Production Deployment](#production-deployment)
6. [Database Management](#database-management)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Backup and Recovery](#backup-and-recovery)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

**Minimum Requirements:**
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB SSD
- OS: Ubuntu 20.04+ / CentOS 8+ / macOS 10.15+

**Recommended for Production:**
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 50GB+ SSD
- OS: Ubuntu 22.04 LTS

### Required Software

- Docker 20.10+
- Docker Compose 2.0+
- Git 2.30+
- Node.js 18+ (for frontend development)
- Python 3.9+ (for backend development)

### Optional but Recommended

- Nginx (for reverse proxy)
- PostgreSQL 14+ (for production database)
- Redis 6+ (for caching)
- AWS CLI (for S3 integration)

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/nordlayer-platform.git
cd nordlayer-platform
```

### 2. Environment Configuration

Create environment files for each service:

#### Backend Environment (.env)

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://postgres:password@db:5432/printing_platform
REDIS_URL=redis://redis:6379/0

# Security
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# File Storage
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800  # 50MB
ALLOWED_FILE_TYPES=.stl,.obj,.3mf,.jpg,.jpeg,.png

# S3 Configuration (optional)
USE_S3=false
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET=nordlayer-files

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@nordlayer.com

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_ADMIN_IDS=123456789,987654321

# Performance
ENABLE_CACHING=true
CACHE_TTL=300
```

#### Frontend Environment (.env.local)

```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=NordLayer
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
```

#### Telegram Bot Environment

```bash
cp telegram-bot/.env.example telegram-bot/.env
```

Edit `telegram-bot/.env`:

```env
BOT_TOKEN=your-telegram-bot-token
API_BASE_URL=http://backend:8000
ADMIN_IDS=123456789,987654321
LOG_LEVEL=INFO
```

## Local Development

### 1. Start Development Environment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Initialize Database

```bash
# Run migrations
docker-compose exec backend alembic upgrade head

# Create admin user
docker-compose exec backend python -m app.scripts.create_admin

# Seed initial data
docker-compose exec backend python -m app.scripts.init_services
docker-compose exec backend python -m app.scripts.seed_colors
```

### 3. Access Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Admin Panel**: http://localhost:3000/admin
- **Database**: localhost:5432 (postgres/password)
- **Redis**: localhost:6379

### 4. Development Workflow

```bash
# Backend development
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend development
cd frontend
npm install
npm run dev

# Run tests
cd backend && python -m pytest
cd frontend && npm run test
```

## Staging Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install nginx -y
```

### 2. Deploy Application

```bash
# Clone repository
git clone https://github.com/your-org/nordlayer-platform.git
cd nordlayer-platform

# Checkout staging branch
git checkout staging

# Configure environment
cp backend/.env.production.example backend/.env
cp frontend/.env.example frontend/.env.local
# Edit environment files with staging values

# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Initialize database
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

### 3. Nginx Configuration

Create `/etc/nginx/sites-available/nordlayer-staging`:

```nginx
server {
    listen 80;
    server_name staging.nordlayer.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name staging.nordlayer.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/staging.nordlayer.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging.nordlayer.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # File upload settings
        client_max_body_size 50M;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Static files
    location /uploads/ {
        alias /var/www/nordlayer/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/nordlayer-staging /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Production Deployment

### 1. Production Server Setup

```bash
# Create deployment user
sudo adduser deploy
sudo usermod -aG docker deploy
sudo usermod -aG sudo deploy

# Switch to deploy user
sudo su - deploy

# Setup SSH keys and repository access
ssh-keygen -t rsa -b 4096 -C "deploy@nordlayer.com"
# Add public key to GitHub/GitLab
```

### 2. Production Environment

Create production environment files with secure values:

```bash
# Generate secure secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Use strong database passwords
# Configure production SMTP settings
# Set up S3 bucket for file storage
# Configure monitoring and alerting
```

### 3. Database Setup

For production, use a managed PostgreSQL service or set up a dedicated database server:

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Create database and user
sudo -u postgres psql
CREATE DATABASE printing_platform;
CREATE USER nordlayer WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE printing_platform TO nordlayer;
\q

# Configure PostgreSQL
sudo nano /etc/postgresql/14/main/postgresql.conf
# Set: listen_addresses = 'localhost'
# Set: max_connections = 100

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: local   printing_platform   nordlayer   md5

sudo systemctl restart postgresql
```

### 4. SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d nordlayer.com -d www.nordlayer.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 5. Production Deployment Script

Create `scripts/deploy-production.sh`:

```bash
#!/bin/bash
set -e

echo "Starting production deployment..."

# Pull latest code
git pull origin main

# Build and deploy
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec -T backend alembic upgrade head

# Health check
sleep 30
curl -f http://localhost:8000/health || exit 1

echo "Deployment completed successfully!"
```

## Database Management

### Migrations

```bash
# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "Description"

# Apply migrations
docker-compose exec backend alembic upgrade head

# Rollback migration
docker-compose exec backend alembic downgrade -1

# View migration history
docker-compose exec backend alembic history
```

### Backup and Restore

```bash
# Create backup
./scripts/backup/backup-database.sh

# Restore from backup
./scripts/backup/restore-database.sh /path/to/backup.sql.gz

# Setup automated backups
./scripts/backup/setup-cron-backup.sh -f daily -t 02:00
```

## Monitoring and Logging

### 1. Application Monitoring

The platform includes built-in monitoring endpoints:

- **Health Check**: `/health`
- **Metrics**: `/metrics`
- **Performance**: `/performance`

### 2. Log Management

```bash
# View application logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f telegram-bot

# Configure log rotation
sudo nano /etc/logrotate.d/nordlayer
```

### 3. Monitoring Setup

For production monitoring, consider:

- **Prometheus + Grafana**: Metrics collection and visualization
- **ELK Stack**: Log aggregation and analysis
- **Uptime monitoring**: Pingdom, UptimeRobot, or similar
- **Error tracking**: Sentry or similar service

## Backup and Recovery

### Automated Backups

```bash
# Setup daily database backups
./scripts/backup/setup-cron-backup.sh

# Configure S3 backup storage
export S3_BUCKET=nordlayer-backups
export AWS_REGION=us-east-1
```

### File Backups

```bash
# Backup uploaded files
rsync -av uploads/ /backup/nordlayer-files/

# S3 sync for file backups
aws s3 sync uploads/ s3://nordlayer-backups/files/
```

### Disaster Recovery

1. **Database Recovery**: Use automated backups to restore database
2. **File Recovery**: Restore files from S3 or local backups
3. **Application Recovery**: Redeploy from Git repository
4. **DNS Failover**: Configure DNS to point to backup server

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check database status
docker-compose exec db pg_isready

# View database logs
docker-compose logs db

# Test connection
docker-compose exec backend python -c "from app.core.database import engine; print(engine.execute('SELECT 1').scalar())"
```

#### 2. File Upload Issues

```bash
# Check upload directory permissions
ls -la uploads/

# Check disk space
df -h

# View backend logs for file errors
docker-compose logs backend | grep -i "file\|upload"
```

#### 3. Performance Issues

```bash
# Check resource usage
docker stats

# View performance metrics
curl http://localhost:8000/performance

# Check database performance
docker-compose exec db psql -U postgres -d printing_platform -c "SELECT * FROM pg_stat_activity;"
```

#### 4. SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL configuration
openssl s_client -connect nordlayer.com:443
```

### Log Locations

- **Application logs**: `docker-compose logs [service]`
- **Nginx logs**: `/var/log/nginx/`
- **System logs**: `/var/log/syslog`
- **Cron logs**: `/var/log/cron`

### Performance Tuning

#### Database Optimization

```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Analyze table statistics
ANALYZE;

-- Vacuum tables
VACUUM ANALYZE;
```

#### Application Optimization

```bash
# Enable Redis caching
export ENABLE_CACHING=true
export REDIS_URL=redis://localhost:6379/0

# Optimize file serving
# Use CDN for static assets
# Enable gzip compression in Nginx
```

## Security Considerations

### 1. Environment Security

- Use strong, unique passwords
- Rotate secrets regularly
- Limit database access
- Use HTTPS everywhere
- Keep software updated

### 2. Application Security

- Validate all inputs
- Use parameterized queries
- Implement rate limiting
- Monitor for suspicious activity
- Regular security audits

### 3. Infrastructure Security

- Configure firewall rules
- Use SSH keys instead of passwords
- Regular security updates
- Monitor system logs
- Backup encryption

## Maintenance

### Regular Tasks

- **Daily**: Check application health, review logs
- **Weekly**: Update dependencies, review metrics
- **Monthly**: Security updates, backup verification
- **Quarterly**: Performance review, capacity planning

### Update Process

```bash
# Update application
git pull origin main
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose pull
```

This deployment guide provides a comprehensive overview of deploying and maintaining the NordLayer 3D printing platform. For specific issues or advanced configurations, refer to the individual service documentation or contact the development team.