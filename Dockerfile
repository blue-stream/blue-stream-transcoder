FROM node:10-alpine
RUN apk update && apk add ffmpeg imagemagick && rm -rf /var/cache/apk/*

ENV HOME=/home/blue-stream

COPY package*.json $HOME/app/

WORKDIR $HOME/app

RUN npm install --silent --progress=false

COPY . $HOME/app/

CMD ["npm", "start"]