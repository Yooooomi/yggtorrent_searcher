# Node application
FROM node:10-alpine

WORKDIR /app

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY .eslintrc.yml .
COPY src ./src/

# Run application
CMD npm start