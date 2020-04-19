function xpath(path, root = document) {
  return document.evaluate(path, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

const defaultButtonContent = 'Download to deluge';
const buttonSuccessContent = 'Downloaded';
const buttonFailureContent = 'Failure';

function download(button, url, pageUrl, name) {
  chrome.runtime.sendMessage({ url, pageUrl, name }, function (response) {
    if (response.status === 'success') {
      button.textContent = buttonSuccessContent;
    } else {
      button.textContent = buttonFailureContent;
    }
    setTimeout(() => {
      button.textContent = defaultButtonContent;
    }, 1000);
  });
}

function main() {
  const container = xpath('//table[@class="infos-torrent"]/tbody/tr/td[2]');
  const link = xpath('//table[@class="informations"]//a');
  const downloadLink = link.getAttribute('href');
  const name = link.textContent;

  const mybutton = document.createElement('a');
  mybutton.setAttribute('class', 'butt');
  mybutton.textContent = defaultButtonContent;
  mybutton.onclick = () => download(mybutton, downloadLink, document.URL, name);
  container.appendChild(mybutton);
}

function listmain() {
  const container = xpath('//div[@class="table-responsive results"]//tbody');
  console.log(container);
  container.childNodes.forEach(node => {
    if (node.nodeName !== 'TR') {
      return;
    }

    const workNode = node.childNodes[3];
    const linkNode = node.childNodes[5].childNodes[0].getAttribute('target');

    const name = workNode.textContent;
    const pageUrl = workNode.childNodes[0].getAttribute('href');
    const downloadLink = `https://www2.yggtorrent.se/engine/download_torrent?id=${linkNode}`;

    console.log(node, name.trim(), pageUrl, downloadLink)

    const button = document.createElement('a');
    button.textContent = defaultButtonContent;
    button.onclick = () => download(button, downloadLink, pageUrl, name);

    workNode.setAttribute('style', 'width: 100%; display: flex; justify-content: space-between;');
    workNode.appendChild(button);
  });
}

if (document.URL.includes('search')) {
  listmain();
} else {
  main();
}