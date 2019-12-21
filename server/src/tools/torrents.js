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

const getDownloadLocation = (category, subcategory, fullpath) => {
    const dll = config.downloadLocation;

    if (dll instanceof String) {
        return dll;
    } else if (dll instanceof Function) {
        return dll(category, subcategory, fullpath);
    }
}

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
    getDownloadLocation,
    init,
    search,
    download,
    getTorrentSection,
};
