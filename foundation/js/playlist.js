plyr.setup();

var player;
var width = $(window).width();
var current_track=0;
var player_index;
var is_playing = false;
var playlist_containers = document.getElementsByClassName('playlist');

if (width > 880) {
	player_index = 0;
} else {
	player_index = 1;
}

player = plyr.get()[player_index]

$(window).resize(function() {
	width = $(window).width();
	if (width > 880) {
		if (player_index != 0) {
			player_index = 0;
			switchPlayer(player_index);
		}
	} else {
		if (player_index != 1) {
			player_index = 1;
			switchPlayer(player_index);
		}
	}
})

var playlist_items = [];
var playlist_elements = []
$('.playlist-item').each(function(el) {
	if (playlist_items.length < 19) {
		playlist_items.push($(this)[0].dataset);
	}
	playlist_elements.push($(this)[0])	
})

function switchPlayer(pindex) {
	var data = playlist_items[current_track];
	var offset = player.getCurrentTime();	

	is_playing = !player.isPaused();

	if (is_playing == true) {
		player.stop();	
	}

	player = plyr.get()[pindex];
	player.source(makeSource(data));	

	if (is_playing == true) {	
		player.play();		
		setTimeout(function(){player.seek(offset)},100);
	}

	player.on('ended',function() {
		playNext(data.index)
	})

	player.on('pause',function() {
		is_playing = false;
	})	
}

function makeSource(data) {
	return {
		type: 'audio',
		title: data.title,
		sources: [{
			src: "https://s3-eu-west-1.amazonaws.com/itma.advent.2016/audio/"+data.url+".mp3"
		}]
	}
}

function playTrack(data) {
	removePlaying(playlist_items[current_track]);

	if (player.isPaused() != true) {
		player.pause();
		is_playing = false;		
	}

	current_track = data.index;	
	
	player.source(makeSource(data));
	
	$(".playlist__nowplaying_item").html(data.title);
	
	player.play();
	
	is_playing = true;

	addPlaying(data)

	player.on('ended',function() {
		removePlaying(data)
		playNext(data.index)
	});

	player.on('pause',function() {
		is_playing = false;
	})	
}

function addPlaying(data) {
	var elements = document.querySelectorAll('[data-url="'+data.url+'"]');
	var icons = document.querySelectorAll('[data-url-icon="'+data.url+'"]');
	for (var i = 0; i < elements.length; i++) {
		$(elements[i]).addClass("is_playing")
		$(icons[i]).addClass("is_playing__icon")
	}
}

function removePlaying(data) {
	var elements = document.querySelectorAll('[data-url="'+data.url+'"]');
	var icons = document.querySelectorAll('[data-url-icon="'+data.url+'"]');	
	for (var i = 0; i < elements.length; i++) {
		$(elements[i]).removeClass("is_playing")
		$(icons[i]).removeClass("is_playing__icon")

	}
}

function playNext(index) {
	var current_data = playlist_items[parseInt(index)];
	removePlaying(current_data);
	nextTrack = playlist_items[(parseInt(index)+1) % playlist_items.length]
	playTrack(nextTrack)
}

$(".previous").click(function() {
	var index = current_track;	
	var current_data = playlist_items[parseInt(index)];
	removePlaying(current_data);
	var lastTrack = playlist_items[(parseInt(index)-1) % playlist_items.length]
	playTrack(lastTrack)
})

$(".next").click(function() {
	var index = current_track;	
	var current_data = playlist_items[parseInt(index)];
	removePlaying(current_data);	
	var nextTrack = playlist_items[(parseInt(index)+1) % playlist_items.length]
	playTrack(nextTrack)
})

$(".playlist-item").click(function() {
    playTrack($(this)[0].dataset)
})

