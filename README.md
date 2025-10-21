# 3D Printing Platform

Платформа для монетизации услуг 3D печати, включающая веб-сайт, административную панель и Telegram бота.

## Структура проекта

```
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Configuration
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/               # Vue.js frontend
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── views/          # Page components
│   │   ├── router/         # Vue Router
│   │   └── types/          # TypeScript types
│   ├── package.json
│   └── Dockerfile
├── telegram-bot/           # Telegram bot
│   ├── main.py
│   ├── config.py
│   ├── requirements.txt
│   └── Dockerfile
└── docker-compose.yml      # Docker orchestration
```

## Технологический стек

### Backend
- **FastAPI** - современный веб-фреймворк для Python
- **PostgreSQL** - основная база данных
- **Redis** - кэширование и сессии
- **SQLAlchemy** - ORM для работы с базой данных
- **Alembic** - миграции базы данных

### Frontend
- **Vue.js 3** - прогрессивный JavaScript фреймворк
- **TypeScript** - типизированный JavaScript
- **Pinia** - управление состоянием
- **Vue Router** - маршрутизация
- **Three.js** - 3D графика для просмотра STL моделей
- **Tailwind CSS** - utility-first CSS фреймворк

### Telegram Bot
- **python-telegram-bot** - библиотека для создания Telegram ботов
- **aiohttp** - асинхронный HTTP клиент

## Быстрый старт

1. Клонируйте репозиторий
2. Скопируйте `.env.example` в `.env` и настройте переменные окружения
3. Запустите проект с помощью Docker Compose:

```bash
docker-compose up -d
```

## Доступные сервисы

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Основные функции

- 📱 Веб-сайт с информацией о услугах
- 🖼️ Галерея проектов с 3D просмотрщиком
- 📝 Система заказов
- 🤖 Telegram бот для альтернативного способа заказа
- ⚙️ Административная панель для управления контентом
- 📊 Система уведомлений

## Разработка

Каждый компонент может быть запущен отдельно для разработки:

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Telegram Bot
```bash
cd telegram-bot
pip install -r requirements.txt
python main.py
```

## 🚀 Развертывание в продакшн

### Быстрый старт
1. Следуйте [чек-листу развертывания](DEPLOYMENT_CHECKLIST.md)
2. Изучите [руководство по развертыванию](docs/DEPLOYMENT_GUIDE.md)
3. Настройте [TimeWeb хостинг](docs/TIMEWEB_SETUP.md)

### Основные шаги:
```bash
# 1. Настройка сервера
curl -fsSL https://raw.githubusercontent.com/yourusername/printing-platform/main/scripts/setup-server.sh | bash

# 2. Клонирование проекта
git clone https://github.com/yourusername/printing-platform.git /opt/printing-platform
cd /opt/printing-platform

# 3. Настройка окружения
cp .env.production .env
nano .env  # Обновите переменные

# 4. Получение SSL сертификата
sudo certbot --nginx -d your-domain.com

# 5. Запуск приложения
./scripts/deploy.sh
```

### CI/CD
Проект настроен для автоматического развертывания через GitHub Actions:
- Тесты запускаются при каждом push
- Автоматическое развертывание на main ветку
- Rollback при ошибках развертывания

## 📊 Мониторинг

- **Health Check**: `https://your-domain.com/health`
- **API Docs**: `https://your-domain.com/docs`
- **Grafana**: `https://your-domain.com:3001` (опционально)
- **Логи**: `docker-compose logs -f`