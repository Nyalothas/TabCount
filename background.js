chrome.tabs.onCreated.addListener(updateIcon)
chrome.tabs.onRemoved.addListener(updateIcon)
chrome.tabs.onAttached.addListener(updateIcon)
chrome.tabs.onDetached.addListener(updateIcon)

var fonts = [
  "12px Arial"                 ,
  "12px 'Arial Black'"         ,
  "12px 'Comic Sans MS'"       ,
  "12px 'Courier New'"         ,
  "12px 'Lucida Grande'"       ,
  "12px 'Lucida Sans Unicode'" ,
  "12px 'Times New Roman'"     ,
  "12px 'Trebuchet MS'"        ,
  "12px Verdana"               ,
  "12px helvetica"             ,
  "12px hoge,impact"           
];

updateIcon();
function updateIcon() {
  chrome.storage.sync.get({
    bgColor: "",
    txtColor: "",
    isBadgeVisible: ""
  }, function (items) {
    if (!items.bgColor) {
      items.bgColor = "#262626";
    }
    if (!items.txtColor) {
      items.txtColor = "#FFFFFF";
    }

    chrome.tabs.query({}, function (tabs) {
      var tabCount = tabs.length.toString();
      if(items.isBadgeVisible){
        chrome.browserAction.setBadgeText({ text: tabCount });
      }
      chrome.browserAction.setTitle({ title: 'Opened Tabs: ' + tabCount });
      draw(items.bgColor, items.txtColor, tabCount);
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
  context.font = fonts[2];
  context.fillText(text.toString(), 8, 8);

  chrome.browserAction.setIcon({
    imageData: context.getImageData(0, 0, 19, 19)
  });
}