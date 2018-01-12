chrome.browserAction.getBadgeText({}, function (result) {
  $(".totalOpen").html(result);
  $(".notify-badge").html(result);
});

var storageObj = {
  bgColor: "",
  txtColor: "",
  isBadgeVisible: ""
};

getStorage();
function getStorage() {
  chrome.storage.sync.get({
    bgColor: "",
    txtColor: "",
    isBadgeVisible: ""
  }, function (items) {
    UpdateStorage(items.bgColor, items.txtColor);
    storageObj.isBadgeVisible = items.isBadgeVisible;
    console.log(storageObj.bgColor + " - " + storageObj.txtColor + " > " + storageObj.isBadgeVisible);
  });

/*   chrome.browserAction.getBadgeBackgroundColor( {}, function (ColorArray){
    console.log(ColorArray);
  }); */
}

function UpdateStorage(bg = storageObj.bgColor, txt = storageObj.txtColor) {
  storageObj.bgColor = bg;
  storageObj.txtColor = txt;
  $('#pickcolorbg').val(bg).css("color", bg);
  $('#pickcolortxt').val(txt).css("color", txt);

  $('.totalOpen').css("background", bg);
  $('.totalOpen').css("color", txt)
}

populateColors();
function populateColors() {
  var colorList = [
    '#BF3F7F', '#BF3F3F', '#BF7F3F', '#BFBF3F', '#7FBF3F', '#3FBF3F', '#3FBF7F', '#3FBFBF', '#3F7FBF', '#3F3FBF', '#7F3FBF', '#BF3FBF', '#FFFFFF', '#000000'
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

    UpdateStorage(codeHex, undefined);
    draw(codeHex, storageObj.txtColor, $('.totalOpen')[0].innerText);
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

    UpdateStorage(undefined, codeHex);
    draw(storageObj.bgColor, codeHex, $('.totalOpen')[0].innerText);
  }
});

$("#pickcolorbg").on("change paste keyup", function() {
  UpdateStorage($(this).val(), undefined);
});
$("#pickcolortxt").on("change paste keyup", function() {
  UpdateStorage(undefined, $(this).val());
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
  chrome.storage.sync.get({
    bgColor: "",
    txtColor: ""
  }, function (items) {
    if (!items.bgColor) {
      items.bgColor = "#262626";
    }
    if (!items.txtColor) {
      items.txtColor = "#FFFFFF";
    }

    UpdateStorage(items.bgColor, items.txtColor);
    draw(items.bgColor, items.txtColor, $('.totalOpen')[0].innerText);
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

//reset icon to default
document.getElementById('reset').addEventListener('click', reset);
function reset() {
  draw(undefined, undefined, $('.totalOpen')[0].innerText);
  UpdateStorage("#262626", "#FFFFFF");
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
  }, function (items) {console.log(items + " <<") });

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
