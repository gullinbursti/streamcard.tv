
function rowHit(channel) {
	ga('send', {
		'hitType'			: 'event',
		'eventCategory'	: 'row',
		'eventAction'		: channel,
		'eventLabel'		: '',
		'eventValue'		: 1
	});

	deleteCookie("channel");
	window.open("/card.html?channel="+encodeURIComponent(channel));
}

function rowIcon(service, channel) {
	ga('send', {
		'hitType'			: 'event',
		'eventCategory'	: 'row',
		'eventAction'		: service.toLowerCase(),
		'eventLabel'		: channel,
		'eventValue'		: 1
	});

	openMessenger(service, channel);
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
			$('.preview-image').attr('src', response.streams[0].preview.medium);
			//$('.player-frame').attr('src', "http://player.twitch.tv/?channel=" + response.streams[0].channel.name);
		}
	});
	$('.leaderboard-wrapper').empty();
	$('.leaderboard-wrapper').html('<div class="flex-container" style="border-top:0 solid #1a1a1a; border-bottom:1px solid #1a1a1a; color:#ccc; font-weight:400;"><div class="game-flex-item"><div class="loader-circle">Loading...</div></div></div>');

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

				var html = '<div class="leaderboard-row flex-container hover-link row_'+item.channel+'">';
				html += '<div onclick="rowHit(\'' + item.channel + '\')" class="rank-flex">#' + (i + 1) + '</div>';
				html += '<div onclick="rowHit(\'' + item.channel + '\')" class="channel-avatar-flex" style="padding-top:16px; vertical-align: middle"><span style="display:inline-block; height:100%; vertical-align:middle;"><img src="' + ((item.logo == "") ? "http://i.imgur.com/o8KEq67.jpg" : item.logo) + '" width="30" height="30" style="vertical-align:middle; max-height:30px; max-width:30px; border-radius:15px;"></span></div>';
				html += '<div onclick="rowHit(\'' + item.channel + '\')" class="channel-name-flex">'+item.channel+'</div>';
				html += '<div onclick="rowHit(\'' + item.channel + '\')" class="retention-flex"><span id="retention_'+item.channel+'">...</span></div>';
				html += '<div class="viewers-flex">' + numberWithCommas(item.viewers) + '</div>';
				//html += '<div onclick="rowHit(\'' + item.channel + '\')" class="card-value-flex">$'+price+'</div>';
				//html += '<div class="card-button-flex" onclick="rowHit(\'' + item.channel + '\')"><span class="hover-link"><div class="buy-buton" style="margin:0; font-size:16px; line-height:0;">VIEW</div></span></div>';
				html += '<div class="card-button-flex">';
				html += '  <img class="im-button" data-im="Kik" onclick="rowIcon(\'Kik\', \''+item.channel+'\')" data-channel="'+item.channel+'" src="/img/icon-kik-white.png" width="28" height="28" />';
				html += '  <img class="im-button" data-im="Discord" onclick="rowIcon(\'Discord\', \''+item.channel+'\')" data-channel="'+item.channel+'" src="/img/icon-discord-white.png" width="28" height="28" />';
				html += '  <img class="im-button" data-im="Twitch" onclick="rowIcon(\'Twitch\', \''+item.channel+'\')" data-channel="'+item.channel+'" src="/img/icon-twitch-white.png" width="28" height="28" />';
				html += '  <img class="im-button" data-im="Facebook" onclick="rowIcon(\'Facebook\', \''+item.channel+'\')" data-channel="'+item.channel+'" src="/img/icon-facebook-white.png" width="28" height="28" />';
				html += '</div>';
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

			$('#more-button').show();
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
			var percent = (response.percent == 1) ? (Math.floor((Math.random() * 500) + 100) * 0.001) : response.percent;

			$('#retention_'+channelName).text((percent * 100).toFixed(2)+'%');
		}
	});
}

var channel_rows = [];
var game_video = "Overwatch";

var overwatch_info = "Overwatch Top 100 online players";
var csgo_info = "CS:GO Top 100 online players";
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

		for (var i=25; i<Math.min(channel_rows.length, 100); i++) {
			//onlineChecker(channel_rows[i].item.channel);
			retentionLookup(channel_rows[i].item.channel);
			$('.leaderboard-wrapper').append(channel_rows[i].html);
		}
	});

	$('#overwatch-button').click(function() {
		setCookie('channel', $(this).attr('data-game'));
		populateRows($(this).attr('data-game').toLowerCase());
		$('.game-name').text($(this).attr('data-game'));

		$(this).addClass('is-selected');
		$('#csgo-button').removeClass('is-selected');
		$('#lol-button').removeClass('is-selected');
		$('#dota-button').removeClass('is-selected');
		$('.game-header-image').attr('src', "img/home-device-overwatch.png");
	});
	
	$('#csgo-button').click(function() {
		setCookie('channel', $(this).attr('data-game'));
		populateRows($(this).attr('data-game').toLowerCase());
		$('.game-name').text($(this).attr('data-game'));

		$(this).addClass('is-selected');
		$('#overwatch-button').removeClass('is-selected');
		$('#lol-button').removeClass('is-selected');
		$('#dota-button').removeClass('is-selected');
		$('.game-header-image').attr('src', "img/home-device-csgo.png");
	});

	$('#lol-button').click(function() {
		setCookie('channel', $(this).attr('data-game'));
		populateRows($(this).attr('data-game').toLowerCase());
		$('.game-name').text($(this).attr('data-game'));

		$(this).addClass('is-selected');
		$('#overwatch-button').removeClass('is-selected');
		$('#csgo-button').removeClass('is-selected');
		$('#dota-button').removeClass('is-selected');
		$('.game-header-image').attr('src', "img/home-device-league.png");
	});

	$('#dota-button').click(function() {
		setCookie('channel', $(this).attr('data-game'));
		populateRows($(this).attr('data-game').toLowerCase());
		$('.game-name').text($(this).attr('data-game'));

		$(this).addClass('is-selected');
		$('#overwatch-button').removeClass('is-selected');
		$('#csgo-button').removeClass('is-selected');
		$('#lol-button').removeClass('is-selected');
		$('.game-header-image').attr('src', "img/home-device-dota2.png");
	});


	//var clipboard = new Clipboard('.im-button');
	//clipboard.on('success', function(e) {
	//	//console.log('Action:', e.action);
	//	//console.log('Text:', e.text);
	//	//console.log('Trigger:', e.trigger);
	//
	//	$('.overlay-title').text(e.text);
	//	$('.overlay-message').html('Copied to clipboard, redirecting to '+$(e.trigger).attr('data-im')+'<br><div class="loader-circle">Loading...</div>');
	//	$('.overlay-button').addClass('is-hidden');
	//	$('.overlay-alert').removeClass('is-hidden');
	//
	//	setTimeout(function() {
	//		$('.overlay-alert').addClass('is-hidden');
	//		$('.overlay-button').removeClass('is-hidden');
	//		if ($(e.trigger).attr('data-im').toLowerCase() == "kik") {
	//			openKik(e.text);
	//
	//		} else if ($(e.trigger).attr('data-im').toLowerCase() == "discord") {
	//			openDiscord(e.text);
	//
	//		} else if ($(e.trigger).attr('data-im').toLowerCase() == "twitch") {
	//			openTwitch(e.text);
	//
	//		} else if ($(e.trigger).attr('data-im').toLowerCase() == "facebook") {
	//			openFacebook(e.text);
	//		}
	//	}, 3000);
	//
	//	e.clearSelection();
	//});
	//
	//clipboard.on('error', function(e) {
	//	console.error('Action:', e.action);
	//	console.error('Trigger:', e.trigger);
	//});


	populateRows("overwatch");
});
