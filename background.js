chrome.tabs.onCreated.addListener(updateIcon)
chrome.tabs.onRemoved.addListener(updateIcon)
chrome.tabs.onAttached.addListener(updateIcon)
chrome.tabs.onDetached.addListener(updateIcon)

var storageObj = {
  bgColor: "",
  txtColor: "",
};

getStorage();
function getStorage(){
  chrome.storage.sync.get({
    bgColor: "",
    txtColor: "",
  }, function (items) {
   storageObj.bgColor = items.bgColor;
   storageObj.txtColor = items.txtColor;
   console.log(storageObj.bgColor + " - " + storageObj.txtColor);
  });
}

updateIcon();
function updateIcon() {
  chrome.tabs.query({}, function(tabs) {
    var tab = tabs;
    chrome.browserAction.setBadgeText({ text: tab.length.toString()});
    chrome.browserAction.setTitle({ title: 'Opened Tabs: ' + tab.length.toString() });
    draw(storageObj.bgColor,storageObj.txtColor,tab.length);
    //draw(tab.length.toString());
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

function restore_options() {
  chrome.storage.sync.get({
    bgColor: "#262626",
    txtColor: "#FFFFFF",
    isBadgeVisible: isBadgeVisible
  }, function (items) {
    alert(isBadgeVisible);
    chrome.browserAction.getBadgeText({}, function (result) {
      if(!isBadgeVisible)
        draw(item.bgColor,item.txtColor,"");
        else
        draw(item.bgColor,item.txtColor,result);
    });
    
  });
}