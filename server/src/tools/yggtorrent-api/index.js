var request = require('cloudscraper');
var cheerio = require('cheerio');
var jar = request.jar();
const fs = require('fs');
request.defaults({ followAllRedirects: true });

class Ygg {
  constructor(config) {
    this.host = config.host;
    this.searchhost = config.searchhost;
    this.username = config.username;
    this.password = config.password;
  }

  async login() {
    return request({
      method: 'POST',
      url: this.host + '/user/login',
      formData: {
        'id': this.username,
        'pass': this.password,
      },
      jar: jar
    });
  }

  download(url, filepath) {
    return request({
      method: 'GET',
      url: url,
      jar: jar
    }).pipe(fs.createWriteStream(filepath));
  }

  search(name, sort = '', order = 'desc') {
    const body = await request({
      method: 'GET',
      url: this.searchhost + '/engine/search',
      qs: {
        name: name,
        do: 'search',
        sort,
        order,
      },
      jar: jar
    });

    var $ = cheerio.load(body);

    var results = [];
    $('.table-responsive.results tbody tr').each((i, tr) => {
      results.push({
        // line: $(tr).text(),
        url: $(tr).find('#torrent_name').attr('href'),
        name: $(tr).find('#torrent_name').text().trim(),
        age: $($(tr).find('td')[4]).find('div').text(),
        size: $($(tr).find('td')[5]).text(),
        completed: $($(tr).find('td')[6]).text(),
        seed: $($(tr).find('td')[7]).text(),
        leech: $($(tr).find('td')[8]).text(),
        downloadurl: this.searchhost + '/engine/download_torrent?id=' + $(tr).find('#get_nfo').attr('target'),
      });
    });
  }
}

module.exports = Ygg;
