FROM node:10.15.3-alpine
RUN apk update && apk add ffmpeg imagemagick && rm -rf /var/cache/apk/*
WORKDIR /app
COPY package*.json ./
RUN npm install --silent --progress=false
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
