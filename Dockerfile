FROM node:21-alpine As builder
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM node:21-alpine As production
WORKDIR /app

COPY package*.json ./

RUN npm i --omit=dev && npm i -g pm2
COPY --from=builder /app/dist ./dist
COPY ./ecosystem.config.js  .
CMD ["pm2-runtime","start","ecosystem.config.js"]