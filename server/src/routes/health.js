const routes = require('express').Router();
const httpStatus = require('http-status-codes');

module.exports = () => {
  routes.get('/health', (req, res) => {
    return res.status(200).end();
  });

  return routes;
};
