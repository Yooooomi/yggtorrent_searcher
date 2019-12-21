const papa = require('papaparse');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bodyparser = require('body-parser');

const app = express();
const helmet = require('helmet');

const logger = require('./tools/logger');

const API = require('./tools/torrents');
const config = require('./config');
const initer = require('./tools/initer');

let allCors = false;
let allowedCORS = process.env.CORS_WHITELIST || config.cors;

if (allowedCORS === 'all') {
  allCors = true;
} else {
  [allowedCORS] = papa.parse(allowedCORS).data;
  if (!allowedCORS) logger.warn('Failed to parse CORS, expect issues');
}

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allCors || (allowedCORS && allowedCORS.indexOf(origin) > -1)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, Authorization, '
    + 'x-id, Content-Length, X-Requested-With',
  );
  res.header('Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS');

  next();
});

app.use(helmet());
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use(morgan('dev', {
  skip: (req) => {
    if (req.url === '/health') return true;
    return false;
  },
  stream: logger.stream,
}));

app.use(require('./routes/health')());
app.use(require('./routes/torrent')());

app.get('/helloworld', (req, res) => {
  res.status(200).send('Hello, world!');
});

if (!initer()) {
  logger.error('Something went wrong, quitting...');
  return 1;
}

const port = process.env.SERVER_PORT || 8081;

API.init().then(() => {
  app.listen(port, () => logger.info(`Listening on ${port}`));
});

module.exports = app;
