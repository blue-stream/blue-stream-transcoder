FROM node:10.15.3-alpine as BASE
WORKDIR /app
COPY package*.json ./
RUN npm install --silent --progress=false
COPY . .
RUN npm run build

FROM node:10.15.3-alpine as BUILD
RUN apk update && apk add ffmpeg imagemagick && rm -rf /var/cache/apk/*
WORKDIR /app
COPY --from=BASE /app/package*.json ./
RUN npm install --silent --progress=false --production
COPY --from=BASE /app/dist/ ./dist
EXPOSE 3000

ENTRYPOINT [ "node", "dist/index.js" ]