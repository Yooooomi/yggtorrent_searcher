const YGG = require('./src/tools/yggtorrent-api');
const config = require('../config/config');

async function main() {
  const client = new YGG({
    host: config.ygg.host,
    searchhost: config.ygg.searchHost,
    username: config.username,
    password: config.password,
  });

  let lastLogin = null;

  // const a = await client.login();
  // console.log(a);
  // console.log(YGG.jar);
  try {
    const search = await client.search('interstellar');
    console.log(search);
  } catch (e) {
    console.log(e);
  }
}

main();
