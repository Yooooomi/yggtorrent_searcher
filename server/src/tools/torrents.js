const YGG = require('./yggtorrent-api');
const config = require('../config');

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

module.exports = {
    init,
    search,
    download,
};
