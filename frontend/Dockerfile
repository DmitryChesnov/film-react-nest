# frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production=false

# Копируем исходный код
COPY . .

# Собираем проект
RUN npm run build

# Этап: артефакты
FROM alpine:latest AS artifacts

WORKDIR /app
COPY --from=builder /app/dist ./dist

CMD ["echo", "Frontend built successfully"]