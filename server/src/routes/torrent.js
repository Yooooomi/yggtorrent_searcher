const routes = require('express').Router();
const httpStatus = require('http-status-codes');
const Joi = require('joi');
const { validating } = require('../tools/middleware');
const fs = require('fs');
const path = require('path');
const config = require('/app/config/config');
const sanitize = require('sanitize-filename');

const torrentsAPI = require('../tools/torrents');
const URL = require('url');

const removeAccents = require('remove-accents');

const request = require('cloudscraper');

module.exports = () => {
  routes.get('/search/:search', async (req, res) => {
    const { search } = req.params;
    const { sort, sortOrder } = req.query;

    try {
      const data = await torrentsAPI.search(search, sort, sortOrder);
      return res.status(200).send(data);
    } catch (e) {
      return res.status(500).end();
    }
  });

  const torrentsSchema = Joi.object().keys({
    torrents: Joi.array().items(Joi.object().keys({
      name: Joi.string().required(),
      url: Joi.string().required(),
      pageUrl: Joi.string().required(),
    })).required(),
  }).required();

  routes.post('/dl', validating(torrentsSchema), async (req, res) => {
    const { torrents } = req.value;

    let promises = torrents.map(async e => {
      const url = URL.parse(removeAccents(e.pageUrl));
      const paths = url.pathname.split('/');

      // Remove the empty string because path starts with /
      paths.shift();

      const dll = torrentsAPI.getDownloadLocation(paths[1], paths[2], url);
      const tempPath = path.join(config.tempLocation, sanitize(e.name) + '.torrent');
      const filepath = path.join(dll, sanitize(e.name) + '.torrent');
      try {
        await torrentsAPI.download(e.url, tempPath);
        fs.renameSync(tempPath, filepath);
      } catch (err) {
        console.log('Could not download ' + e.name, err);
      }
    });
    promises = await promises;
    return res.status(200).end();
  });

  routes.post('/getpage/', async (req, res) => {
    const { url } = req.body;

    try {
      let decoded = decodeURIComponent(url);
      decoded = removeAccents(decoded);

      console.log('Downloading ', decoded);
      const jar = request.jar();
      request({
        method: 'GET',
        url: decoded,
        jar,
      }, (err, response, body) => {
        try {
          const torrentContent = torrentsAPI.getTorrentSection(body);
          return res.status(200).send(torrentContent.toString());
        } catch (e) {
          console.error(e);
          return res.status(500).end();
        }
      });
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  return routes;
};
