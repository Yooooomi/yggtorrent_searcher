
chrome.runtime.onMessage.addListener((request, sender, sendReponse) => {
  const { source, url, pageUrl, name, newIp, } = request;

  function download() {
    chrome.storage.sync.get(async values => {

    });
  }

  async function updateIp() {
    chrome.storage.sync.set({ ip: newIp }, () => {
      sendReponse({ status: 'success' });
    });
  }

  if (source === 'download') {
    download();
  } else if (source === 'new_ip') {
    updateIp();
  }

  return true;
});

