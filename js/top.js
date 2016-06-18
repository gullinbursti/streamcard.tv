// GA TRACKING
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-74998463-1', 'auto');
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

function kik () {
	//alert ("kik");
}

function discord () {
	//alert ("discord");
}

function twitch () {
	//alert ("discord");
}

function fb () {
	//alert ("discord");
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


$(document).ready(function() {
	$('#footer-copyright').html('&copy; '+(new Date()).getFullYear()+' Streamcard.tv');
});