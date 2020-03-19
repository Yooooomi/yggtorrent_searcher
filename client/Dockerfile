# Node application
FROM node:10-alpine

WORKDIR /app

RUN apk add make gcc g++ python

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install -g serve
RUN npm install

COPY public ./public/
COPY src ./src/

COPY run.sh .
# Run application
CMD sh /app/run.sh
