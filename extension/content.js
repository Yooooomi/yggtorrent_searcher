function getStorage() {
  return new Promise((res, rej) => {
    chrome.storage.sync.get(res);
  });
}

async function downloadTorrent(url, pageUrl, name) {
  try {
    let file = await fetch(url, {
      credentials: 'include',
    });
    file = await file.blob();

    const formData = new FormData();
    formData.append('torrent', file);
    formData.append('url', url);
    formData.append('pageUrl', pageUrl);
    formData.append('name', name);
    const storage = await getStorage();
    const res = await fetch(`${storage.ip}/dl_from_ext`, {
      method: 'POST',
      body: formData,
    });
    if (res.status === 200) {
      return ({ status: 'success' });
    } else {
      return ({ status: 'failure' });
    }
  } catch (e) {
    console.error(e);
    return ({ status: 'failure' });
  }
}

function xpath(path, root = document) {
  return document.evaluate(path, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

const notLoggedButtonContent = 'You must log in';
const defaultButtonContent = 'Download to deluge';
const buttonSuccessContent = 'Downloaded';
const buttonFailureContent = 'Failure';

async function download(button, url, pageUrl, name) {
  button.textContent = 'Downloading';
  const response = await downloadTorrent(url, pageUrl, name);
  if (response.status === 'success') {
    button.textContent = buttonSuccessContent;
  } else {
    button.textContent = buttonFailureContent;
  }
  setTimeout(() => {
    button.textContent = defaultButtonContent;
  }, 1000);
}

function isLoggedIn() {
  const container = xpath('//a[@id="register"]');
  return !Boolean(container);
}

function main() {
  const logged = isLoggedIn();
  const container = xpath('//table[@class="infos-torrent"]/tbody/tr/td[2]');
  if (!container) {
    return;
  }
  const link = xpath('//table[@class="informations"]//a');
  const downloadLink = link.getAttribute('href');
  const name = link.textContent;

  const mybutton = document.createElement('a');
  mybutton.setAttribute('class', 'butt');
  mybutton.textContent = logged ? defaultButtonContent : notLoggedButtonContent;
  if (logged) {
    mybutton.onclick = () => download(mybutton, downloadLink, document.URL, name);
  }
  container.appendChild(mybutton);
}

function listmain() {
  const logged = isLoggedIn();
  const container = xpath('//div[@class="table-responsive results"]//tbody');
  
  if (!container) {
    return;
  }
  container.childNodes.forEach(node => {
    if (node.nodeName !== 'TR') {
      return;
    }

    const workNode = node.childNodes[3];
    const linkNode = node.childNodes[5].childNodes[0].getAttribute('target');

    const name = workNode.textContent;
    const pageUrl = workNode.childNodes[0].getAttribute('href');
    const downloadLink = `https://${location.host}/engine/download_torrent?id=${linkNode}`;

    const button = document.createElement('a');
    button.textContent = logged ? defaultButtonContent : notLoggedButtonContent;
    if (logged) {
      button.onclick = () => download(button, downloadLink, pageUrl, name);
    }

    button.setAttribute('style', 'float: right;');
    workNode.appendChild(button);
  });
}

if (document.URL.includes('search')) {
  listmain();
} else {
  main();
}