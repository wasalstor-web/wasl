function send(action) {
  chrome.runtime.sendMessage({ action });
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('maps').addEventListener('click', () => send('open-maps'));
  document.getElementById('shipping').addEventListener('click', () => send('open-shipping'));
});
