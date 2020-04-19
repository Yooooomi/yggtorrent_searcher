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

const request = require('request-promise');

async function downloadTorrent(name, url, pageUrl, cookies = null) {
  const sanitizedPageUrl = URL.parse(removeAccents(pageUrl));
  const paths = sanitizedPageUrl.pathname.split('/');

  // Remove the empty string because path starts with /
  paths.shift();

  const dll = torrentsAPI.getDownloadLocation(paths[1], paths[2], sanitizedPageUrl);
  const tempPath = path.join(torrentsAPI.getTempLocation(), `${sanitize(name)}.torrent`);
  const filepath = path.join(dll, `${sanitize(name)}.torrent`);
  await torrentsAPI.download(url, tempPath, cookies);
  fs.renameSync(tempPath, filepath);
}

const onetorrent = Joi.object().keys({
  name: Joi.string().required(),
  url: Joi.string().required(),
  pageUrl: Joi.string().required(),
});

module.exports = () => {
  const torrentSchema = Joi.object().keys({
    torrent: onetorrent,
    cookies: Joi.string().default(null),
  }).required();

  routes.post('/dl_from_ext', validating(torrentSchema), async (req, res) => {
    const { torrent, cookies } = req.value;

    try {
      await downloadTorrent(torrent.name, torrent.url, torrent.pageUrl, cookies);
      return res.status(200).end();
    } catch (e) {
      console.log(e);
      return res.status(500).end();
    }
  });

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
    torrents: Joi.array().items(onetorrent).required(),
    cookies: Joi.array(),
  }).required();

  routes.post('/dl', validating(torrentsSchema), async (req, res) => {
    const { torrents } = req.value;

    let promises = torrents.map(async e => downloadTorrent(e.name, e.url, e.pageUrl));
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
      const body = await request({
        method: 'GET',
        url: decoded,
        jar,
      });
      try {
        const torrentContent = torrentsAPI.getTorrentSection(body);
        return res.status(200).send(torrentContent.toString());
      } catch (e) {
        console.error(e);
        return res.status(500).end();
      }
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  return routes;
};
