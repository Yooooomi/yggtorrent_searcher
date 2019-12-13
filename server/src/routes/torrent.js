const routes = require('express').Router();
const httpStatus = require('http-status-codes');
const Joi = require('joi');
const { validating } = require('../tools/middleware');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const API = require('../tools/torrents');

module.exports = () => {
  routes.get('/search/:search', async (req, res) => {
    const { search } = req.params;
    const { sort, sortOrder } = req.query;

    console.log(sort, sortOrder);

    const data = await API.search(search, sort, sortOrder);
    return res.status(200).send(data);
  });

  const torrentsSchema = Joi.object().keys({
    torrents: Joi.array().items(Joi.object().keys({
      name: Joi.string().required(),
      url: Joi.string().required(),
    })).required(),
  }).required();

  routes.post('/dl', validating(torrentsSchema), async (req, res) => {
    const { torrents } = req.value;

    let promises = torrents.map(async e => {
      const filepath = path.join(config.downloadLocation, e.name + '.torrent');
      fs.createWriteStream(filepath);
      await API.download(e.url, filepath);
    });
    promises = await promises;
    return res.status(200).end();
  });

  return routes;
};
