const integrations = {
  'open-maps': () => chrome.tabs.create({ url: 'https://maps.google.com' }),
  'open-shipping': () => chrome.tabs.create({ url: 'https://wasl.store/tracking' })
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const fn = integrations[msg.action];
  if (fn) {
    fn();
  }
});
