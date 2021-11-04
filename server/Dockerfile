# Node application
FROM lsiobase/alpine:3.14

# Install dependencies
RUN apk add nodejs=14.18.1-r0 npm=7.17.0-r0
RUN npm config set unsafe-perm true
RUN npm install -g mocha nodemon
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY src ./src/

COPY run.sh .
COPY root/ /
