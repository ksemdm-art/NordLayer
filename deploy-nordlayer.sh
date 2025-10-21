#!/bin/bash

# Скрипт автоматического развертывания NordLayer на nordlayer.ru
# Автор: Kiro AI Assistant

set -e

echo "🚀 Начинаем развертывание NordLayer на nordlayer.ru..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода цветного текста
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

# Проверяем подключение к серверу
print_status "Проверяем подключение к серверу 188.225.36.104..."
if ! ping -c 1 188.225.36.104 > /dev/null 2>&1; then
    print_error "Сервер недоступен!"
    exit 1
fi
print_success "Сервер доступен"

# Проверяем SSH подключение
print_status "Проверяем SSH подключение..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes deploy@188.225.36.104 exit 2>/dev/null; then
    print_error "SSH подключение не настроено!"
    echo "Выполните команды:"
    echo "1. ssh-copy-id deploy@188.225.36.104"
    echo "2. Или добавьте SSH ключ в GitHub Secrets"
    exit 1
fi
print_success "SSH подключение работает"

# Проверяем DNS
print_status "Проверяем DNS для nordlayer.ru..."
if ! nslookup nordlayer.ru > /dev/null 2>&1; then
    print_warning "DNS для nordlayer.ru еще не настроен"
    echo "Настройте A записи в панели TimeWeb:"
    echo "@ -> 188.225.36.104"
    echo "www -> 188.225.36.104"
fi

# Коммитим и пушим изменения
print_status "Коммитим изменения..."
git add .
git commit -m "Configure for nordlayer.ru deployment" || true
git push origin main

print_success "Изменения отправлены в GitHub"

# Ждем завершения GitHub Actions
print_status "GitHub Actions запустится автоматически..."
print_status "Проверить статус можно здесь: https://github.com/ksemdm-art/NordLayer/actions"

echo ""
print_success "🎉 Развертывание запущено!"
echo ""
echo "Следующие шаги:"
echo "1. Дождитесь завершения GitHub Actions (3-5 минут)"
echo "2. Настройте DNS записи в панели TimeWeb"
echo "3. Получите SSL сертификат: sudo certbot --nginx -d nordlayer.ru -d www.nordlayer.ru"
echo "4. Проверьте сайт: https://nordlayer.ru"
echo ""
echo "Полезные команды для сервера:"
echo "ssh deploy@188.225.36.104"
echo "sudo docker-compose -f /opt/printing-platform/docker-compose.prod.yml ps"
echo "sudo docker-compose -f /opt/printing-platform/docker-compose.prod.yml logs -f"