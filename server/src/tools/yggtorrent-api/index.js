var request = require('request-promise');
var cheerio = require('cheerio');
var jar = request.jar();
const fs = require('fs');

request.defaults({ jar });

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
    });
  }

  download(url, filepath, cookies) {
    console.log('URL: ', url);
    return request({
      method: 'GET',
      url: url,
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7',
        cookie: cookies,
        referer: 'https://www2.yggtorrent.se/torrent/application/formation/426208-tuto+comtuto+d%C3%A9tourage+photo+complexe+avec+les+couches+de+photoshop+avec+photoshop+2016+french+web-dl+1080p',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      },
      followAllRedirects: true,
      maxRedirects: 100000,
    }).pipe(fs.createWriteStream(filepath));
  }

  async search(name, sort = '', order = 'desc') {
    const body = await request.get({
      url: this.searchhost + '/engine/search',
      qs: {
        name: name,
        do: 'search',
        sort,
        order,
      },
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

Ygg.jar = jar;

module.exports = Ygg;
