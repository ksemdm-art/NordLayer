# Развертывание 3D Printing Platform

Это руководство описывает процесс развертывания платформы 3D печати на production сервере.

## Требования к серверу

### Минимальные требования
- **OS**: Ubuntu 20.04+ или CentOS 8+
- **RAM**: 4GB (рекомендуется 8GB)
- **CPU**: 2 cores (рекомендуется 4 cores)
- **Диск**: 50GB свободного места (рекомендуется 100GB)
- **Сеть**: Статический IP адрес

### Необходимое ПО
- Docker 20.10+
- Docker Compose 2.0+
- Git
- OpenSSL
- Curl

## Подготовка сервера

### 1. Установка Docker

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Настройка файрвола

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Firewalld (CentOS)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 3. Создание пользователя для развертывания

```bash
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG docker deploy
sudo mkdir -p /home/deploy/.ssh
sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

## Настройка CI/CD

### 1. Настройка GitHub Secrets

В настройках репозитория GitHub добавьте следующие секреты:

```
# Docker Hub
DOCKER_USERNAME=your_dockerhub_username
DOCKER_PASSWORD=your_dockerhub_password

# Server Access
SSH_PRIVATE_KEY=your_ssh_private_key
SERVER_HOST=your_server_ip
SERVER_USER=deploy

# Application Configuration
DOMAIN_NAME=yourdomain.com
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_IDS=123456789,987654321
```

### 2. Получение SSH ключа

```bash
# Генерация SSH ключа (если нет)
ssh-keygen -t rsa -b 4096 -C "deploy@yourdomain.com"

# Копирование публичного ключа на сервер
ssh-copy-id deploy@your_server_ip

# Содержимое приватного ключа добавить в GitHub Secret SSH_PRIVATE_KEY
cat ~/.ssh/id_rsa
```

## Ручное развертывание

### 1. Клонирование репозитория

```bash
sudo mkdir -p /opt/printing-platform
sudo chown deploy:deploy /opt/printing-platform
cd /opt/printing-platform
git clone https://github.com/yourusername/printing-platform.git .
```

### 2. Настройка окружения

```bash
# Копирование шаблона конфигурации
cp .env.production.template .env

# Редактирование конфигурации
nano .env
```

Обязательно обновите следующие параметры:
- `POSTGRES_PASSWORD` - пароль для PostgreSQL
- `SECRET_KEY` - секретный ключ для JWT токенов
- `TELEGRAM_BOT_TOKEN` - токен Telegram бота
- `ADMIN_CHAT_IDS` - ID администраторов
- Замените `yourdomain.com` на ваш домен

### 3. Развертывание с помощью скрипта

```bash
# Полное развертывание с резервным копированием
sudo ./scripts/deploy.sh

# Быстрое развертывание без резервного копирования
sudo ./scripts/deploy.sh quick

# Просмотр логов
./scripts/deploy.sh logs

# Проверка статуса
./scripts/deploy.sh status
```

### 4. Ручное развертывание

```bash
# Запуск сервисов
sudo docker-compose -f docker-compose.prod.yml up -d

# Проверка статуса
sudo docker-compose -f docker-compose.prod.yml ps

# Выполнение миграций
sudo docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

## Настройка SSL сертификата

### Использование Let's Encrypt (рекомендуется)

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Автоматическое обновление
sudo crontab -e
# Добавить строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

### Использование собственного сертификата

```bash
# Создание директории для сертификатов
sudo mkdir -p /opt/printing-platform/nginx/ssl

# Копирование сертификатов
sudo cp your_certificate.crt /opt/printing-platform/nginx/ssl/
sudo cp your_private_key.key /opt/printing-platform/nginx/ssl/

# Установка правильных прав
sudo chmod 644 /opt/printing-platform/nginx/ssl/your_certificate.crt
sudo chmod 600 /opt/printing-platform/nginx/ssl/your_private_key.key
```

## Мониторинг и обслуживание

### Просмотр логов

```bash
# Все сервисы
sudo docker-compose -f docker-compose.prod.yml logs -f

# Конкретный сервис
sudo docker-compose -f docker-compose.prod.yml logs -f backend

# Последние 100 строк
sudo docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Резервное копирование

```bash
# Создание резервной копии базы данных
sudo docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres printing_platform > backup_$(date +%Y%m%d).sql

# Создание резервной копии файлов
sudo tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

### Восстановление из резервной копии

```bash
# Остановка сервисов
sudo docker-compose -f docker-compose.prod.yml down

# Восстановление базы данных
sudo docker-compose -f docker-compose.prod.yml up -d postgres
sleep 10
sudo docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS printing_platform;"
sudo docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -c "CREATE DATABASE printing_platform;"
sudo docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres printing_platform < backup_20231201.sql

# Восстановление файлов
sudo tar -xzf uploads_backup_20231201.tar.gz

# Запуск всех сервисов
sudo docker-compose -f docker-compose.prod.yml up -d
```

### Обновление приложения

```bash
# Через CI/CD (рекомендуется)
git push origin main

# Ручное обновление
cd /opt/printing-platform
git pull origin main
sudo docker-compose -f docker-compose.prod.yml pull
sudo docker-compose -f docker-compose.prod.yml up -d --remove-orphans
```

### Откат к предыдущей версии

```bash
# Использование скрипта развертывания
sudo ./scripts/deploy.sh rollback

# Ручной откат
sudo docker-compose -f docker-compose.prod.yml down
# Восстановить из резервной копии (см. выше)
```

## Мониторинг производительности

### Grafana Dashboard

После развертывания Grafana будет доступна по адресу: `http://yourdomain.com:3001`

- **Логин**: admin
- **Пароль**: значение из `GRAFANA_ADMIN_PASSWORD` в .env

### Prometheus Metrics

Prometheus доступен по адресу: `http://yourdomain.com:9090`

### Основные метрики для мониторинга

- CPU и память контейнеров
- Использование диска
- Количество HTTP запросов
- Время ответа API
- Статус сервисов

## Устранение неполадок

### Проблемы с запуском

```bash
# Проверка логов
sudo docker-compose -f docker-compose.prod.yml logs

# Проверка состояния контейнеров
sudo docker-compose -f docker-compose.prod.yml ps

# Перезапуск сервисов
sudo docker-compose -f docker-compose.prod.yml restart
```

### Проблемы с базой данных

```bash
# Подключение к базе данных
sudo docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres printing_platform

# Проверка миграций
sudo docker-compose -f docker-compose.prod.yml exec backend alembic current
sudo docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

### Проблемы с файлами

```bash
# Проверка прав доступа
sudo docker-compose -f docker-compose.prod.yml exec backend ls -la /app/uploads

# Исправление прав
sudo chown -R 1000:1000 uploads/
```

## Безопасность

### Рекомендации по безопасности

1. **Регулярно обновляйте систему**:
   ```bash
   sudo apt update && sudo apt upgrade
   ```

2. **Используйте сильные пароли** для всех сервисов

3. **Настройте автоматические резервные копии**

4. **Мониторьте логи** на предмет подозрительной активности

5. **Ограничьте доступ по SSH** только для необходимых IP

6. **Используйте fail2ban** для защиты от брутфорс атак:
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

### Обновления безопасности

```bash
# Проверка уязвимостей в Docker образах
sudo docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image printing-platform-backend:latest

# Обновление базовых образов
sudo docker-compose -f docker-compose.prod.yml pull
sudo docker-compose -f docker-compose.prod.yml up -d
```

## Поддержка

При возникновении проблем:

1. Проверьте логи сервисов
2. Убедитесь, что все переменные окружения настроены правильно
3. Проверьте доступность внешних сервисов (база данных, Redis)
4. Создайте issue в репозитории с подробным описанием проблемы

## Полезные команды

```bash
# Просмотр использования ресурсов
sudo docker stats

# Очистка неиспользуемых образов
sudo docker system prune -f

# Просмотр размера томов
sudo docker system df

# Экспорт/импорт конфигурации
sudo docker-compose -f docker-compose.prod.yml config > current-config.yml
```