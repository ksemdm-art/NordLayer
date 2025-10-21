# NordLayer 3D Printing Platform - Operations Guide

This guide covers day-to-day operations, maintenance, monitoring, and troubleshooting for the NordLayer 3D printing platform.

## Table of Contents

1. [System Overview](#system-overview)
2. [Daily Operations](#daily-operations)
3. [Monitoring and Alerting](#monitoring-and-alerting)
4. [Performance Management](#performance-management)
5. [Backup and Recovery](#backup-and-recovery)
6. [Security Operations](#security-operations)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance Procedures](#maintenance-procedures)
9. [Incident Response](#incident-response)
10. [Capacity Planning](#capacity-planning)

## System Overview

### Architecture Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │  Telegram Bot   │
│   (Vue.js)      │◄──►│   (FastAPI)     │◄──►│   (Python)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │   PostgreSQL    │    │     Redis       │
│  (Reverse Proxy)│    │   (Database)    │    │    (Cache)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Service Dependencies

- **Frontend** → Backend API
- **Backend** → PostgreSQL, Redis, File Storage
- **Telegram Bot** → Backend API
- **Nginx** → Frontend, Backend

### Key Metrics to Monitor

- **Response Time**: API endpoints < 500ms
- **Uptime**: > 99.9%
- **Database Connections**: < 80% of max
- **Memory Usage**: < 80% of available
- **Disk Usage**: < 85% of available
- **Error Rate**: < 1% of requests

## Daily Operations

### Morning Checklist

```bash
#!/bin/bash
# Daily health check script

echo "=== NordLayer Daily Health Check ==="
echo "Date: $(date)"
echo ""

# 1. Check service status
echo "1. Service Status:"
docker-compose ps

# 2. Check system resources
echo -e "\n2. System Resources:"
echo "Memory Usage:"
free -h
echo "Disk Usage:"
df -h | grep -E "(/$|/var)"

# 3. Check application health
echo -e "\n3. Application Health:"
curl -s http://localhost:8000/health | jq '.'

# 4. Check recent errors
echo -e "\n4. Recent Errors (last 24h):"
docker-compose logs --since 24h | grep -i error | tail -10

# 5. Check database status
echo -e "\n5. Database Status:"
docker-compose exec -T db pg_isready

# 6. Check backup status
echo -e "\n6. Last Backup:"
ls -la /var/backups/nordlayer/ | tail -3

echo -e "\n=== Health Check Complete ==="
```

### Key Daily Tasks

1. **System Health Check** (5 minutes)
   - Run daily health check script
   - Review system metrics
   - Check for any alerts

2. **Log Review** (10 minutes)
   - Check error logs for issues
   - Review performance metrics
   - Monitor user activity

3. **Backup Verification** (5 minutes)
   - Verify last night's backup completed
   - Check backup file integrity
   - Monitor backup storage usage

4. **Security Review** (5 minutes)
   - Check for failed login attempts
   - Review access logs
   - Monitor for suspicious activity

## Monitoring and Alerting

### Health Check Endpoints

```bash
# Application health
curl http://localhost:8000/health

# Performance metrics
curl http://localhost:8000/performance

# Database health
curl http://localhost:8000/health/db

# Cache health
curl http://localhost:8000/health/cache
```

### Key Metrics Dashboard

Create a monitoring dashboard with these metrics:

#### System Metrics
- CPU Usage (%)
- Memory Usage (%)
- Disk Usage (%)
- Network I/O
- Load Average

#### Application Metrics
- Request Rate (req/sec)
- Response Time (ms)
- Error Rate (%)
- Active Users
- Database Connections

#### Business Metrics
- New Orders (daily)
- File Uploads (daily)
- User Registrations (daily)
- Revenue (daily/monthly)

### Alerting Rules

```yaml
# Example Prometheus alerting rules
groups:
  - name: nordlayer.rules
    rules:
      - alert: HighResponseTime
        expr: http_request_duration_seconds{quantile="0.95"} > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          
      - alert: DatabaseDown
        expr: up{job="postgresql"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database is down"
          
      - alert: DiskSpaceHigh
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.15
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Disk space is running low"
```

### Log Monitoring

```bash
# Monitor error logs in real-time
docker-compose logs -f | grep -i error

# Check for specific patterns
docker-compose logs --since 1h | grep -E "(500|error|exception|failed)"

# Monitor file upload issues
docker-compose logs backend | grep -i "upload\|file" | tail -20

# Monitor database performance
docker-compose logs db | grep -E "(slow|lock|deadlock)" | tail -10
```

## Performance Management

### Performance Monitoring Script

```bash
#!/bin/bash
# Performance monitoring script

echo "=== Performance Report ==="
echo "Generated: $(date)"
echo ""

# API Response Times
echo "1. API Response Times (last hour):"
curl -s http://localhost:8000/performance | jq '.metrics'

# Database Performance
echo -e "\n2. Database Performance:"
docker-compose exec -T db psql -U postgres -d printing_platform -c "
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_rows
FROM pg_stat_user_tables 
ORDER BY n_live_tup DESC 
LIMIT 10;"

# Cache Hit Rate
echo -e "\n3. Cache Performance:"
docker-compose exec -T redis redis-cli info stats | grep -E "(hits|misses)"

# File Storage Usage
echo -e "\n4. File Storage:"
du -sh uploads/
ls -la uploads/ | wc -l
echo "Total files"

echo -e "\n=== Performance Report Complete ==="
```

### Performance Optimization

#### Database Optimization

```sql
-- Check slow queries
SELECT 
    query,
    mean_time,
    calls,
    total_time
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;

-- Analyze table statistics
ANALYZE;

-- Update table statistics
VACUUM ANALYZE;
```

#### Cache Optimization

```bash
# Check Redis memory usage
docker-compose exec redis redis-cli info memory

# Check cache hit rate
docker-compose exec redis redis-cli info stats

# Clear cache if needed
docker-compose exec redis redis-cli flushall
```

#### File Storage Optimization

```bash
# Clean up temporary files
find uploads/temp -type f -mtime +1 -delete

# Optimize images (if imagemagick is available)
find uploads/images -name "*.jpg" -exec mogrify -quality 85 {} \;

# Compress old STL files
find uploads/models -name "*.stl" -mtime +30 -exec gzip {} \;
```

## Backup and Recovery

### Backup Operations

#### Daily Backup Check

```bash
#!/bin/bash
# Check backup status

BACKUP_DIR="/var/backups/nordlayer"
TODAY=$(date +%Y%m%d)

echo "=== Backup Status Check ==="

# Check if today's backup exists
if ls ${BACKUP_DIR}/nordlayer_*${TODAY}* 1> /dev/null 2>&1; then
    echo "✓ Today's backup found:"
    ls -la ${BACKUP_DIR}/nordlayer_*${TODAY}*
else
    echo "✗ No backup found for today!"
    echo "Last backup:"
    ls -la ${BACKUP_DIR}/ | tail -3
fi

# Check backup integrity
echo -e "\nChecking backup integrity..."
LATEST_BACKUP=$(ls -t ${BACKUP_DIR}/nordlayer_*.gz | head -1)
if [ -f "$LATEST_BACKUP" ]; then
    if gzip -t "$LATEST_BACKUP"; then
        echo "✓ Latest backup integrity OK"
    else
        echo "✗ Latest backup is corrupted!"
    fi
fi

# Check backup size
echo -e "\nBackup sizes (last 7 days):"
find ${BACKUP_DIR} -name "nordlayer_*.gz" -mtime -7 -exec ls -lh {} \; | awk '{print $5, $9}'
```

#### Manual Backup

```bash
# Create immediate backup
./scripts/backup/backup-database.sh

# Backup with custom name
DB_NAME=printing_platform ./scripts/backup/backup-database.sh

# Backup to S3
S3_BUCKET=nordlayer-backups ./scripts/backup/backup-database.sh
```

### Recovery Procedures

#### Database Recovery

```bash
# List available backups
./scripts/backup/restore-database.sh --list

# Test restore (dry run)
./scripts/backup/restore-database.sh --test backup_file.gz

# Perform restore
./scripts/backup/restore-database.sh --force backup_file.gz

# Restore from S3
./scripts/backup/restore-database.sh --from-s3 nordlayer_db_20241021_020000.sql.gz
```

#### File Recovery

```bash
# Restore files from local backup
rsync -av /backup/nordlayer-files/ uploads/

# Restore from S3
aws s3 sync s3://nordlayer-backups/files/ uploads/
```

#### Full System Recovery

```bash
#!/bin/bash
# Full system recovery procedure

echo "Starting full system recovery..."

# 1. Stop services
docker-compose down

# 2. Restore database
./scripts/backup/restore-database.sh --force latest_backup.gz

# 3. Restore files
rsync -av /backup/nordlayer-files/ uploads/

# 4. Start services
docker-compose up -d

# 5. Verify recovery
sleep 30
curl -f http://localhost:8000/health

echo "Recovery completed!"
```

## Security Operations

### Security Monitoring

```bash
#!/bin/bash
# Security monitoring script

echo "=== Security Report ==="
echo "Generated: $(date)"

# Check failed login attempts
echo "1. Failed Login Attempts (last 24h):"
docker-compose logs --since 24h | grep -i "failed\|unauthorized\|403\|401" | wc -l

# Check suspicious file uploads
echo -e "\n2. File Upload Activity:"
docker-compose logs --since 24h backend | grep -i "upload" | wc -l

# Check database connections
echo -e "\n3. Database Connections:"
docker-compose exec -T db psql -U postgres -d printing_platform -c "
SELECT 
    client_addr,
    count(*) as connections
FROM pg_stat_activity 
WHERE state = 'active' 
GROUP BY client_addr;"

# Check for large files
echo -e "\n4. Large File Uploads (>10MB):"
find uploads/ -size +10M -mtime -1 -ls

echo -e "\n=== Security Report Complete ==="
```

### Security Hardening Checklist

- [ ] SSL certificates are valid and auto-renewing
- [ ] Database passwords are strong and rotated
- [ ] API keys are secured and rotated
- [ ] File upload restrictions are enforced
- [ ] Rate limiting is configured
- [ ] Security headers are set
- [ ] Logs are monitored for suspicious activity
- [ ] Backups are encrypted
- [ ] System updates are applied

## Troubleshooting

### Common Issues and Solutions

#### 1. High Response Times

```bash
# Check system resources
top
htop
iotop

# Check database performance
docker-compose exec db psql -U postgres -d printing_platform -c "
SELECT * FROM pg_stat_activity WHERE state = 'active';"

# Check for slow queries
docker-compose exec db psql -U postgres -d printing_platform -c "
SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 5;"

# Restart services if needed
docker-compose restart backend
```

#### 2. Database Connection Issues

```bash
# Check database status
docker-compose exec db pg_isready

# Check connection pool
docker-compose logs backend | grep -i "connection\|pool"

# Check database locks
docker-compose exec db psql -U postgres -d printing_platform -c "
SELECT * FROM pg_locks WHERE NOT granted;"

# Restart database if needed
docker-compose restart db
```

#### 3. File Upload Failures

```bash
# Check disk space
df -h

# Check upload directory permissions
ls -la uploads/

# Check file size limits
docker-compose logs backend | grep -i "file.*too.*large"

# Clean up temp files
find uploads/temp -type f -mtime +1 -delete
```

#### 4. Memory Issues

```bash
# Check memory usage
free -h
docker stats

# Check for memory leaks
docker-compose logs backend | grep -i "memory\|oom"

# Restart services to free memory
docker-compose restart
```

### Log Analysis

```bash
# Error analysis
docker-compose logs --since 1h | grep -i error | sort | uniq -c | sort -nr

# Performance analysis
docker-compose logs backend | grep "Response time" | tail -20

# User activity analysis
docker-compose logs backend | grep "POST\|PUT\|DELETE" | tail -20

# File upload analysis
docker-compose logs backend | grep -i upload | tail -20
```

## Maintenance Procedures

### Weekly Maintenance

```bash
#!/bin/bash
# Weekly maintenance script

echo "=== Weekly Maintenance ==="
echo "Date: $(date)"

# 1. Update system packages
echo "1. Updating system packages..."
sudo apt update && sudo apt list --upgradable

# 2. Clean up old logs
echo "2. Cleaning up old logs..."
docker system prune -f
journalctl --vacuum-time=7d

# 3. Optimize database
echo "3. Optimizing database..."
docker-compose exec -T db psql -U postgres -d printing_platform -c "VACUUM ANALYZE;"

# 4. Clean up old files
echo "4. Cleaning up old files..."
find uploads/temp -type f -mtime +7 -delete
find /var/log -name "*.log" -mtime +30 -delete

# 5. Check SSL certificates
echo "5. Checking SSL certificates..."
sudo certbot certificates

# 6. Update Docker images
echo "6. Checking for Docker image updates..."
docker-compose pull

echo "=== Weekly Maintenance Complete ==="
```

### Monthly Maintenance

```bash
#!/bin/bash
# Monthly maintenance script

echo "=== Monthly Maintenance ==="

# 1. Security updates
sudo apt update && sudo apt upgrade -y

# 2. Backup verification
./scripts/backup/restore-database.sh --test $(ls -t /var/backups/nordlayer/*.gz | head -1)

# 3. Performance review
./scripts/performance-report.sh > /tmp/performance-$(date +%Y%m).txt

# 4. Capacity planning
df -h > /tmp/disk-usage-$(date +%Y%m).txt
free -h > /tmp/memory-usage-$(date +%Y%m).txt

# 5. Security audit
./scripts/security-audit.sh > /tmp/security-$(date +%Y%m).txt

echo "=== Monthly Maintenance Complete ==="
```

## Incident Response

### Incident Response Playbook

#### 1. Service Down

```bash
# Immediate response
1. Check service status: docker-compose ps
2. Check logs: docker-compose logs --tail 50
3. Restart services: docker-compose restart
4. Verify recovery: curl http://localhost:8000/health
5. Monitor for 15 minutes
6. Document incident
```

#### 2. Database Issues

```bash
# Immediate response
1. Check database status: docker-compose exec db pg_isready
2. Check connections: docker-compose exec db psql -c "SELECT count(*) FROM pg_stat_activity;"
3. Check locks: docker-compose exec db psql -c "SELECT * FROM pg_locks WHERE NOT granted;"
4. Restart if needed: docker-compose restart db
5. Verify data integrity
6. Document incident
```

#### 3. High Load

```bash
# Immediate response
1. Check system resources: top, htop
2. Check application metrics: curl http://localhost:8000/performance
3. Identify bottleneck
4. Scale if possible or restart services
5. Monitor recovery
6. Plan capacity improvements
```

### Escalation Procedures

1. **Level 1**: Automated alerts, basic troubleshooting
2. **Level 2**: On-call engineer, advanced troubleshooting
3. **Level 3**: Senior engineer, architectural changes
4. **Level 4**: Management notification, external support

## Capacity Planning

### Monitoring Growth

```bash
#!/bin/bash
# Capacity monitoring script

echo "=== Capacity Report ==="
echo "Date: $(date)"

# Database growth
echo "1. Database Size:"
docker-compose exec -T db psql -U postgres -d printing_platform -c "
SELECT 
    pg_size_pretty(pg_database_size('printing_platform')) as db_size,
    (SELECT count(*) FROM projects) as projects,
    (SELECT count(*) FROM orders) as orders,
    (SELECT count(*) FROM articles) as articles;"

# File storage growth
echo -e "\n2. File Storage:"
echo "Total size: $(du -sh uploads/ | cut -f1)"
echo "File count: $(find uploads/ -type f | wc -l)"

# User growth
echo -e "\n3. User Activity:"
docker-compose exec -T db psql -U postgres -d printing_platform -c "
SELECT 
    DATE(created_at) as date,
    count(*) as new_orders
FROM orders 
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 10;"

echo -e "\n=== Capacity Report Complete ==="
```

### Scaling Recommendations

#### Horizontal Scaling
- Load balancer for multiple backend instances
- Database read replicas
- CDN for static files
- Separate file storage service

#### Vertical Scaling
- Increase server resources
- Optimize database configuration
- Implement caching layers
- Optimize application code

This operations guide provides comprehensive procedures for maintaining the NordLayer 3D printing platform. Regular execution of these procedures will ensure optimal performance, security, and reliability.