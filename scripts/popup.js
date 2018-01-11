chrome.browserAction.getBadgeText({}, function (result) {
  $(".totalOpen").html(result);
});

var storageObj = {
  bgColor: "",
  txtColor: "",
  isBadgeVisible: false
};

getStorage();
function getStorage(){
  chrome.storage.sync.get({
    bgColor: "",
    txtColor: "",
    isBadgeVisible: false
  }, function (items) {
   storageObj.bgColor = items.bgColor;
   storageObj.txtColor = items.txtColor;
   storageObj.isBadgeVisible = items.isBadgeVisible;
   console.log(storageObj.bgColor + " - " + storageObj.txtColor + " > " + storageObj.isBadgeVisible);
   $('#background').val(storageObj.bgColor);
   $('#pickcolortxt').val(storageObj.txtColor);
  });
}

populateColors();
function populateColors() {
  var colorList = [
    '#bf3f7f', '#bf3f3f', '#bf7f3f', '#bfbf3f', '#7fbf3f', '#3fbf3f', '#3fbf7f', '#3fbfbf', '#3f7fbf', '#3f3fbf', '#7f3fbf', '#bf3fbf', '#FFFFFF', '#000000'
  ];

  var pickerBg = $('#background');
  var pickerText = $('#textColor');

  for (var i = 0; i < colorList.length; i++) {
    var element = '<div class="sample" sample-id="' + i + '" style="background-color:' + colorList[i] + ';" data-hex="' + colorList[i] + '"></div>';
    pickerBg.append(element);
    pickerText.append(element);
  }
}

var pickerBg = $('#background');
pickerBg.children('div').hover(function () {
  if ($('#pickcolorbg').is(':disabled')) {
    pickerBg.attr('disabled', true);
  } else {
    pickerBg.attr('disabled', false);
    var codeHex = $(this).data('hex');
    $('#pickcolorbg').val(codeHex);
    
    storageObj.bgColor = codeHex;
    draw(codeHex,storageObj.txtColor,$('.totalOpen')[0].innerText);
  }
});
var pickerText = $('#textColor');
pickerText.children('div').hover(function () {

  if ($('#pickcolortxt').is(':disabled')) {
    pickerText.attr('disabled', true);
  } else {
    pickerText.attr('disabled', false);
    var codeHex = $(this).data('hex');
    $('#pickcolortxt').val(codeHex);

    storageObj.txtColor = codeHex;
    draw(storageObj.bgColor, codeHex, $('.totalOpen')[0].innerText);
  }
});

// Saves options to chrome.storage
function save_options() {
  var colorBg = document.getElementById('pickcolorbg').value;
  var txtColor = document.getElementById('pickcolortxt').value;

  storageObj.bgColor = colorBg;
  storageObj.txtColor = txtColor;

  chrome.storage.sync.set({
    bgColor: colorBg,
    txtColor: txtColor
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
restore_options();
function restore_options() {
  // Use default value color = 'red' and txtColor = true.
  chrome.storage.sync.get({
    bgColor: "#262626",
    txtColor: "#FFFFFF"
  }, function (items) {
    if(!items.bgColor){
      items.bgColor = "#262626";
    }
    if(!items.txtColor){
      items.txtColor = "#FFFFFF";
    }
    //document.getElementById('color').value = items.bgColor;
    //document.getElementById('like').checked = items.txtColor;
    storageObj.bgColor = items.bgColor;
    storageObj.txtColor = items.txtColor;
    $('#pickcolorbg').val(items.txtColor);
    $('#pickcolortxt').val(items.bgColor);
    draw(items.bgColor,items.txtColor,$('.totalOpen')[0].innerText);
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

//reset icon to default
document.getElementById('reset').addEventListener('click', reset);
function reset() {
  draw(undefined, undefined, $('.totalOpen')[0].innerText);
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

//hide badge
document.getElementById('badgeStatus').addEventListener('click', hideBadge);
function hideBadge() {
  if (document.getElementById('badgeStatus').checked) {
    chrome.browserAction.setBadgeText({
      'text': '' //an empty string displays nothing!
    });
    storageObj.isBadgeVisible = false;
  } else {
    chrome.tabs.query({}, function (tabs) {
      var tab = tabs;
      chrome.browserAction.setBadgeText({ text: tab.length.toString() });
      chrome.browserAction.setTitle({ title: 'Opened Tabs: ' + tab.length.toString() });
      draw(tab.length.toString());
    });
    storageObj.isBadgeVisible = true;
  }

  //save status here
  chrome.storage.sync.set({
    isBadgeVisible: storageObj.isBadgeVisible
  }, function () { });

}

//lock
var locks = document.querySelectorAll('.lock');
locks.forEach(element => {
  element.addEventListener('click', function () {
    this.locked = !this.locked;
    element.setAttribute('locked-state', this.locked);
  
    var input = element.previousElementSibling
    if (locked) {
      input.setAttribute('disabled', this.locked);
    } else
      input.removeAttribute('disabled');
  
  }.bind(this));
});