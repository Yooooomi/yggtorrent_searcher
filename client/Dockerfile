# Node application
FROM node:10-alpine

WORKDIR /app

RUN apk add make gcc g++ python

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY public ./public/
COPY src ./src/

RUN yarn install -g serve
RUN yarn build

# Run application
CMD run.sh