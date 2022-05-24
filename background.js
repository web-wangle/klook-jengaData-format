const openMgicFloor = 'false';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ openMgicFloor });
});
