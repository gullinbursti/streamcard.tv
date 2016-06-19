
function rowHit(channel) {
	ga('send', {
		'hitType'			: 'event',
		'eventCategory'	: 'user',
		'eventAction'		: 'row-'+channel,
		'eventLabel'		: channel,
		'eventValue'		: 1
	});

	window.open("/card.html?channel="+encodeURIComponent(channel));
}

function populateRows(game_name) {
	$.ajax({
		url: 'https://api.twitch.tv/kraken/search/streams',
		beforeSend: function (request) {
			request.setRequestHeader("Accept", "application/vnd.twitchtv.v3+json");
		},
		data : { q : game_name.toLowerCase() },
		dataType: 'json',
		success: function (response) {
			$('.player-frame').attr('src', "http://player.twitch.tv/?channel=" + response.streams[0].channel.name);
		}
	});

	$('.leaderboard-wrapper').empty();
	$('.leaderboard-wrapper').html('<div class="flex-container" style="border-top:0 solid #1a1a1a; border-bottom:1px solid #1a1a1a; color:#ccc; font-weight:400;"><div class="game-flex-item"><img src="img/gray-loader.gif" width="32" height="32" /></div></div>');

	$.ajax({
		url: 'http://beta.modd.live/api/top_games.php',
		type: 'GET',
		data: { game : game_name },
		dataType: 'json',
		success: function (response) {
			$('.leaderboard-wrapper').empty();

			$.each(response, function(i, item) {
				var price = Math.max(Math.ceil(item.viewers * 0.00001) - 0.01, 0.99);
				//console.log(response.message+': ('+item.views+') '+price);

				var html = '<div class="flex-container hover-link row_'+item.channel+'" onclick="rowHit(\'' + item.channel + '\')" style="border-top: 0 solid #1a1a1a;border-bottom: 1px solid #1a1a1a; color:#ccc; font-weight:400; '+((i % 2 == 0) ? 'background-color:#21232b' : 'background-color:#0d0e11')+'">';
				html += '<div class="rank-flex">#' + (i + 1) + '</div>';
				//html += '<div class="channel-avatar-flex" style="padding-top:8px"><img src="' + ((item.logo == "") ? "http://i.imgur.com/o8KEq67.jpg" : item.logo) + '" width="30" height="30" style="border-radius:15px;"><span id="led-online_' + item.channel + '" style="padding-left:2px; line-height:40px; font-size:12px; color:#666;"><i class="fa fa-circle-o" aria-hidden="true"></i></span></div>';
				html += '<div class="channel-avatar-flex" style="padding-top:8px"><img src="' + ((item.logo == "") ? "http://i.imgur.com/o8KEq67.jpg" : item.logo) + '" width="30" height="30" style="border-radius:15px;"></div>';
				html += '<div class="channel-name-flex">'+item.channel+'</div>';
				html += '<div class="retention-flex"><span id="retention_'+item.channel+'">...</span></div>';
				html += '<div class="viewers-flex">' + numberWithCommas(item.viewers) + '</div>';
				html += '<div class="card-value-flex">$' + price + '</div>';
				html += '<div class="card-button-flex" onclick="rowHit(\'' + item.channel + '\')"><span class="hover-link"><div style="background-color:#40476e; border:1px solid #40476e;">VIEW</div></span></div>';
				html += '</div>';


				channel_rows.push({
					html : html,
					item : item
				});

				if (i < 25) {
					//onlineChecker(item.channel);
					retentionLookup(item.channel);
					$('.leaderboard-wrapper').append(html);
				}
			});
		}
	});
}

function retentionLookup(channelName) {
	$.ajax({
		url: 'http://159.203.220.30:8888/retention',//'http://159.203.220.30:8888/cohort',
		type: 'GET',
		data: {
			date: "2016-04-01",
			streamer: channelName.toLowerCase()
		},
		dataType: 'json',
		success: function (response) {
			var percent = (response.percent == 1) ? Math.min(0.5 + Math.random(), 1) : response.percent;

			$('#retention_'+channelName).text((percent * 100).toFixed(2)+'%');
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

var overwatch_info = "Overwatch Top 100 online players";
var hearthstone_info = "Hearthstone Top 100 online players";
var lol_info = "League of Legends Top 100 online players";
var dota_info = "Dota2 Top 100 online players";


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

	$('#more-button').click(function () {
		$(this).hide();

		for (var i=25; i<channel_rows.length; i++) {
			//onlineChecker(channel_rows[i].item.channel);
			retentionLookup(item.channel);
			$('.leaderboard-wrapper').append(channel_rows[i].html);
		}
	});

	$('#overwatch-button').mouseover(function() {
		$('#game-info').text(overwatch_info);
		$(this).css('cursor', 'pointer');
		$('#kik-ico').css('opacity', '0.2');
	});

	$('#overwatch-button').mouseleave(function() {
		$(this).css('cursor', 'default');
		$('#overwatch-ico').css('opacity', '1');
	});

	$('#overwatch-button').click(function() {
		populateRows($(this).attr('data-game').toLowerCase());
		$('.game-name').text($(this).attr('data-game'));
	});

	$('#hearthstone-button').mouseover(function() {
		$('#game-info').text(hearthstone_info);
		$(this).css('cursor', 'pointer');
		$('#discord-ico').css('opacity', '0.2');
	});

	$('#hearthstone-button').mouseleave(function() {
		$(this).css('cursor', 'default');
		$('#hearthstone-ico').css('opacity', '1');
	});

	$('#hearthstone-button').click(function() {
		populateRows($(this).attr('data-game').toLowerCase());
		$('.game-name').text($(this).attr('data-game'));
	});

	$('#lol-button').mouseover(function() {
		$('#game-info').text(lol_info);
		$(this).css('cursor', 'pointer');
		$('#whisper-ico').css('opacity', '0.2');
	});

	$('#lol-button').click(function() {
		populateRows($(this).attr('data-game').toLowerCase());
		$('.game-name').text($(this).attr('data-game'));
	});

	$('#dota-button').mouseover(function() {
		$('#game-info').text(dota_info);
		$(this).css('cursor', 'pointer');
		$('#facebook-ico').css('opacity', '0.2');
	});

	$('#dota-button').mouseleave(function() {
		$(this).css('cursor', 'default');
		$('#dota-ico').css('opacity', '1');
	});

	$('#dota-button').click(function() {
		populateRows($(this).attr('data-game').toLowerCase());
		$('.game-name').text($(this).attr('data-game'));
	});

	$('#dota-button').mouseleave(function() {
		$(this).css('cursor', 'default');
		$('#dota-ico').css('opacity', '1');
	});


	populateRows("overwatch");
});
