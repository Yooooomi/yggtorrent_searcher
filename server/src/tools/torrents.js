const YGG = require('./yggtorrent-api');
const config = require('/app/config/config');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

const client = new YGG({
  host: config.ygg.host,
  searchhost: config.ygg.searchHost,
  username: config.username,
  password: config.password,
});

let lastLogin = null;

const init = () => client.login();

const checkLogin = async () => {
  if (lastLogin === null) {
    await init();
    lastLogin = Date.now();
  } else if (lastLogin + 60 * 60 * 1000 < Date.now()) {
    await init();
  }
}

const getDownloadLocation = (category, subcategory, fullpath) => {
  if (process.env.STAGE === 'development') {
    return '/data';
  }
  const dll = config.downloadLocation;

  if (dll instanceof String) {
    return dll;
  } else if (dll instanceof Function) {
    return dll(category, subcategory, fullpath);
  }
}

const getTempLocation = () => {
  if (process.env.STAGE === 'development') {
    return '/data';
  }
  return config.tempLocation;
}

const search = (search, sort, order) => new Promise(async (s, f) => {
  client.search(search, (err, data) => {
    s(data);
  }, sort, order);
});

const download = async (url, filepath, cookies) => {
  if (!cookies) {
    await checkLogin();
  }
  await client.download(url, filepath, cookies);
}

const getTorrentSection = body => {
  const path = '//main//section[@class="content"]/div[@class="default"]';

  const page = new dom().parseFromString(body)
  const res = xpath.select(path, page);
  return res[0];
};

module.exports = {
  getDownloadLocation,
  getTempLocation,
  init,
  search,
  download,
  getTorrentSection,
};
