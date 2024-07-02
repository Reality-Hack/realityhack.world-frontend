FROM node:21.1-alpine3.17

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN ./node_modules/next/dist/bin/next build

EXPOSE 3000

CMD ["./node_modules/next/dist/bin/next", "start"]