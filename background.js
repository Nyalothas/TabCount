chrome.tabs.onCreated.addListener(updateIcon)
chrome.tabs.onRemoved.addListener(updateIcon)
chrome.tabs.onAttached.addListener(updateIcon)
chrome.tabs.onDetached.addListener(updateIcon)

updateIcon();

function updateIcon() {
  chrome.tabs.query({}, function(tabs) {
    var tab = tabs;
    chrome.browserAction.setBadgeText({ text: tab.length.toString()});
    chrome.browserAction.setTitle({ title: 'Opened Tabs: ' + tab.length.toString() });
    draw(tab.length.toString());
  });

}

function draw(text) {
  var canvas = document.createElement('canvas');
  canvas.width = 19;
  canvas.height = 19;

  var context = canvas.getContext('2d');
  context.fillStyle = "#262626";
  context.fillRect(0, 0, 19, 19);

  context.fillStyle = "#FFFFFF";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "11px Arial";
  context.fillText(text, 8, 8);

  chrome.browserAction.setIcon({
    imageData: context.getImageData(0, 0, 19, 19)
  });
}