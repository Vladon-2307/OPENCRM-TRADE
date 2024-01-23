FROM node:20.10-alpine as builder

WORKDIR /app

COPY *.json ./

COPY . .

RUN npm install

RUN npm run build

FROM node:20.10-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE ${API_PORT}

CMD ["npm", "run", "start:prod"]

