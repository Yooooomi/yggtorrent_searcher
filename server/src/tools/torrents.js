const YGG = require('./yggtorrent-api');
const config = require('../config');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

const client = new YGG({
    host: 'https://www.yggtorrent.ws/',
    searchhost: 'https://www2.yggtorrent.ws/',
    username: config.username,
    password: config.password,
});

const init = async () => new Promise((s, f) => {
    client.login(() => s());
});

const search = (search, sort, order) => new Promise((s, f) => {
    client.search(search, (err, data) => {
        s(data);
    }, sort, order);
});

const download = (url, filepath) => new Promise(async (s, f) => {
    await client.download(url, filepath, s);
});

const getTorrentSection = body => {
    const path = '//main//section[@class="content"]/div[@class="default"]';

    const page = new dom().parseFromString(body)
    const res = xpath.select(path, page);
    return res[0];
};

module.exports = {
    init,
    search,
    download,
    getTorrentSection,
};
