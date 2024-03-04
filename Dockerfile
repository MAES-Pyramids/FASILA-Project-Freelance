FROM node:lts-alpine

WORKDIR /server

COPY config.env ./
COPY package.json ./
COPY docker-compose.yml ./

RUN npm install --only=production


COPY src/ src/
COPY public/ public/


USER node

CMD [ "npm", "start" ]

EXPOSE 3000