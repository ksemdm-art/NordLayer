#!/bin/bash

# Server setup script for Ubuntu 20.04/22.04
# Run this script on your fresh server

set -e

echo "🔧 Setting up server for 3D Printing Platform..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "📦 Installing required packages..."
sudo apt install -y \
    curl \
    wget \
    git \
    nginx \
    certbot \
    python3-certbot-nginx \
    ufw \
    fail2ban \
    htop \
    unzip

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create project directory
echo "📁 Creating project directory..."
sudo mkdir -p /opt/printing-platform
sudo chown $USER:$USER /opt/printing-platform

# Clone repository
echo "📥 Cloning repository..."
cd /opt/printing-platform
git clone https://github.com/ksemdm-art/NordLayer.git .

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Configure fail2ban
echo "🛡️ Configuring fail2ban..."
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Create SSL directory
echo "🔐 Creating SSL directory..."
sudo mkdir -p /etc/nginx/ssl

# Setup log rotation
echo "📝 Setting up log rotation..."
sudo tee /etc/logrotate.d/printing-platform > /dev/null <<EOF
/opt/printing-platform/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker-compose -f /opt/printing-platform/docker-compose.prod.yml restart nginx
    endscript
}
EOF

# Create systemd service for auto-start
echo "⚙️ Creating systemd service..."
sudo tee /etc/systemd/system/printing-platform.service > /dev/null <<EOF
[Unit]
Description=3D Printing Platform
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/printing-platform
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable printing-platform.service

# Setup monitoring
echo "📊 Setting up basic monitoring..."
sudo tee /usr/local/bin/health-check.sh > /dev/null <<'EOF'
#!/bin/bash
if ! curl -f http://localhost/health > /dev/null 2>&1; then
    echo "$(date): Health check failed" >> /var/log/printing-platform-health.log
    # Restart services
    cd /opt/printing-platform
    docker-compose -f docker-compose.prod.yml restart
fi
EOF

sudo chmod +x /usr/local/bin/health-check.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/health-check.sh") | crontab -

echo "✅ Server setup completed!"
echo ""
echo "Next steps:"
echo "1. Clone your repository to /opt/printing-platform"
echo "2. Configure your .env.production file"
echo "3. Setup SSL certificate with: sudo certbot --nginx -d your-domain.com"
echo "4. Run deployment script: ./scripts/deploy.sh"
echo ""
echo "⚠️  Don't forget to:"
echo "- Configure your domain DNS to point to this server"
echo "- Update firewall rules if needed"
echo "- Setup backup strategy"
echo "- Configure monitoring alerts"