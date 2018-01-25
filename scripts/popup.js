var storageObj = {
  bgColor: "",
  txtColor: "",
  bgOpacity: "",
  isBadgeVisible: "",
  fontIndex: "",
  fontSizeIndex: "",
  isAlertEnabled: "",
  alertCount: "",
  tabCount: ""
};

getStorage();
function getStorage() {
  chrome.storage.sync.get({
    bgColor: "",
    txtColor: "",
    bgOpacity: 1,
    isBadgeVisible: "",
    isAlertEnabled: "",
    alertCount: 20,
    fontIndex: 2,
    fontSizeIndex: 0
  }, function (items) {
    UpdateStorage(items.bgColor, items.txtColor);
    storageObj.isBadgeVisible = items.isBadgeVisible;

    storageObj.fontIndex = items.fontIndex;
    document.getElementById("fontSelector").selectedIndex = storageObj.fontIndex;
    storageObj.fontSizeIndex = items.fontSizeIndex;
    document.getElementById("fontSizeSelector").selectedIndex = storageObj.fontSizeIndex;

    storageObj.bgOpacity = items.bgOpacity;
    document.getElementsByClassName('range-slider__range')[0].value = storageObj.bgOpacity;
    document.getElementsByClassName('range-slider__value')[0].innerHTML = storageObj.bgOpacity;

    if (!items.isBadgeVisible) {
      document.getElementById('badgeStatus').checked = true;
      $('.notify-badge').hide();
    }

    storageObj.alertCount = items.alertCount;
    document.getElementById('alertCount').value = storageObj.alertCount;
    if (items.isAlertEnabled) {
      document.getElementById('alertMessage').checked = true;
    }

  });

  chrome.tabs.query({}, function (tabs) {
    storageObj.tabCount = tabs.length.toString();
    $(".totalOpen").html(storageObj.tabCount).css("font-family", fonts[storageObj.fontIndex]);
    $(".notify-badge").html(storageObj.tabCount);
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

  $('.totalOpen').css("background", hexToRgbA(storageObj.bgColor, storageObj.bgOpacity));
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
    draw();
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
    draw();
  }
});

$("#pickcolorbg").on("change paste keyup", function () {
  if($(this).val().length == 4 || $(this).val().length == 7){
    UpdateStorage($(this).val(), undefined);
    draw();
  }
 
});
$("#pickcolortxt").on("change paste keyup", function () {
  if($(this).val().length == 4 || $(this).val().length == 7){
    UpdateStorage(undefined, $(this).val());
    draw();
  }
});

// Saves options to chrome.storage
function save_options() {
  var colorBg = document.getElementById('pickcolorbg').value;
  var txtColor = document.getElementById('pickcolortxt').value;

  storageObj.bgColor = colorBg;
  storageObj.txtColor = txtColor;

  chrome.storage.sync.set({
    bgColor: storageObj.bgColor,
    txtColor: storageObj.txtColor,
    bgOpacity: storageObj.bgOpacity,
    fontIndex: storageObj.fontIndex,
    fontSizeIndex: storageObj.fontSizeIndex
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
    txtColor: "",
    bgOpacity: "",
    fontIndex: "",
    fontSizeIndex: ""
  }, function (items) {

    items.bgColor = items.bgColor ? items.bgColor : "#262626";
    items.txtColor = items.txtColor ? items.txtColor : "#FFFFFF";
    storageObj.fontIndex = items.fontIndex ? items.fontIndex : 2;
    storageObj.fontSizeIndex = items.fontSizeIndex ? items.fontSizeIndex : 0;
    storageObj.bgOpacity = items.bgOpacity ? items.bgOpacity : 1;

    document.getElementById("fontSelector").selectedIndex = storageObj.fontIndex;
    document.getElementById("fontSizeSelector").selectedIndex = storageObj.fontSizeIndex;

    UpdateStorage(items.bgColor, items.txtColor);
    draw();
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

//reset icon to default
document.getElementById('reset').addEventListener('click', reset);
function reset() {
  UpdateStorage("#262626", "#FFFFFF");
  storageObj.fontIndex = 2;
  storageObj.fontSizeIndex = 0;
  storageObj.bgOpacity = 1;
  $(".totalOpen").html(storageObj.tabCount).css("font-family", fonts[storageObj.fontIndex]);
  draw();
  chrome.storage.sync.set({
    bgColor: storageObj.bgColor,
    txtColor: storageObj.txtColor,
    bgOpacity: storageObj.bgOpacity,
    fontIndex: storageObj.fontIndex,
    fontSizeIndex: storageObj.fontSizeIndex
  }, function (items) { });
}

function draw() {
  var canvas = document.createElement('canvas');
  canvas.width = 19;
  canvas.height = 19;

  var context = canvas.getContext('2d');
  context.fillStyle = hexToRgbA(storageObj.bgColor, storageObj.bgOpacity);
  context.fillRect(0, 0, 19, 19);

  context.fillStyle = storageObj.txtColor;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = fontSizes[storageObj.fontSizeIndex] + fonts[storageObj.fontIndex];
  context.fillText(storageObj.tabCount, 8, 8);

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
    $('.notify-badge').hide();
  } else {
    chrome.tabs.query({}, function (tabs) {
      var tabCount = tabs.length.toString();
      chrome.browserAction.setBadgeText({ text: tabCount });
      chrome.browserAction.setTitle({ title: 'Opened Tabs: ' + tabCount });
      storageObj.tabCount = tabCount;
      draw();
    });
    storageObj.isBadgeVisible = true;
    $('.notify-badge').show();
  }

  //save status here
  chrome.storage.sync.set({
    isBadgeVisible: storageObj.isBadgeVisible
  }, function (items) { });
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

/* font family selection*/
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

/* PopulateFonts();
function PopulateFonts() {
  var fontSelector = document.getElementById('fontSelector');

  for (let index = 0; index < fonts.length; index++) {
    const element = fonts[index];

    var opt = document.createElement("option");
    opt.value = index;
    opt.innerHTML = element.substring(5);

    fontSelector.appendChild(opt);
  }
} */

$("#fontSelector").on('change', function () {
  storageObj.fontIndex = this.value;
  $(".totalOpen").css("font-family", fonts[storageObj.fontIndex]);
  draw();
})

$("#fontSizeSelector").on('change', function () {
  storageObj.fontSizeIndex = this.value;
  draw();
})

/* font size selection*/
/* PopulatefontSize();
function PopulatefontSize() {
  var fontSizeSelector = document.getElementById('fontSizeSelector');

  for (let index = 12; index < 20; index++) {
    var opt = document.createElement("option");
    opt.value = index;
    opt.innerHTML = index + "px";

    fontSizeSelector.appendChild(opt);
  }
} */



/* Alert message */
document.getElementById('alertMessage').addEventListener('click', AlertMessage);
function AlertMessage() {
  if (document.getElementById('alertMessage').checked) { //this
    var alertNr = document.getElementById('alertCount').value;

    function hasOnlyDigits(value) {
      return /^-{0,1}\d+$/.test(value);
    }

    storageObj.alertCount = (hasOnlyDigits(alertNr) && alertNr > 1) ? alertNr : 20;
    if (hasOnlyDigits(alertNr) && alertNr > 1) {
      storageObj.alertCount = alertNr;
      storageObj.isAlertEnabled = true;
    } else {
      storageObj.alertCount = 20;
      document.getElementById('alertCount').value = storageObj.alertCount;
      alert("Must be a number greater than 1!");
    }

  } else {
    storageObj.isAlertEnabled = false;
  }

  chrome.storage.sync.set({
    isAlertEnabled: storageObj.isAlertEnabled,
    alertCount: storageObj.alertCount
  }, function (items) { });
}

$("#alertCount").on("change paste keyup", function () {
  AlertMessage();
});


var rangeSlider = function () {
  var slider = $('.range-slider'),
    range = $('.range-slider__range'),
    value = $('.range-slider__value');

  slider.each(function () {
    value.each(function () {
      var value = $(this).prev().attr('value');
      $(this).html(value);
    });

    range.on('input', function () {
      $(this).next(value).html(this.value);
      storageObj.bgOpacity = this.value;
      $('.totalOpen').css("background", hexToRgbA(storageObj.bgColor, storageObj.bgOpacity));
      draw();

    });
  });

};
rangeSlider();

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
