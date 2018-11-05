FROM node:latest

#Install Video and Animation Transcoders
COPY install-script.sh ./install-script.sh
RUN . ./install-script.sh

ENV HOME=/home/blue-stream

COPY package*.json $HOME/app/

RUN chown -R node $HOME/* /usr/local/

WORKDIR $HOME/app

RUN npm install --silent --progress=false

COPY . $HOME/app/

RUN chown -R node $HOME/*

EXPOSE 3000

USER node

CMD ["npm", "start"]