const routes = require('express').Router();
const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');
const torrentsAPI = require('../tools/torrents');
const URL = require('url');
const removeAccents = require('remove-accents');
const multer = require('multer')({
  dest: torrentsAPI.getTempLocation(),
  limits: { files: 1, fileSize: 10485760 }, // Limits to 1 file of 10Mo
});

async function downloadTorrent(name, url, pageUrl, alreadyExistingPath = null) {
  const sanitizedPageUrl = URL.parse(removeAccents(pageUrl));
  const paths = sanitizedPageUrl.pathname.split('/');

  // Remove the empty string because path starts with /
  paths.shift();

  const dll = torrentsAPI.getDownloadLocation(paths[1], paths[2], sanitizedPageUrl);
  const filepath = path.join(dll, `${sanitize(name)}.torrent`);
  if (!alreadyExistingPath) {
    const tempPath = path.join(torrentsAPI.getTempLocation(), `${sanitize(name)}.torrent`);
    await torrentsAPI.download(url, tempPath);
    fs.renameSync(tempPath, filepath);
  } else {
    fs.renameSync(alreadyExistingPath, filepath);
  }
}

module.exports = () => {
  routes.post('/dl_from_ext', multer.single('torrent'), async (req, res) => {
    const { name, url, pageUrl } = req.body;

    try {
      await downloadTorrent(name, url, pageUrl, req.file.path);
      return res.status(200).end();
    } catch (e) {
      console.log(e);
      return res.status(500).end();
    }
  });

  return routes;
};
