chrome.tabs.onCreated.addListener(updateIcon)
chrome.tabs.onRemoved.addListener(updateIcon)
chrome.tabs.onAttached.addListener(updateIcon)
chrome.tabs.onDetached.addListener(updateIcon)

updateIcon();

function updateIcon() {
  chrome.tabs.query({
      
  },function(tabs) {
    var tab = tabs;
    chrome.browserAction.setBadgeText({ text: tab.length.toString()});
    chrome.browserAction.setTitle({ title: 'Opened Tabs: ' + tab.length.toString() });
  });

}