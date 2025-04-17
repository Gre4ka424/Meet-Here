FROM node:18

WORKDIR /app

COPY package*.json ./
RUN apt-get update && apt-get install -y libssl1.1 || \
    (wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb && \
    dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb)

# Полностью удаляем старые модули и кэш Prisma
RUN rm -rf node_modules
RUN rm -rf .prisma

# Устанавливаем зависимости заново
RUN npm install

COPY . .

# Генерируем Prisma клиент для правильной платформы
RUN npx prisma generate

CMD ["npm", "start"]
