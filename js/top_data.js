
function rowHit(channel) {
	ga('send', {
		'hitType'			: 'event',
		'eventCategory'	: 'user',
		'eventAction'		: 'row-'+channel,
		'eventLabel'		: channel,
		'eventValue'		: 1
	});

	window.open("/channel/"+encodeURIComponent(channel));
}

function viewMore() {
	$('#view-more').hide();

}

function populateRows() {
	$.ajax({
		url: 'http://beta.modd.live/api/top_cards.php',
		type: 'GET',
		dataType: 'json',
		success: function (response) {

			$.each(response, function(i, item) {
				var price = Math.max(Math.ceil(item.views * 0.00001) - 0.01, 0.99);
				//console.log(response.message+': ('+item.views+') '+price);

				var html = '<div id="row_' + i + '" class="" style="'+((i % 2 == 0) ? '' : 'background-color:#111216')+'">';
				html += '  <div class="row center-xs" style="border-top: 0 solid #1a1a1a;border-bottom: 1px solid #1a1a1a; color:#ccc; font-weight:400;">';
				html += '    <div class="col-xs-10">';
				html += '      <div class="box">';
				html += '        <div style="line-height:80px; width:80px; text-align:left; float:left;">#' + (i + 1) + '</div> <div style="line-height:80px; text-align:left; float:left;">'+item.channel+'</div>';
				html += '        <div style="line-height:80px; text-align:right; padding-left:60px; float:right;" onclick="rowHit(\'' + item.channel + '\')">$' + price + '</div>';
				html += '        <div style="line-height:80px; text-align:right; padding-left:60px; float:right;"><span class="hover-link">' + numberWithCommas(item.views) + '</span></div>';
				html += '        <div style="line-height:80px; text-align:right; float:right;">100%</div>';
				html += '      </div>';
				html += '    </div>';
				html += '  </div>';
				html += '</div>';





				/*var html = '<div id="row_' + i + '" class="row2">';
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
				*/

				channel_rows.push({
					html : html,
					item : item
				});

				if (i < 25) {
					onlineChecker(item.channel);
					$('.leaderboard-wrapper').append(html);
				}
			});
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
var game_video = "Overwatch";

var kik_info = "KIK - Get chat updates from your favorite game, team, and eSports players";
var discord_info = "DISCORD - Get chat updates from your favorite game, team, and eSports players";
var whisper_info = "WHISPER - Get chat updates from your favorite game, team, and eSports players";
var facebook_info = "FACEBOOK - Get chat updates from your favorite game, team, and eSports players";


$(document).ready(function() {
	$('.game-name').text(game_video);

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
		data : { q : game_video.toLowerCase() },
		dataType: 'json',
		success: function (response) {
			$('.player-frame').attr('src', "http://player.twitch.tv/?channel=" + response.streams[0].channel.name);
		}
	});


	$('#more-button').click(function () {
		$('#more-button').hide();

		for (var i=25; i<channel_rows.length; i++) {
			onlineChecker(channel_rows[i].item.channel);
			$('.leaderboard-wrapper').append(channel_rows[i].html);
		}
	});




	$('.box-kik').mouseover(function() {
		$('#messenger-info').text(kik_info);
	});

	$('.box-discord').mouseover(function() {
		$('#messenger-info').text(discord_info);
	});

	$('.box-twitch').mouseover(function() {
		$('#messenger-info').text(whisper_info);
	});

	$('.box-fb').mouseover(function() {
		$('#messenger-info').text(facebook_info);
	});


	populateRows();
});