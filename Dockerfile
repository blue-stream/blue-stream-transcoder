FROM node:latest

# Install Video and Animation Transcoders
COPY install-script.sh .

RUN . ./install-script.sh
########

ENV HOME=/home/blue-stream

COPY package*.json $HOME/app/

RUN chown -R node $HOME/* /usr/local/

WORKDIR $HOME/app

RUN npm install --silent --progress=false

COPY . $HOME/app/

RUN chown -R node $HOME/*

USER node

CMD ["npm", "start"]