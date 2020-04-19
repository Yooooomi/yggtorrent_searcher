
chrome.runtime.onMessage.addListener((request, sender, sendReponse) => {
  const { source, url, pageUrl, name, newIp, } = request;

  function download() {
    chrome.storage.sync.get(async values => {
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
        await fetch(`${values.ip}/dl_from_ext`, {
          method: 'POST',
          body: formData,
        });
        sendReponse({ status: 'success' });
      } catch (e) {
        sendReponse({ status: 'failure' });
      }
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

