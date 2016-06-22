// GA TRACKING
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-79705534-1', 'auto');
ga('send', 'pageview');


// BUTTONS
function channel_name () {
	alert ("channel");
}

function buyButton () {
	alert ("buy");
}

function shareButton () {
	alert ("share");
}

function topButton () {
	alert ("top");
}

function openKik (channelName) {
	console.log("KIK - ["+isMobile()+"]["+kik.enabled+"]");

	if (isMobile()) {
		if (kik.enabled) {
			kik.openConversation("streamcard");
			//window.open("https://kik.me/streamcard");

			//kik.send('streamcard', {
			//  title     : 'Streamcard Notifications',
			//  text      : channel,
			//  data      : {
			//    channel : channel
			//  }
			//});

		} else {
			location.href = "card://streamcard.tv/card.html?channel=" + channel;
		}

	} else {
		location.href = "https://kik.me/streamcard";

		//$('.overlay-title').text('Requires Kik');
		//$('.overlay-message').text('Visit this page within Kik browser to enable.');
		//$('.overlay-button').text('OK');
		//$('.overlay-alert').removeClass('is-hidden');
	}
}

function openDiscord (channelName) {
	console.log("DISCORD");
	//location.href = "https://discord.gg/014do3goV6bJgwIf8";
	location.href = "https://discord.gg/014do3goV6bJgwIf8";
}

function openTwitch (channelName) {
	console.log("TWITCH");

	if (twitch_auth.twitch_id == "") {
		setCookie("channel", channelName);
		setCookie('whisper_request', "1");
		twitchAuth();

	} else {
		$.ajax({
			url: 'http://beta.modd.live/api/streamer_subscribe.php',
			type: 'GET',
			data: {
				type : 'whisper',
				channel : channelName,
				username : twitch_auth.twitch_name
			},
			dataType: 'json',
			success: function(response) {
				$('.overlay-title').text('Subscribed to ' + channelName);
				$('.overlay-message').text('You will now recieve updates from this streamer.');
				$('.overlay-button').text('OK');
				$('.overlay-alert').removeClass('is-hidden');
			}
		});
	}
}

function openFacebook (channelName) {
	console.log("FACEBOOK");
	location.href = "http://m.me/streamcard";
}

function twitchAuth(channelName) {
	setCookie('channel', channelName);

	// localhost redirect
	if (location.hostname == "localhost")
		location.href = "https://api.twitch.tv/kraken/oauth2/authorize?action=authorize&client_id=bdmreezjx7g0syk09kyzmkds978vrdj&login=&login_type=login&redirect_uri=http%3A%2F%2Flocalhost%2Fcard.html&response_type=token&scope=user_read+channel_subscriptions+chat_login&utf8=%E2%9C%93&force_verify=true";

	// live app redirect
	else {
		location.href = "https://api.twitch.tv/kraken/oauth2/authorize?action=authorize&client_id=kn6iwqzezy1kir29dvrleq4m0bf1t87&login=&login_type=login&redirect_uri=http%3A%2F%2Fstreamcard.tv%2Fcard.html&response_type=token&scope=user_read+channel_subscriptions+chat_login&utf8=%E2%9C%93&force_verify=false";
	}
}

function addCard() {
	location.href = "http://dashboard.modd.live";
}

function legal() {
	location.href = "/legal.html";
}

function share () {
	ga('send', {
		'hitType'			: 'event',
		'eventCategory'	: 'user',
		'eventAction'		: 'share',
		'eventLabel'		: channel,
		'eventValue'		: 1
	});
	window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent("Check out "+channel+"'s Stream Card. p.00m.co/"+channel)+"&via=TeamMODD");
}

function support () {
	ga('send', {
		'hitType'			: 'event',
		'eventCategory'	: 'user',
		'eventAction'		: 'report',
		'eventLabel'		: channel,
		'eventValue'		: 1
	});

	setTimeout(function() {
		$.ajax({
			url: 'http://beta.modd.live/api/submit_support.php',
			type: 'POST',
			data: {
				channel_id : channelID,
				message : channel + " has been reported."
			},
			dataType: 'json',
			success: function(response) {
				$(".overlayLoading").fadeOut("fast", function() {});
			}
		});
	}, 1);
}


function resizer() {
	var height = $('.header-wrapper').width() * 9 / 16;

	//$('.preview-video').css('height', Math.floor(height) + 'px');
	$('.player-frame').attr('height', Math.floor(height));
}

var twitch_auth = {
	twitch_id   : getCookie('twitch_id'),
	twitch_name : getCookie('twitch_name'),
	oauth_token : getCookie('twitch_oauth_token')
};


$(document).ready(function() {
	resizer();
	window.addEventListener('resize', function(event) {
		resizer();
	});

	$('#footer-copyright').html('&copy; '+(new Date()).getFullYear()+' Streamcard.tv');
});