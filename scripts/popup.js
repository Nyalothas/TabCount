var storageObj = {
  bgColor: "",
  txtColor: "",
  isBadgeVisible: "",
  fontIndex: "",
  tabCount: ""
};

getStorage();
function getStorage() {
  chrome.storage.sync.get({
    bgColor: "",
    txtColor: "",
    isBadgeVisible: "",
    fontIndex: ""
  }, function (items) {
    UpdateStorage(items.bgColor, items.txtColor);
    storageObj.isBadgeVisible = items.isBadgeVisible;
    storageObj.fontIndex = items.fontIndex;

    console.log(storageObj.bgColor + " - " + storageObj.txtColor + " > " + storageObj.isBadgeVisible + ' >font> ' + storageObj.fontIndex);

    if(items.fontIndex){
      document.getElementById("fontSelector").selectedIndex=fontIndex;
    }

    if (!items.isBadgeVisible) {
      document.getElementById('badgeStatus').checked = true;
      $('.notify-badge').hide();
    }

  });

  chrome.tabs.query({}, function (tabs) {
    storageObj.tabCount = tabs.length.toString();
    $(".totalOpen").html(storageObj.tabCount);
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
    draw(codeHex, storageObj.txtColor, storageObj.tabCount);
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
    draw(storageObj.bgColor, codeHex, storageObj.tabCount);
  }
});

$("#pickcolorbg").on("change paste keyup", function () {
  UpdateStorage($(this).val(), undefined);
});
$("#pickcolortxt").on("change paste keyup", function () {
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
    draw(items.bgColor, items.txtColor, storageObj.tabCount);
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

//reset icon to default
document.getElementById('reset').addEventListener('click', reset);
function reset() {
  draw(undefined, undefined, storageObj.tabCount);
  UpdateStorage("#262626", "#FFFFFF");
  chrome.storage.sync.set({
    bgColor: storageObj.bgColor,
    txtColor: storageObj.txtColor
  }, function (items) { });
}

function draw(bg = "#262626", txt = "#FFFFFF", text) {
  var canvas = document.createElement('canvas');
  canvas.width = 19;
  canvas.height = 19;

  var context = canvas.getContext('2d', { alpha: false });
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
      draw(tabCount);
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

/* font selection*/
var fonts = [
  "12px Arial",
  "12px 'Arial Black'",
  "12px 'Comic Sans MS'",
  "12px 'Courier New'",
  "12px 'Lucida Grande'",
  "12px 'Lucida Sans Unicode'",
  "12px 'Times New Roman'",
  "12px 'Trebuchet MS'",
  "12px Verdana",
  "12px helvetica",
  "12px hoge,impact"
];
PopulateFonts();
function PopulateFonts() {
  var fontSelector = document.getElementById('fontSelector');

  for (let index = 0; index < fonts.length; index++) {
    const element = fonts[index];

    var opt = document.createElement("option");
    opt.value = index;
    opt.innerHTML = element.substring(5);

    fontSelector.appendChild(opt);
  }
}

$("#fontSelector").on('change', function() {
  //draw with this.value font index
})
