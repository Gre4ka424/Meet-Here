FROM node:18

WORKDIR /app

COPY package*.json ./
RUN apt-get update && apt-get install -y openssl
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
