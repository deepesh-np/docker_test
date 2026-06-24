FROM node:22-alpine

WORKDIR /app

ENV MONGO_URI=mongodb://liquid:220051@host.docker.internal:27017/docker_test?authSource=admin
ENV MONGO_DB_USERNAME=liquid \
    MONGO_DB_PWD=220051


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]