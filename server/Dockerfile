# Node application
FROM node:10-alpine

WORKDIR /app

# Install dependencies
RUN npm install -g mocha nodemon
COPY package.json .
COPY package-lock.json .
COPY run.sh .
RUN npm install

COPY src ./src/

# Run application
CMD mkdir -p /app/downloads && /app/run.sh