const request = require('cloudscraper');

async function main() {
  const a = await request.get('https://google.com');
  console.log(a);
}

main();
