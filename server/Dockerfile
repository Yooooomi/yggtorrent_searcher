# Node application
FROM lsiobase/alpine:3.14

RUN mkdir /app/.npm

# Install dependencies
RUN apk add nodejs=14.18.1-r0 npm=7.17.0-r0
RUN npm config set cache /app/.npm
RUN npm config set prefix /app/.npm
RUN npm config set unsafe-perm true --allow-root
RUN npm install -g mocha nodemon

COPY package.json /app/
COPY package-lock.json /app/
RUN cd /app && npm install

COPY src /app/src/

COPY run.sh /app/
COPY root/ /
