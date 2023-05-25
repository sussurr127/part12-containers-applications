FROM node:16

WORKDIR /usr/src/server

COPY . .

RUN npm ci
CMD DEBUG=playground:* npm start
