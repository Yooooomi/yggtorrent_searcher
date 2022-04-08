const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const sanitize = require("sanitize-filename");
const torrentsAPI = require("../tools/torrents");
const URL = require("url");
const removeAccents = require("remove-accents");
const multer = require("multer")({
  dest: torrentsAPI.getTempLocation(),
  limits: { files: 1, fileSize: 10485760 }, // Limits to 1 file of 10Mo
});

async function downloadTorrent(name, pageUrl, alreadyExistingPath) {
  const sanitizedPageUrl = URL.parse(
    removeAccents(decodeURIComponent(pageUrl))
  );
  const paths = sanitizedPageUrl.pathname.split("/");

  // Remove the empty string because path starts with /
  paths.shift();

  const dll = torrentsAPI.getDownloadLocation(
    paths[1],
    paths[2],
    sanitizedPageUrl.pathname
  );
  const filepath = path.join(dll, `${sanitize(name)}.torrent`);
  fs.renameSync(alreadyExistingPath, filepath);
}

router.post("/dl_from_ext", multer.single("torrent"), async (req, res) => {
  const { name, pageUrl, isBase64 } = req.body;

  if (isBase64) {
    let buffer = fs.readFileSync(req.file.path);
    buffer = Buffer.from(buffer.toString(), "base64");
    fs.writeFileSync(req.file.path, buffer);
  }

  try {
    await downloadTorrent(name, pageUrl, req.file.path);
    return res.status(200).end();
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
});

module.exports = router;


