# Node application
FROM node:14-alpine

WORKDIR /app

RUN npm install -g mocha nodemon

COPY package.json /app/
COPY yarn.lock /app/
RUN cd /app && yarn install

COPY src /app/src/

COPY run.sh /app/

ENTRYPOINT [ "yarn", "start" ]
