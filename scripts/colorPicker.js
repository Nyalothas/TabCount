populateColors();

function populateColors() {

    var colorList = [
        '#bf3f7f', '#bf3f3f', '#bf7f3f', '#bfbf3f', '#7fbf3f', '#3fbf3f', '#3fbf7f', '#3fbfbf', '#3f7fbf', '#3f3fbf', '#7f3fbf', '#bf3fbf', '#FFFFFF', '#000000'
    ];

    var pickerBg = $('#background');
    var pickerText = $('#textColor');

    for (var i = 0; i < colorList.length; i++) {
        pickerBg.append('<div class="sample" sample-id="' + i + '" style="background-color:' + colorList[i] + ';" data-hex="' + colorList[i] + '"></div>');
        pickerText.append('<div class="sample" sample-id="' + i + '" style="background-color:' + colorList[i] + ';" data-hex="' + colorList[i] + '"></div>');
    }
}

/* var pickerBg = $('#background');
$('.palette').click(function (event) {
event.stopPropagation();
picker.fadeIn();
pickerBg.children('div').hover(function () {
    var codeHex = $(this).data('hex');

    $('.color-holder').css('background-color', codeHex);
    $('#pickcolorbg').val(codeHex);
});
}); */

//<div class="sample" sample-id="0" style="background-color: rgb(191, 63, 127);" data-hex="#bf3f7f"></div>
/* $('body').click(function () {
    picker.fadeOut();
}); */

var pickerBg = $('#background');
pickerBg.children('div').hover(function () {
    var codeHex = $(this).data('hex');
    $('#pickcolorbg').val(codeHex);
});

var pickerText = $('#textColor');
pickerText.children('div').hover(function () {
    var codeHex = $(this).data('hex');
    $('#pickcolortxt').val(codeHex);
});
