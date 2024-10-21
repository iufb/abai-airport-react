# Используем официальный Node.js образ для сборки React приложения
FROM node:18 as build

# Создаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем React приложение
RUN npm run build

# Используем минимизированный образ Node.js для запуска приложения
FROM node:18-slim

# Устанавливаем pm2 глобально
RUN npm install -g pm2

# Создаем рабочую директорию для production кода
WORKDIR /app

# Копируем собранные файлы из предыдущего stage
COPY --from=build /app/build ./dist

# Экспонируем порт 3000 для доступа к приложению
EXPOSE 3000

# Команда для запуска приложения через pm2
CMD ["pm2", "serve", "./dist", "3000", "--spa"]
