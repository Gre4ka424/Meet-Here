FROM node:18

WORKDIR /app
RUN apt-get update && apt-get install -y libssl1.1 || \
    (wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb && \
    dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb)

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем prisma схему
COPY prisma ./prisma/

# Генерируем Prisma клиент
RUN npx prisma generate

# Копируем исходный код
COPY . .

# Открываем порт
EXPOSE 5000

# Команда для запуска приложения
CMD ["npm", "start"] 
