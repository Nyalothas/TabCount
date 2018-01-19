chrome.tabs.onCreated.addListener(updateIcon)
chrome.tabs.onRemoved.addListener(updateIcon)
chrome.tabs.onAttached.addListener(updateIcon)
chrome.tabs.onDetached.addListener(updateIcon)

var fonts = [
  "Arial",
  "'Arial Black'",
  "'Comic Sans MS'",
  "'Courier New'",
  "'Lucida Grande'",
  "'Lucida Sans Unicode'",
  "'Times New Roman'",
  "'Trebuchet MS'",
  "Verdana",
  "helvetica",
  "hoge,impact"
];

var fontSizes = [
  "12px ",
  "13px ",
  "14px ",
  "15px ",
  "16px ",
  "17px ",
  "18px ",
  "19px "
];

updateIcon();
function updateIcon() {
  chrome.storage.sync.get({
    bgColor: "",
    txtColor: "",
    bgOpacity: 1,
    isBadgeVisible: "",
    fontIndex: 2,
    fontSizeIndex: 0,
    isAlertEnabled: "",
    alertCount: ""
  }, function (items) {

    items.bgColor = items.bgColor ? items.bgColor : "#262626";
    items.txtColor = items.txtColor ? items.txtColor : "#FFFFFF";

    chrome.tabs.query({}, function (tabs) {
      var tabCount = tabs.length.toString();
      if (items.isBadgeVisible) {
        chrome.browserAction.setBadgeText({ text: tabCount });
      }

      chrome.browserAction.setTitle({ title: 'Opened Tabs: ' + tabCount });
      draw(items.bgColor, items.txtColor, tabCount, items.fontIndex , items.fontSizeIndex, items.bgOpacity);

      if (items.isAlertEnabled && parseInt(tabCount) >= parseInt(items.alertCount)) {
        var myAudio = new Audio();        // create the audio object
        myAudio.src = "male_warning.mp3"; // assign the audio file to its src
        myAudio.play();

        var message = "You have " + tabCount + " tabs opened!";

        chrome.tts.speak(message, {},function(){}); 
        alert(message);
      }

    });
  });
}

function draw(bg = "#262626", txt = "#FFFFFF", text, fontStyle = 2, fontSizeIndex = 0, bgOpacity = 1) {
  var canvas = document.createElement('canvas');
  canvas.width = 19;
  canvas.height = 19;

  var context = canvas.getContext('2d');
  context.fillStyle = hexToRgbA(bg, bgOpacity);
  context.fillRect(0, 0, 19, 19);

  context.fillStyle = txt;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = fontSizes[fontSizeIndex] + fonts[fontStyle];
  context.fillText(text, 8, 8);

  chrome.browserAction.setIcon({
    imageData: context.getImageData(0, 0, 19, 19)
  });
}

function hexToRgbA(hex, opacity) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
  }
}