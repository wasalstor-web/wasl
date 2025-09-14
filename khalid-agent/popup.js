function send(action) {
  chrome.runtime.sendMessage({ action });
}

document.getElementById('maps').addEventListener('click', () => send('open-maps'));
document.getElementById('shipping').addEventListener('click', () => send('open-shipping'));
