const request = require('cloudscraper');

async function main() {
  const jar = request.jar();
  const body = await request.post({
    url: 'https://www.yggtorrent.se' + '/user/login',
    formData: {
      'id': 'Obsinex',
      'pass': '66Darkreblochon',
    },
    jar,
  });
  console.log(body, jar);
}

main();
