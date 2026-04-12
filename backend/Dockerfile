# backend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./
COPY tsconfig*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production=false

# Копируем исходный код
COPY src ./src

# Собираем проект
RUN npm run build

# Продакшен этап
FROM node:20-alpine

WORKDIR /app

# Устанавливаем production зависимости
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Копируем собранный код
COPY --from=builder /app/dist ./dist

# Создаем необходимые директории
RUN mkdir -p public

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

CMD ["node", "dist/main.js"]