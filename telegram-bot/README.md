# NordLayer Telegram Bot

Telegram bot for NordLayer 3D printing platform that allows customers to place orders, track status, and interact with services through Telegram messenger.

## Features

- 🛍️ **Order Management**: Complete order flow from service selection to confirmation
- 📋 **Service Catalog**: Browse available 3D printing services with detailed information
- 📦 **Order Tracking**: Track order status by email or order number
- 📁 **File Upload**: Upload STL, OBJ, and 3MF files directly through Telegram
- 🔔 **Notifications**: Real-time notifications for order status changes
- 👥 **Admin Alerts**: Automatic notifications to administrators for new orders
- 🏥 **Health Monitoring**: Comprehensive health checks and metrics
- 🔒 **Production Ready**: Graceful shutdown, logging, and error handling

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Telegram Bot Token (from @BotFather)
- Access to NordLayer Backend API

### 1. Get Bot Token

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command
3. Follow prompts to create your bot
4. Save the provided token

### 2. Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

Required variables:
```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
API_BASE_URL=http://backend:8000
ADMIN_CHAT_IDS=123456789,987654321
```

### 3. Deploy with Docker Compose

```bash
# Start all services
docker-compose up -d

# Check bot health
curl http://localhost:8080/health

# View logs
docker-compose logs -f telegram-bot
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Telegram      │    │  Telegram Bot   │    │   Backend API   │
│   Users         │◄──►│   Service       │◄──►│   (FastAPI)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Health Check   │
                       │   Endpoints     │
                       └─────────────────┘
```

## Bot Commands

### User Commands
- `/start` - Main menu and welcome message
- `/services` - Browse service catalog
- `/order` - Start order process
- `/track` - Track existing orders
- `/help` - Show help information
- `/cancel` - Cancel current action

### Admin Features
- Automatic notifications for new orders
- Order status change notifications
- System health monitoring
- Error reporting

## API Integration

The bot integrates with the NordLayer backend API:

### Endpoints Used
- `GET /api/v1/services` - Fetch available services
- `POST /api/v1/orders` - Create new orders
- `POST /api/v1/files/upload` - Upload model files
- `GET /api/v1/orders/search` - Search orders by email

### Authentication
- API calls use internal service authentication
- No user authentication required for public endpoints

## Health Monitoring

### Health Check Endpoints

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `/health` | Basic health check | Service status |
| `/status` | Detailed system info | Comprehensive status |
| `/metrics` | Prometheus metrics | Performance metrics |
| `/ready` | Readiness probe | K8s readiness |
| `/live` | Liveness probe | K8s liveness |

### Monitoring Script

```bash
# Check all health metrics
./monitor.sh all

# Continuous monitoring
./monitor.sh monitor --interval 30

# Check specific component
./monitor.sh health
./monitor.sh logs
./monitor.sh resources
```

## File Upload Support

### Supported Formats
- `.stl` - STL files (most common)
- `.obj` - Wavefront OBJ files
- `.3mf` - 3D Manufacturing Format

### Limits
- Maximum file size: 50MB (configurable)
- Multiple files per order supported
- Automatic format validation

## Logging

### Log Levels
- `DEBUG` - Detailed debugging information
- `INFO` - General operational messages (default)
- `WARNING` - Warning conditions
- `ERROR` - Error conditions
- `CRITICAL` - Critical errors

### Log Rotation
- Automatic rotation at 10MB
- Keep 5 backup files
- Compressed backups
- Configurable via environment variables

### Log Format
```
2024-01-15T10:30:00Z - nordlayer-telegram-bot - production - main - INFO - [handle_start:123] - user:123456 - User started bot interaction
```

## Error Handling

### User-Friendly Messages
- Clear error messages for users
- Helpful suggestions for resolution
- Graceful fallbacks for API failures

### Admin Notifications
- Critical errors sent to admin chats
- System health alerts
- Performance warnings

### Retry Logic
- Automatic retry for transient failures
- Exponential backoff for API calls
- Circuit breaker pattern for external services

## Security

### Bot Token Security
- Environment variable storage
- No token logging
- Secure token validation

### File Upload Security
- File type validation
- Size limit enforcement
- Malware scanning (recommended)

### API Security
- Internal network communication
- Request validation
- Rate limiting support

## Performance

### Resource Usage
- Memory: ~100-200MB typical
- CPU: Low usage, spikes during file uploads
- Network: Depends on user activity

### Scaling
- Single instance (polling mode)
- Webhook mode available for high load
- Horizontal scaling with load balancer

### Optimization
- Connection pooling for API calls
- Async/await throughout
- Efficient file handling
- Memory-conscious logging

## Development

### Local Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run bot
python main.py
```

### Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Integration tests
pytest tests/test_integration.py
```

### Code Structure

```
telegram-bot/
├── main.py              # Main bot application
├── config.py            # Configuration management
├── api_client.py        # Backend API client
├── session_manager.py   # User session management
├── order_handlers.py    # Order processing logic
├── notification_service.py # Admin notifications
├── health_check.py      # Health monitoring
├── error_handler.py     # Error handling
├── logging_config.py    # Logging setup
├── requirements.txt     # Python dependencies
├── Dockerfile          # Container definition
├── start.sh            # Startup script
├── monitor.sh          # Monitoring script
└── DEPLOYMENT.md       # Deployment guide
```

## Deployment

### Docker Compose (Recommended)
```bash
docker-compose up -d telegram-bot
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nordlayer-telegram-bot
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nordlayer-telegram-bot
  template:
    metadata:
      labels:
        app: nordlayer-telegram-bot
    spec:
      containers:
      - name: telegram-bot
        image: nordlayer-telegram-bot:latest
        env:
        - name: TELEGRAM_BOT_TOKEN
          valueFrom:
            secretKeyRef:
              name: telegram-bot-secret
              key: token
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /live
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
```

### Production Checklist

- [ ] Bot token configured securely
- [ ] Admin chat IDs set up
- [ ] API connectivity verified
- [ ] Health checks responding
- [ ] Logging configured
- [ ] Monitoring set up
- [ ] Backup procedures in place
- [ ] Security review completed

## Troubleshooting

### Common Issues

#### Bot Not Responding
1. Check health endpoint: `curl http://localhost:8080/health`
2. Verify bot token in logs
3. Check API connectivity: `curl http://localhost:8080/status`

#### File Upload Failures
1. Check file size and format
2. Verify API upload endpoint
3. Check network connectivity

#### High Memory Usage
1. Monitor metrics: `curl http://localhost:8080/metrics`
2. Check for memory leaks in logs
3. Restart if necessary

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG
export DEBUG=true

# Restart bot
docker-compose restart telegram-bot
```

### Log Analysis
```bash
# Recent errors
grep "ERROR" logs/bot.log | tail -10

# User activity
grep "User action" logs/bot.log | tail -20

# API calls
grep "API call" logs/bot.log | tail -15
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style
- Follow PEP 8
- Use type hints
- Add docstrings
- Write tests

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Documentation**: See DEPLOYMENT.md for detailed deployment guide
- **Issues**: Report bugs and feature requests via GitHub issues
- **Monitoring**: Use monitor.sh script for health checks
- **Logs**: Check logs/bot.log for troubleshooting