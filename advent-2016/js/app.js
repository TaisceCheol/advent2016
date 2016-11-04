$(document).foundation();

var date = new Date();
var today = date.getDate();

$.each($('[id^=day]'),function(i,el) {
	var number = parseInt(el.id.split('-').pop());
	if (number <= today) {
		$(el).removeClass('card-disabled');
	} else {
		$(el).parent()[0].href = "/";
		$(el).click(false);
	}
})

$.each($('[id^=content-day]'),function(i,el) {
	var number = parseInt(el.id.split('-').pop());
	if (number > today) {
		$(".hide-content").removeClass('hide-content');
		$(el).addClass('hide-content')
	}
})
