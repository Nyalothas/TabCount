chrome.browserAction.getBadgeText({}, function (result) {
  $(".totalOpen").html(result);
});

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
  var codeHex = $(this).data('hex');
  $('#pickcolorbg').val(codeHex);

  chrome.browserAction.getBadgeText({}, function (result) {
    draw(codeHex, undefined, result);
  });

});

var pickerText = $('#textColor');
pickerText.children('div').hover(function () {
  var codeHex = $(this).data('hex');
  $('#pickcolortxt').val(codeHex);

  chrome.browserAction.getBadgeText({}, function (result) {
    draw(undefined, codeHex, result);
  });
});

// Saves options to chrome.storage
function save_options() {
  var colorBg = document.getElementById('pickcolorbg').value;
  var txtColor = document.getElementById('pickcolortxt').value;
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
function restore_options() {
  // Use default value color = 'red' and txtColor = true.
  chrome.storage.sync.get({
    bgColor: 'red',
    txtColor: true
  }, function (items) {
    document.getElementById('color').value = items.bgColor;
    document.getElementById('like').checked = items.txtColor;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

document.getElementById('reset').addEventListener('click', reset);
function reset(){
  chrome.browserAction.getBadgeText({}, function (result) {
    draw(undefined,undefined,result);
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