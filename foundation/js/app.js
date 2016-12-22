$(document).foundation();

var date = new Date();
var month = date.getMonth();
var today = date.getDate();

today = 25;

$.each($('[id^=day]'),function(i,el) {
	var number = parseInt(el.id.split('-').pop());
	if ((number <= today) && (month == 11)) {
		$(el).removeClass('card-disabled');
	} else {
		$(el).parent()[0].href = "/";
		$(el).click(false);
	}
})

$.each($('[id^=content-day]'),function(i,el) {
	var number = parseInt(el.id.split('-').pop());
	if ((month != 11) || (number > today)) {
		$(".hide-content").removeClass('hide-content');
		$(el).addClass('hide-content')
	}
})

function openPopup(prov,day) {
  var width=550,height=420;
  var providers={
      "twitter":"https://twitter.com/intent/tweet?via=ITMADublin&hashtags=ITMAadvent&url=http://advent.itma.ie/calendar/day-",
      "google":"https://plus.google.com/share?url=http://advent.itma.ie/calendar/day-",
      'facebook':"https://www.facebook.com/sharer/sharer.php?u=http://advent.itma.ie/calendar/day-"};
 
  var screenLeft=0, screenTop=0;

  var defaultParams = { }

  if(typeof window.screenLeft !== 'undefined') {
      screenLeft = window.screenLeft;
      screenTop = window.screenTop;
  } else if(typeof window.screenX !== 'undefined') {
      screenLeft = window.screenX;
      screenTop = window.screenY;
  }

  var features_dict = {
      toolbar: 'no',
      location: 'no',
      directories: 'no',
      left: screenLeft + ($(window).width() - width) / 2,
      top: screenTop + ($(window).height() - height) * 0.25,
      status: 'no',
      menubar: 'no',
      scrollbars: 'yes',
      resizable: 'no',
      width: width,
      height: height
  };
  features_arr = [];
  for(var k in features_dict) {
      features_arr.push(k+'='+features_dict[k]);
  }
  features_str = features_arr.join(',')

  // var qs = '?'+$.param($.extend({}, defaultParams, params));
  var win;
  win = window.open(providers[prov]+day,prov,features_str);

  win.focus();
  return false;

}