# frontend/Dockerfile

# Этап 1: Сборка фронтенда
FROM node:20 AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Собираем проект
RUN npm run build

# Этап 2: Сервер (nginx)
FROM nginx

# Копируем собранные файлы из предыдущего этапа
COPY --from=builder /app/dist /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]