FROM node:21.1-alpine3.17

WORKDIR /usr/src/app

COPY runapp runapp
COPY public/ public/
COPY *.js .
COPY *.json .
COPY .env.* .
COPY src/ src/

EXPOSE 3000

CMD ["./runapp"]