#!/bin/bash

# deploy.sh - скрипт для деплоя на сервер
set -e

echo "🚀 Starting deployment..."

# Загрузка последних образов
echo "📦 Pulling latest images..."
docker pull ghcr.io/dmitrychesnov/film-react-nest-backend:latest
docker pull ghcr.io/dmitrychesnov/film-react-nest-frontend:latest
docker pull ghcr.io/dmitrychesnov/film-react-nest-nginx:latest

# Остановка старых контейнеров
echo "🛑 Stopping old containers..."
docker-compose down

# Запуск новых контейнеров
echo "🐳 Starting new containers..."
docker-compose up -d

# Сборка фронтенда
echo "🏗️ Building frontend..."
docker-compose --profile build run --rm frontend-builder

# Перезапуск nginx
echo "🔄 Restarting nginx..."
docker-compose restart nginx

# Проверка здоровья
echo "✅ Checking health..."
sleep 5
curl -f http://localhost:3000/api/afisha/films || echo "⚠️ Backend health check failed"
curl -f http://localhost/api/afisha/films || echo "⚠️ Nginx health check failed"

echo "🎉 Deployment completed successfully!"
EOF

# 5. Сделайте файл исполняемым (для Linux/Mac)
chmod +x scripts/deploy.sh