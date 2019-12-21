# Node application
FROM node:10-alpine

WORKDIR /app

# Install dependencies
RUN npm install -g mocha nodemon
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY src ./src/

COPY run.sh .
# Run application
CMD mkdir -p /app/downloads && sh /app/run.sh