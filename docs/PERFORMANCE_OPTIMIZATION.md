# NordLayer Performance Optimization Guide

This document outlines the performance optimizations implemented in the NordLayer 3D printing platform and provides guidance for maintaining optimal performance.

## Table of Contents

1. [Overview](#overview)
2. [Performance Monitoring](#performance-monitoring)
3. [Database Optimizations](#database-optimizations)
4. [Caching Strategy](#caching-strategy)
5. [API Optimizations](#api-optimizations)
6. [Frontend Optimizations](#frontend-optimizations)
7. [File Storage Optimizations](#file-storage-optimizations)
8. [Load Testing](#load-testing)
9. [Performance Metrics](#performance-metrics)
10. [Troubleshooting](#troubleshooting)

## Overview

The NordLayer platform implements several performance optimization strategies:

- **Database Query Optimization**: Efficient queries, indexing, and connection pooling
- **Caching Layer**: Redis-based caching for frequently accessed data
- **API Response Optimization**: Pagination, filtering, and response compression
- **Frontend Optimization**: Code splitting, lazy loading, and asset optimization
- **File Storage Optimization**: Efficient file serving and CDN integration

## Performance Monitoring

### Built-in Monitoring

The platform includes comprehensive performance monitoring:

```python
# Performance tracking decorator
@performance_tracker
@cache_manager.cache_response("projects_list", ttl=900)
async def get_projects(...):
    # Endpoint implementation
```

### Monitoring Endpoints

- **Health Check**: `GET /health`
- **Performance Metrics**: `GET /performance`
- **Database Health**: `GET /health/db`
- **Cache Health**: `GET /health/cache`

### Key Metrics

```bash
# Check current performance metrics
curl http://localhost:8000/performance

# Example response:
{
  "status": "healthy",
  "metrics": {
    "GET /api/v1/projects": {
      "total_requests": 1250,
      "avg_duration": 0.245,
      "max_duration": 1.2,
      "error_count": 3
    }
  },
  "cache_status": "enabled"
}
```

## Database Optimizations

### Query Optimization

The platform uses optimized database queries with proper indexing:

```python
# Optimized pagination
skip, limit = DatabaseOptimizer.optimize_query_params(page, per_page, max_limit=100)

# Optimized filters
filters = DatabaseOptimizer.build_filters({
    'category': category,
    'is_featured': is_featured,
    'search_like': search
})
```

### Database Indexes

Ensure these indexes are created for optimal performance:

```sql
-- Projects table indexes
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(is_featured);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_projects_search ON projects USING gin(to_tsvector('english', title || ' ' || description));

-- Orders table indexes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);

-- Articles table indexes
CREATE INDEX idx_articles_published ON articles(is_published);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published_at ON articles(published_at);
```

### Connection Pooling

Configure PostgreSQL connection pooling:

```python
# Database configuration
SQLALCHEMY_DATABASE_URL = "postgresql://user:pass@localhost/db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=3600
)
```

## Caching Strategy

### Redis Caching

The platform implements multi-level caching:

```python
# Cache configuration
cache_manager = CacheManager()

# Automatic caching decorator
@cache_manager.cache_response("projects_list", ttl=900)
async def get_projects(...):
    # Function implementation
```

### Cache Keys Strategy

```python
# Cache key patterns
CACHE_KEYS = {
    "projects_list": "projects:list:{hash}",
    "project_detail": "project:detail:{id}",
    "services_list": "services:list",
    "articles_list": "articles:list:{hash}"
}
```

### Cache TTL Settings

- **Project Lists**: 15 minutes (900 seconds)
- **Project Details**: 1 hour (3600 seconds)
- **Services**: 30 minutes (1800 seconds)
- **Articles**: 10 minutes (600 seconds)

### Cache Management

```bash
# Check cache status
curl http://localhost:8000/health/cache

# Clear specific cache
docker-compose exec redis redis-cli del "projects:list:*"

# Clear all cache
docker-compose exec redis redis-cli flushall
```

## API Optimizations

### Response Optimization

```python
# Optimized pagination response
return ResponseOptimizer.paginate_response(
    data=projects,
    total=total,
    page=page,
    limit=limit
)
```

### Request Optimization

- **Pagination**: Maximum 100 items per page
- **Filtering**: Optimized database filters
- **Compression**: Gzip compression for large responses
- **Rate Limiting**: Prevent API abuse

### Performance Middleware

```python
# Performance tracking middleware
async def performance_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    # Track performance metrics
    performance_monitor.track_endpoint(
        f"{request.method} {request.url.path}",
        duration,
        response.status_code
    )
    
    response.headers["X-Response-Time"] = f"{duration:.3f}s"
    return response
```

## Frontend Optimizations

### Code Splitting

```javascript
// Lazy loading for routes
const ProjectDetail = () => import('@/views/ProjectDetailView.vue')
const AdminPanel = () => import('@/views/admin/AdminDashboard.vue')

// Route configuration
{
  path: '/projects/:id',
  component: ProjectDetail
}
```

### Asset Optimization

```javascript
// Vite configuration for optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          three: ['three'],
          ui: ['@headlessui/vue', '@heroicons/vue']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### Image Optimization

```javascript
// Lazy loading images
<img 
  :src="project.image" 
  loading="lazy" 
  :alt="project.title"
  class="w-full h-48 object-cover"
/>

// WebP format support
<picture>
  <source :srcset="project.image_webp" type="image/webp">
  <img :src="project.image" :alt="project.title">
</picture>
```

### 3D Model Optimization

```javascript
// Optimized STL loading
const loader = new STLLoader()
loader.load(modelUrl, (geometry) => {
  // Optimize geometry
  geometry.computeVertexNormals()
  geometry.center()
  
  // Use efficient material
  const material = new MeshLambertMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.8
  })
  
  const mesh = new Mesh(geometry, material)
  scene.add(mesh)
})
```

## File Storage Optimizations

### File Upload Optimization

```python
# Optimized file upload handling
async def upload_file(file: UploadFile):
    # Validate file size and type
    if file.size > MAX_FILE_SIZE:
        raise FileUploadError("File too large")
    
    # Stream file to storage
    async with aiofiles.open(file_path, 'wb') as f:
        while chunk := await file.read(8192):  # 8KB chunks
            await f.write(chunk)
```

### File Serving Optimization

```nginx
# Nginx configuration for file serving
location /uploads/ {
    alias /var/www/nordlayer/uploads/;
    expires 1y;
    add_header Cache-Control "public, immutable";
    
    # Enable gzip compression
    gzip on;
    gzip_types application/octet-stream;
    
    # Enable range requests for large files
    add_header Accept-Ranges bytes;
}
```

### CDN Integration

```python
# S3/CDN configuration
if settings.USE_CDN:
    file_url = f"{settings.CDN_BASE_URL}/{file_path}"
else:
    file_url = f"/uploads/{file_path}"
```

## Load Testing

### Running Load Tests

```bash
# Basic load test
./scripts/load-testing/run-load-tests.sh local basic

# Stress test
./scripts/load-testing/run-load-tests.sh local stress

# Comprehensive performance test
python scripts/load-testing/performance-test.py --test-type both --users 20 --duration 5m
```

### Load Test Configuration

```python
# Locust configuration
class WebsiteUser(HttpUser):
    wait_time = between(1, 5)
    
    @task(3)
    def view_homepage(self):
        self.client.get("/")
    
    @task(2)
    def browse_gallery(self):
        self.client.get("/api/v1/projects")
```

### Performance Thresholds

- **Response Time**: < 500ms average, < 1000ms P95
- **Error Rate**: < 1%
- **Throughput**: > 100 requests/second
- **Concurrent Users**: Support 50+ concurrent users

## Performance Metrics

### Key Performance Indicators

1. **Response Time Metrics**
   - Average response time
   - 95th percentile response time
   - Maximum response time

2. **Throughput Metrics**
   - Requests per second
   - Concurrent users
   - Data transfer rate

3. **Error Metrics**
   - Error rate percentage
   - Error types and frequency
   - Failed requests count

4. **Resource Metrics**
   - CPU usage
   - Memory usage
   - Database connections
   - Cache hit rate

### Monitoring Dashboard

Create a monitoring dashboard with these queries:

```sql
-- Average response time by endpoint
SELECT 
    endpoint,
    AVG(duration) as avg_response_time,
    COUNT(*) as request_count
FROM performance_logs 
WHERE timestamp > NOW() - INTERVAL '1 hour'
GROUP BY endpoint
ORDER BY avg_response_time DESC;

-- Error rate by endpoint
SELECT 
    endpoint,
    COUNT(*) as total_requests,
    SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as errors,
    (SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as error_rate
FROM performance_logs 
WHERE timestamp > NOW() - INTERVAL '1 hour'
GROUP BY endpoint
ORDER BY error_rate DESC;
```

## Troubleshooting

### Common Performance Issues

#### 1. Slow Database Queries

```sql
-- Find slow queries
SELECT 
    query,
    mean_time,
    calls,
    total_time
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check for missing indexes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public'
ORDER BY n_distinct DESC;
```

**Solutions:**
- Add appropriate indexes
- Optimize query structure
- Use EXPLAIN ANALYZE to understand query plans

#### 2. High Memory Usage

```bash
# Check memory usage
docker stats

# Check for memory leaks
docker-compose logs backend | grep -i "memory\|oom"
```

**Solutions:**
- Restart services to free memory
- Optimize database connection pooling
- Implement proper caching TTL

#### 3. Cache Issues

```bash
# Check cache hit rate
docker-compose exec redis redis-cli info stats

# Check cache memory usage
docker-compose exec redis redis-cli info memory
```

**Solutions:**
- Adjust cache TTL settings
- Increase Redis memory limit
- Clear stale cache entries

#### 4. File Upload Performance

```bash
# Check disk I/O
iotop

# Check upload directory size
du -sh uploads/
```

**Solutions:**
- Implement file compression
- Use CDN for file serving
- Clean up temporary files

### Performance Optimization Checklist

- [ ] Database indexes are optimized
- [ ] Caching is properly configured
- [ ] API responses are paginated
- [ ] File uploads are optimized
- [ ] Frontend assets are compressed
- [ ] CDN is configured for static files
- [ ] Monitoring is in place
- [ ] Load testing is performed regularly
- [ ] Performance thresholds are defined
- [ ] Alerting is configured

### Performance Monitoring Commands

```bash
# System performance
htop
iotop
nethogs

# Application performance
curl http://localhost:8000/performance
./scripts/health-check-comprehensive.sh

# Database performance
docker-compose exec db psql -U postgres -d printing_platform -c "SELECT * FROM pg_stat_activity;"

# Cache performance
docker-compose exec redis redis-cli info stats
```

This performance optimization guide provides comprehensive strategies for maintaining optimal performance in the NordLayer 3D printing platform. Regular monitoring and optimization ensure the best user experience and system reliability.