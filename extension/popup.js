
let input;
let button;
let current;

document.addEventListener('DOMContentLoaded', () => {
  current = document.getElementById('current');
  input = document.getElementById('input');
  button = document.getElementById('button');
  button.addEventListener('click', onUpdate);

  chrome.storage.sync.get(values => {
    current.textContent = `Current IP: ${values.ip}`;
  });
});

function onUpdate() {
  const newIp = input.value;
  chrome.runtime.sendMessage({
    source: 'new_ip',
    newIp: newIp,
  }, () => {
    chrome.storage.sync.get(values => {
      current.textContent = `Current IP: ${values.ip}`;
    });
  });
}