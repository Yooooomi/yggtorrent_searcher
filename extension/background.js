
const neededCookies = [
  '__cfduid',
  'remove_ads',
  'cf_clearance',
  '__ga',
  '__cf_bm',
  'ygg_',
];

chrome.runtime.onMessage.addListener((request, sender, sendReponse) => {
  const { url, pageUrl, name } = request;

  chrome.cookies.getAll({}, async cookies => {
    let finalCookies = cookies.map(cookie => {
      if (neededCookies.some(e => e === cookie.name)) {
        return `${cookie.name}=${cookie.value}`;
      }
      return null;
    });
    console.log(finalCookies);
    finalCookies = finalCookies.filter(e => e).join('; ');
    try {
      const body = {
        torrent: { url, pageUrl, name, },
        cookies: finalCookies,
      }
      const res = await fetch('http://localhost:8081/dl_from_ext', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      sendReponse({ status: 'success' });
    } catch (e) {
      sendReponse({ status: 'failure' });
    }
  });
  return true;
});

