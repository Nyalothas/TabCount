chrome.tabs.onCreated.addListener(updateIcon)
chrome.tabs.onRemoved.addListener(updateIcon)
chrome.tabs.onAttached.addListener(updateIcon)
chrome.tabs.onDetached.addListener(updateIcon)

var storageObj = {
  bgColor: "",
  txtColor: "",
};

updateIcon();
function updateIcon() {
  chrome.storage.sync.get({
    bgColor: "",
    txtColor: "",
  }, function (items) {
    storageObj.bgColor = items.bgColor;
    storageObj.txtColor = items.txtColor;

    chrome.tabs.query({}, function (tabs) {
      var count = tabs.length.toString();
      chrome.browserAction.setBadgeText({ text: count });
      chrome.browserAction.setTitle({ title: 'Opened Tabs: ' + count });
      draw(storageObj.bgColor, storageObj.txtColor, count);
    });
  });
}

function draw(bg = "#262626", txt = "#FFFFFF", text) {
  var canvas = document.createElement('canvas');
  canvas.width = 19;
  canvas.height = 19;

  var context = canvas.getContext('2d');
  context.fillStyle = bg;
  context.fillRect(0, 0, 19, 19);

  context.fillStyle = txt;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "11px Arial";
  context.fillText(text.toString(), 8, 8);

  chrome.browserAction.setIcon({
    imageData: context.getImageData(0, 0, 19, 19)
  });
}