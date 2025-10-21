# Настройка на TimeWeb: Пошаговое руководство

## 1. Покупка домена на TimeWeb

### Шаг 1: Регистрация и выбор домена
1. Перейдите на [timeweb.com](https://timeweb.com)
2. Нажмите "Домены" в верхнем меню
3. Введите желаемое имя домена и проверьте доступность
4. Выберите подходящую зону (.com, .ru, .net и т.д.)
5. Добавьте в корзину и оформите заказ

### Шаг 2: Настройка DNS
После покупки домена:
1. Войдите в панель управления TimeWeb
2. Перейдите в раздел "Домены"
3. Найдите ваш домен и нажмите "Управление"
4. Перейдите в раздел "DNS-записи"
5. Добавьте следующие записи:

```
Тип: A
Имя: @
Значение: IP_адрес_вашего_сервера
TTL: 3600

Тип: A  
Имя: www
Значение: IP_адрес_вашего_сервера
TTL: 3600

Тип: CNAME
Имя: api
Значение: your-domain.com
TTL: 3600
```

## 2. Заказ VPS на TimeWeb

### Рекомендуемые характеристики:
- **CPU**: 2 ядра
- **RAM**: 4 GB
- **SSD**: 40 GB
- **OS**: Ubuntu 22.04 LTS
- **Трафик**: Безлимитный

### Шаг 1: Заказ VPS
1. В панели TimeWeb перейдите в "VPS/VDS"
2. Нажмите "Заказать VPS"
3. Выберите конфигурацию:
   - Тариф: VPS-2 или выше
   - ОС: Ubuntu 22.04 LTS
   - Дополнительные опции: Backup (рекомендуется)
4. Оформите заказ

### Шаг 2: Получение данных доступа
После создания VPS вы получите:
- IP-адрес сервера
- Логин: root
- Пароль (в письме или SMS)

## 3. Получение SSL сертификата

### Вариант 1: Let's Encrypt (Бесплатный, рекомендуется)
```bash
# После настройки сервера выполните:
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Вариант 2: SSL от TimeWeb (Платный)
1. В панели TimeWeb перейдите в "SSL-сертификаты"
2. Нажмите "Заказать SSL"
3. Выберите тип сертификата:
   - **DV SSL** - базовая проверка домена (рекомендуется)
   - **OV SSL** - проверка организации
   - **EV SSL** - расширенная проверка
4. Укажите ваш домен
5. Следуйте инструкциям по верификации

## 4. Настройка почты (опционально)

### Создание почтового ящика
1. В панели TimeWeb перейдите в "Почта"
2. Нажмите "Создать почтовый ящик"
3. Создайте ящики:
   - `noreply@your-domain.com` - для системных уведомлений
   - `admin@your-domain.com` - для административных задач
   - `support@your-domain.com` - для поддержки пользователей

### Настройки SMTP для приложения:
```env
SMTP_HOST=smtp.timeweb.ru
SMTP_PORT=587
SMTP_USER=noreply@your-domain.com
SMTP_PASSWORD=your_email_password
```

## 5. Настройка резервного копирования

### Автоматический backup на TimeWeb
1. В панели VPS найдите ваш сервер
2. Перейдите в "Резервные копии"
3. Настройте автоматическое создание backup'ов:
   - Частота: Ежедневно
   - Время: 03:00 (ночное время)
   - Хранение: 7 дней

### Дополнительный backup в облако
```bash
# Установите rclone для backup в облачные хранилища
curl https://rclone.org/install.sh | sudo bash

# Настройте backup скрипт
sudo tee /usr/local/bin/backup-to-cloud.sh > /dev/null <<'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/tmp/backup_$DATE"

# Создание backup'а
mkdir -p $BACKUP_DIR
docker-compose -f /opt/printing-platform/docker-compose.prod.yml exec -T postgres pg_dump -U postgres printing_platform_prod > $BACKUP_DIR/database.sql
tar -czf $BACKUP_DIR/uploads.tar.gz -C /opt/printing-platform uploads/
tar -czf $BACKUP_DIR/config.tar.gz -C /opt/printing-platform .env docker-compose.prod.yml

# Отправка в облако (настройте rclone)
# rclone copy $BACKUP_DIR remote:backups/

# Очистка
rm -rf $BACKUP_DIR
EOF

chmod +x /usr/local/bin/backup-to-cloud.sh

# Добавьте в crontab
echo "0 2 * * * /usr/local/bin/backup-to-cloud.sh" | crontab -
```

## 6. Мониторинг и алерты

### Настройка уведомлений в Telegram
1. Создайте бота для мониторинга через @BotFather
2. Получите токен бота и ваш chat_id
3. Создайте скрипт мониторинга:

```bash
sudo tee /usr/local/bin/monitoring.sh > /dev/null <<'EOF'
#!/bin/bash
BOT_TOKEN="YOUR_MONITORING_BOT_TOKEN"
CHAT_ID="YOUR_CHAT_ID"
DOMAIN="your-domain.com"

# Проверка доступности сайта
if ! curl -f https://$DOMAIN/health > /dev/null 2>&1; then
    MESSAGE="🚨 ALERT: $DOMAIN is DOWN!"
    curl -s "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
         -d "chat_id=$CHAT_ID" \
         -d "text=$MESSAGE"
fi

# Проверка использования диска
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    MESSAGE="⚠️ WARNING: Disk usage is ${DISK_USAGE}% on $DOMAIN"
    curl -s "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
         -d "chat_id=$CHAT_ID" \
         -d "text=$MESSAGE"
fi

# Проверка использования памяти
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $MEMORY_USAGE -gt 90 ]; then
    MESSAGE="⚠️ WARNING: Memory usage is ${MEMORY_USAGE}% on $DOMAIN"
    curl -s "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
         -d "chat_id=$CHAT_ID" \
         -d "text=$MESSAGE"
fi
EOF

chmod +x /usr/local/bin/monitoring.sh

# Запуск каждые 5 минут
echo "*/5 * * * * /usr/local/bin/monitoring.sh" | crontab -
```

## 7. Оптимизация производительности

### Настройка swap файла
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Оптимизация Docker
```bash
# Создайте файл конфигурации Docker
sudo tee /etc/docker/daemon.json > /dev/null <<'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

sudo systemctl restart docker
```

## 8. Безопасность

### Настройка файрвола
```bash
# Базовые правила
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Ограничение SSH (опционально)
sudo ufw limit ssh
```

### Настройка fail2ban
```bash
sudo tee /etc/fail2ban/jail.local > /dev/null <<'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

sudo systemctl restart fail2ban
```

## 9. Стоимость и планирование бюджета

### Примерные расходы на TimeWeb (в месяц):
- **Домен .com**: ~800 руб/год (67 руб/мес)
- **VPS-2 (2 CPU, 4GB RAM, 40GB SSD)**: ~1200 руб/мес
- **SSL DV**: ~1500 руб/год (125 руб/мес) или бесплатно Let's Encrypt
- **Backup**: ~300 руб/мес (опционально)

**Итого**: ~1500-1700 руб/мес

### Альтернативные варианты:
- **Более мощный VPS**: VPS-4 (~2500 руб/мес)
- **Dedicated сервер**: от 5000 руб/мес
- **Managed hosting**: от 3000 руб/мес

## 10. Контакты поддержки TimeWeb

- **Техподдержка**: support@timeweb.ru
- **Телефон**: 8 (800) 700-06-08
- **Онлайн-чат**: доступен в панели управления
- **Telegram**: @timeweb_support

## Чек-лист развертывания

- [ ] Домен куплен и настроен
- [ ] VPS заказан и настроен
- [ ] DNS записи добавлены
- [ ] SSL сертификат получен
- [ ] Приложение развернуто
- [ ] Мониторинг настроен
- [ ] Backup настроен
- [ ] Безопасность настроена
- [ ] Производительность оптимизирована
- [ ] Документация обновлена