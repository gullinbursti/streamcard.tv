// GA TRACKING
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-74998463-1', 'auto');
ga('send', 'pageview');


function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function home () {
	document.location="index.html"
}

function admin () {
	document.location="insights.html"
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
function play () {
	ga('send', {
		'hitType'			: 'event',
		'eventCategory'	: 'user',
		'eventAction'		: 'video-view',
		'eventLabel'		: channel,
		'eventValue'		: 1
	});

	$('.player-frame').attr('src', 'https://player.twitch.tv/?channel='+channel);
	$('.streamPlayer').show();

}

function login () {
	document.location="http://beta.modd.live/"
}

function top100 () {
	document.location="top.html"
}

function about () {
	document.location="about.html"
}

function team () {
	document.location="team.html"
}

function faq () {
	document.location="faq.html"
}

function report () {
	document.location="mailto:support@modd.live"
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
function legal () {
	document.location="legal.html"
}


function rowHit(channel) {
	ga('send', {
		'hitType'			: 'event',
		'eventCategory'	: 'user',
		'eventAction'		: 'row-'+channel,
		'eventLabel'		: channel,
		'eventValue'		: 1
	});

	window.open("player.html?channel="+encodeURIComponent(channel));
}

function viewMore() {
	$('#view-more').hide();
	for (var i=25; i<channel_rows.length; i++) {
		onlineChecker(channel_rows[i].item.channel);
		$('.leaderboard-wrapper').append(channel_rows[i].html);
	}
}

function populateRows() {
	$.ajax({
		url: 'http://beta.modd.live/api/top_cards.php',
		type: 'GET',
		dataType: 'json',
		success: function (response) {

			var cnt = 0;
			$.each(response, function(i, item) {
				var price = Math.max(Math.ceil(item.views * 0.00001) - 0.01, 0.99);
				//console.log(response.message+': ('+item.views+') '+price);

				var html = '<div id="row_' + cnt + '" class="row2">';
				html += '<div class="row" style="' + ((i % 2 == 0) ? '' : 'background-color:#1c1c1c; ') + 'border:0 solid #8c8c8c; border-top-width:1px; font-weight:500;">';
				html += '<div class="row-rank" style="float:left; line-height:100px; padding-left:10px; width:50px; padding-right:0; font-weight:700;">' + (i + 1) + '</div>';
				html += '<div class="row-name" style="float:left; line-height:100px; font-weight:700;" ><span id="led-online_' + item.channel + '" style="padding-bottom:15px; padding-right:10px; font-size:16px; line-height:25px; font-weight:400; color:#666;"><i class="fa fa-circle-o" aria-hidden="true"></i></span></div>';
				html += '<div class="row-name" style="float:left; padding-top:30px; padding-left:0; padding-right:10px;"><img id="img_' + item.channel + '" src="' + ((item.img_url == "") ? "http://i.imgur.com/o8KEq67.jpg" : item.img_url) + '" width="40" height="40" style="border-radius:20px;"></div>';
				html += '<div class="row-name" style="line-height:100px; float:left; font-weight:700;" >' + item.channel + '</div>';
				html += '<div class="row-name" style="float:left; padding:30px 10px 0 10px;"><img id="game-image_' + item.channel + '" style="" src="https://static-cdn.jtvnw.net/ttv-static/404_preview-120x72.jpg" width="60" height="36" /></div>';
				html += '<div class="row-name" style="line-height:100px; float:left; font-weight:700; padding-left:10px">100%</div>';
				html += '<div class="row-name" style="line-height:100px; float:left; font-weight:700; padding-left:10px">' + numberWithCommas(item.views) + '</div>';
				html += '<div class="row-name" style="line-height:100px; float:left; font-weight:700; padding-left:10px">$' + price + '</div>';
				html += '<div class="row-value" style="line-height:100px; padding-left:80%; font-weight:700;"><span class="hover-link"><div onclick="rowHit(\'' + item.channel + '\')">VIEW CARD</div></span></div>';
				html += '</div>';
				html += '</div>';

				channel_rows.push({
					html : html,
					item : item
				});
				cnt++;

				if (cnt <= 25) {
					onlineChecker(item.channel);
					$('.leaderboard-wrapper').append(html);
				}
			});

			$('.leaderboard-wrapper').append('<div id="view-more" class="row2"><div onclick="viewMore();">VIEW MORE</div></div>');
		}
	});
}


function onlineChecker(channelName) {
	$.ajax({
		url: 'https://api.twitch.tv/kraken/streams/' + channelName,
		beforeSend: function (request) {
			request.setRequestHeader("Accept", "application/vnd.twitchtv.v3+json");
		},
		dataType: 'json',
		success: function (response) {

			//console.log("GAME: "+response.stream.game.logo.medium);


			if (response.stream != null) {
				$('#led-online_' + channelName).css('color', (response.stream != null) ? '#48c342' : '#333');
				$('#led-online_' + channelName).html((response.stream != null) ? '<i class="fa fa-circle" aria-hidden="true"></i>' : '<i class="fa fa-circle-o" aria-hidden="true"></i>');

				$.ajax({
					url: 'https://api.twitch.tv/kraken/search/games',
					beforeSend: function (request) {
						request.setRequestHeader("Accept", "application/vnd.twitchtv.v3+json");
					},
					data : {
						q : response.stream.game,
						type : "suggest" },
					dataType: 'json',
					success: function (response) {
						if (response.games.length > 0) {
							$('#game-image_' + channelName).attr('src', response.games[0].logo.medium);
						}
					}
				});

			} else {
				$.ajax({
					url: 'http://beta.modd.live/api/last_session.php',
					data : { channel : channelName },
					dataType: 'json',
					success: function (response) {
						if (response.game.length > 0) {
							$.ajax({
								url: 'https://api.twitch.tv/kraken/search/games',
								beforeSend: function (request) {
									request.setRequestHeader("Accept", "application/vnd.twitchtv.v3+json");
								},
								data : {
									q : response.game,
									type : "suggest" },
								dataType: 'json',
								success: function (response) {
									console.log($('#game-image_' + channelName)+"]["+response.games[0].logo.medium);
									if (response.games.length > 0) {
										$('#game-image_' + channelName).attr('src', response.games[0].logo.medium);
									}
								}
							});
						}
					}
				});
			}
		}
	});
}


var channel_rows = [];


$(document).ready(function() {

	$.ajax({
		url: 'http://beta.modd.live/api/card_total.php',
		type: 'GET',
		data: null,
		dataType: 'json',
		success: function(response) {
			$('.card-total').text(numberWithCommas(response.total));
			$('.card-amount-value').text(numberWithCommas('$' + response.amount.toFixed(2)));
			$('.card-total-value').text(numberWithCommas(response.views));
		}
	});

	$.ajax({
		url: 'https://api.twitch.tv/kraken/search/streams',
		beforeSend: function (request) {
			request.setRequestHeader("Accept", "application/vnd.twitchtv.v3+json");
		},
		data : { q : 'overwatch' },
		dataType: 'json',
		success: function (response) {
			$('.player-frame').attr('src', "http://player.twitch.tv/?channel=" + response.streams[0].channel.name);
		}
	});


	populateRows();
});