
function isEmail(email) {
	var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return (regex.test(email));
}

function numberWithCommas(x) {
	return (x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}

function truncate(val, amt) {
	return ((val.length > amt) ? (val.substring(0, amt - 1) + "…") : (val));
}


function getCookie(key) {
	var val = "";

	var cookies = document.cookie.split(';');
	for (var i=0; i<cookies.length; i++) {
		var c = cookies[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1);

		if (c.indexOf(key) != -1) {
			val = c.split("=")[1];
			break;
		}
	}

	return (val);
}

function setCookie(key, val) {
	var d = new Date();
	d.setDate(d.getDate() + 365);
	document.cookie = key+"="+val+"; expires="+d.toUTCString();
}

function deleteCookie(key) {
	document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}



function populate() {
	$.ajax({
		url: 'http://beta.modd.live/api/ad_view.php',
		type: 'GET',
		data: { channel: channel },
		dataType: 'json',
		success: function (response) {
			// console.log(response);
		}
	});

	$('.channel-link').click(function() {
		window.open("https://www.twitch.tv/" + channel);
	});

	statsUpdater(channel);
	streamRank(channel);
	//setInterval(function () {
	//	statsUpdater(channel);
	//}, 3333);
}

function statsUpdater(channelName) {
	// console.log("--statsUpdater-- "+channelName);

	$.ajax({
		url: 'http://beta.modd.live/api/stream_card.php',
		type: 'GET',
		data: { channel : channelName },
		dataType: 'json',
		success: function(response) {
			$('.card-rank-value').text(response.rank);

			//if (response.rank < 100)
			//	$('.card-badge').show();

			if ($('.creator-name').text() == "")
				$('.creator-name').text(response.creator);

			$('.creator-link').click(function() {
				window.open("https://www.twitch.tv/"+response.creator);
			});

			var price = Math.max(Math.ceil(response.views * 0.00001) - 0.01, 0.99);
			$('.card-value').text('$'+price);
			$('#paypal-price').attr('value', paypalButtons[price]);
		}
	});

	$.ajax({
		url: 'https://api.twitch.tv/kraken/channels/' + channelName,
		beforeSend: function (request) {
			request.setRequestHeader("Accept", "application/vnd.twitchtv.v3+json");
		},
		dataType: 'json',
		success: function (response) {
			channel_id = response._id;
			document.title = response.display_name;
			$('.channel-name').text(response.display_name);
			$('.avatar-image').attr('src', (response.logo) ? response.logo : "http://i.imgur.com/o8KEq67.jpg");
			$('.channel-status').text(response.status);
			$('.channel-views').text(numberWithCommas(response.views));

			if ($('.chat-frame').attr('src') == "")
				$('.chat-frame').attr('src', "https://www.nightdev.com/hosted/obschat/?channel="+channelName+"&fade=false&bot_activity=false&prevent_clipping=false");

			if (followers.init == 0)
				followers.init = response.followers;

			followers.curr = response.followers;
			followers.max = (followers.curr > followers.max) ? followers.curr : followers.max;
			if (followers.last != followers.curr && $.inArray(followers.curr, followers.prev) == -1) {
				followers.prev.push(followers.curr);
				$('.followers-value').text(numberWithCommas(followers.curr));
				//$('.followers-arrow').html((followers.curr > followers.last) ? '<i class="fa fa-arrow-up" aria-hidden="true"></i>' : (followers.curr < followers.last) ? '<i class="fa fa-arrow-down" aria-hidden="true"></i>' : '');
			}

			followers.last = followers.curr;
		}
	});

	$.ajax({
		url: 'https://api.twitch.tv/kraken/streams/' + channelName,
		beforeSend: function (request) {
			request.setRequestHeader("Accept", "application/vnd.twitchtv.v3+json");
		},
		dataType: 'json',
		success: function (response) {

			var isOnline = (response.stream != null);
			if (isOnline) {

				if ($('.player-frame').attr('src') == "") {
					$('.player-frame').attr('src', 'http://player.twitch.tv/?channel=' + channel);
					setTimeout(function () {
						$('.preview-image').hide();
					}, 5000);
				}

				$('.preview-image').attr('src', response.stream.preview.medium);
				$('.game-name').text(response.stream.game);


				$('.game-name').click(function() {
					window.open("https://www.twitch.tv/directory/game/"+encodeURIComponent(response.stream.game));
				});

				$('.game-link').click(function() {
					window.open("https://www.twitch.tv/directory/game/"+encodeURIComponent(response.stream.game));
				});


				$('.header-game').click(function() {
					window.open("https://www.twitch.tv/directory/game/"+encodeURIComponent(response.stream.game));
				});


				$('.chart-empty').hide();
				$('#chart').show();

				/*if ($('.player-frame').attr('src').length == 0)
				 $('.player-frame').attr('src', 'https://player.twitch.tv/?channel='+channelName+'&autostart=1');
				 $('.online-led').css('color', '#6a8767');
				 $('.overlay-player-core-bg').css('background', 'url('+ response.stream.preview.large +')');
				 */

				if (viewers.init == 0) {
					viewers.init = response.stream.viewers;
					viewers.last = viewers.init;
					viewers.prev.push(0);
					viewers.prev.push(viewers.init);
				}

				viewers.curr = parseInt(response.stream.viewers);
				viewers.max = parseInt((viewers.curr > viewers.max) ? viewers.curr : viewers.max);
				viewers.perc = parseInt((((viewers.curr - viewers.init) / viewers.init) * 100));
				$('.viewers-percentage').text(numberWithCommas(((viewers.perc < 0) ? "-" : "+")+Math.abs(viewers.perc)) + "%");
				$('.chart-value-percent').text(numberWithCommas(Math.abs(viewers.perc)) + "%");
				$('.viewers-value').text(numberWithCommas(viewers.curr));
				$('.viewers-arrow').html((viewers.curr > viewers.last) ? '<i class="fa fa-arrow-up" aria-hidden="true"></i>' : (viewers.curr < viewers.last) ? '<i class="fa fa-arrow-down" aria-hidden="true"></i>' : '<i class="fa fa-arrow-up" aria-hidden="true"></i>');

				if (viewers.last != viewers.curr && $.inArray(viewers.curr, viewers.prev) == -1) {
					viewers.prev.push(viewers.curr);
				}

				//updateGraph();

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
						console.log("GAME: "+response._links.self);
						if (response.games.length > 0) {
							$('.game-image').attr('src', response.games[0].box.medium);
						}
					}
				});

				viewers.last = viewers.curr;

			} else {
				$('.preview-image').attr('src', "https://static-cdn.jtvnw.net/ttv-static/404_preview-320x180.jpg");

				$('.online-led').css('color', '#cccccc');
				$('.header-percent').show();
				$('.overlay-avatar').show();
				$('.overlay-live-player').hide();

				$('.chart-empty').show();
				$('#chart').hide();


				$.ajax({
					url: 'http://beta.modd.live/api/last_session.php',
					data : { channel : channelName },
					dataType: 'json',
					success: function (response) {
						$('.game-name').text(response.game);
						$('.viewers-value').text(numberWithCommas(response.viewers));

						$('.game-link').click(function() {
							window.open("https://www.twitch.tv/directory/game/"+encodeURIComponent(response.stream.game));
						});

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
								if (response.games.length > 0) {
									$('.game-image').attr('src', response.games[0].box.medium);
								}
							}
						});

					}
				});
			}


			if ($('.highlight-1').attr('src') == "") {
				$.ajax({
					url: 'https://api.twitch.tv/kraken/channels/' + channelName + '/videos',
					beforeSend: function (request) {
						request.setRequestHeader("Accept", "application/vnd.twitchtv.v3+json");
					},
					dataType: 'json',
					success: function (response) {
						var cnt = 0;
						var videos = [];
						$.each(response.videos, function (i, item) {
							if (++cnt <= 1) {
								videos.push({
									title: item.title,
									description: item.description,
									broadcast_id: item.broadcast_id,
									created_at: item.created_at,
									video_id: item._id,
									preview: item.preview
								});
							}
						});

						if (isOnline) {
						} else {
							if ($('.player-frame').attr('src') == "") {
								$('.player-frame').attr('src', 'http://player.twitch.tv/?video=' + videos[0].video_id);
								setTimeout(function () {
									$('.preview-image').hide();
								}, 5000);
							}
						}
					}
				});
			}
		}
	});

	$.ajax({
		url: 'http://beta.modd.live/api/chatters.php',
		data: { username : channelName.toLowerCase() },
		dataType: 'json',
		success: function(response) {
			var tot = 0;
			if (response.chatters.staff)
				tot += response.chatters.staff.length;

			if (response.chatters.moderators)
				tot += response.chatters.moderators.length;

			if (response.chatters.admins)
				tot += response.chatters.admins.length;

			if (response.chatters.gobal_mods)
				tot += response.chatters.gobal_mods.length;

			if (response.chatters.viewers)
				tot += response.chatters.viewers.length;

			$('.stream-chatters').text(numberWithCommas(tot));
		}
	});

	$.ajax({
		url: 'http://159.203.220.30:8888/cohort',//'http://159.203.220.30:8888/retention',
		type: 'GET',
		data: {
			date : "2016-04-01",
			streamer : channelName
		},
		dataType: 'json',
		success: function(response) {
			if (response && response.cohort && response.cohort.length > 0) {
				var reten = response.cohort;
				retention.init = reten.shift().percent;
				retention.curr = reten.pop().percent;
				retention.last = reten.pop().percent;
				retention.perc = (retention.curr - retention.last) / retention.last;

				$('.retention-value').text((retention.curr * 100).toFixed(2)+'%');
				$('.retention-percent').text(Math.round(Math.abs(retention.perc) * 100)+'%');
				$('.retention-arrow').html((retention.curr > retention.last) ? '<i class="fa fa-arrow-up" aria-hidden="true"></i>' : (retention.curr < retention.last) ? '<i class="fa fa-arrow-down" aria-hidden="true"></i>' : '');
			}
		}
	});

	$.ajax({
		url: 'https://api.twitch.tv/kraken/channels/'+channelName+'/teams',
		beforeSend: function (request) {
			request.setRequestHeader("Accept", "application/vnd.twitchtv.v3+json");
		},
		dataType: 'json',
		success: function (response) {

			if (response.teams.length > 0) {
				$('.team-name').text(response.teams[0].name);
				$('.team-image').attr('src', (response.teams[0].logo) ? response.teams[0].logo : "http://i.imgur.com/o8KEq67.jpg");
				if ($('.team-val').text() == "")
					$('.team-val').text(Math.floor(Math.random() * 500) + 50);

				$('.team-image').click(function () {
					window.open("https://www.twitch.tv/team/" + encodeURIComponent(response.teams[0].name));
				});

				$('.team-link').click(function () {
					window.open("https://www.twitch.tv/team/" + encodeURIComponent(response.teams[0].name));
				});

				$('.team-name-vs').html((response.teams[1]) ? response.teams[1].name : "&nbsp;");
				$('.team-image-vs').attr('src', (response.teams[1]) ? response.teams[1].logo : "http://i.imgur.com/o8KEq67.jpg");
				if ($('.team-val-vs').text() == "")
					$('.team-val-vs').text(Math.floor(Math.random() * 500) + 50);

				$('.team-image-vs').click(function () {
					window.open("https://www.twitch.tv/team/" + encodeURIComponent(response.teams[1].name));
				});

				$('.team-link-vs').click(function () {
					window.open("https://www.twitch.tv/team/" + encodeURIComponent(response.teams[1].name));
				});

			} else {
				$('.team-name').text('N/A');
				$('.team-image').attr('src', "http://i.imgur.com/o8KEq67.jpg");
			}
		}
	});
}

function streamRank(channelName) {
	var streamPosition = 1;
	var rankLimit = 5000;
	(function streamRank (name, offset) {
		// console.log("--streamRank-- "+streamPosition);
		$.ajax({
			url: 'https://api.twitch.tv/kraken/streams?limit=100&offset='+offset,
			beforeSend: function (request) {
				request.setRequestHeader("Accept", "application/vnd.twitchtv.v3+json");
			},
			dataType: 'json',
			success: function(response) {
				var isFound = false;
				$.each(response.streams, function(i, item) {
					if (item.channel.name == name.toLowerCase()) {
						isFound = true;
						streamPosition += i;
					}
				});

				if (!isFound && streamPosition < rankLimit) {
					streamPosition += 100;
					streamRank(name, offset + 100);

				} else {
					if (twitchRank.init == 0) {
						twitchRank.init = (streamPosition > rankLimit) ? rankLimit : streamPosition;
						twitchRank.last = twitchRank.init;
					}

					twitchRank.curr = (streamPosition > rankLimit) ? rankLimit : streamPosition;
					twitchRank.max = (twitchRank.curr < twitchRank.max) ? twitchRank.curr : twitchRank.max;

					$('.twitch-rank-value').text(((twitchRank.curr >= rankLimit) ? "+" : "")+twitchRank.curr);
					//$('.twitch-rank-arrow').html((twitchRank.curr > twitchRank.last) ? '<i class="fa fa-arrow-up" aria-hidden="true"></i>' : (twitchRank.curr < twitchRank.last) ? '<i class="fa fa-arrow-down" aria-hidden="true"></i>' : '');

					if (twitchRank.last != twitchRank.curr && $.inArray(twitchRank.curr, twitchRank.prev) == -1) {
						twitchRank.prev.push(twitchRank.curr);
					}

					twitchRank.last = twitchRank.curr;
				}
			}
		});
	})(channelName, 0);
}

function updateGraph() {
	var i;
	var canvas = document.getElementById("chart");
	var ctx = canvas.getContext("2d");
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

	var topVal = (viewers.max < 100) ? Math.floor(viewers.max * 2) : Math.floor(viewers.max * 1.5);
	// console.log("--updateGraph--\n("+viewers.max+","+topVal+")");

	var availHeight = canvas.height - 35;
	var ratio = (availHeight / topVal);

	ctx.strokeStyle="#a0a0a0";
	ctx.beginPath();

	ctx.moveTo(0, canvas.height);
	ctx.lineTo(0, canvas.height - (viewers.prev[0] * ratio));
	for (i=1; i<viewers.prev.length; i++) {
		ctx.lineTo(i * (canvas.width / viewers.prev.length), canvas.height - (viewers.prev[i] * ratio));
	}

	ctx.lineTo(canvas.width, canvas.height - (viewers.prev[viewers.prev.length - 1] * ratio));
	ctx.lineTo(canvas.width, canvas.height);
	ctx.fillStyle = "#a0a0a0";
	ctx.fill();
	ctx.closePath();
	ctx.stroke();

	ctx.font ="14px Lato";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("0", 10, canvas.height - 10);
	ctx.fillText(numberWithCommas(Math.floor(topVal * 0.5)), 10, (canvas.height * 0.5) + 10.0);
	ctx.fillText(numberWithCommas(topVal), 10, 25);
	ctx.fillText("", (canvas.width - 110) * 0.5, 25);
}

function validateForm() {
	// error background-color: #ffb0b0
	// processing eee

	$.ajax({
		url: 'http://beta.modd.live/api/submit_notify.php',
		type: "POST",
		data: {
			channel_id: channel_id,
			channel_name: channel,
			viewer_id: "",
			viewer_name: ($('.twitch-text').val().length > 0) ? $('.twitch-text').val() : "",
			viewer_email: ($('.email-text').val().length > 0) ? $('.email-text').val() : "",
			action: "insert"
		},
		dataType: 'json',
		success: function (response) {
			$.ajax({
				url: 'http://beta.modd.live/api/submit_notify.php',
				type: "POST",
				data: {
					id: response.id,
					sms: "",
					kik: ($('.kik-text').val().length > 0) ? $('.kik-text').val() : "",
					discord: ($('.discord-text').val().length > 0) ? $('.discord-text').val() : "",
					snapchat: ($('.snapchat-text').val().length > 0) ? $('.snapchat-text').val() : "",
					action: "update"
				},
				dataType: 'json',
				success: function (response) {
					$('.email-text').val('');
					$('.twitch-text').val('');
					$('.kik-text').val('');
					$('.discord-text').val('');
					$('.snapchat-text').val('');

					$('.email-pass').hide();
					$('.email-fail').hide();
					$('.twitch-pass').hide();
					$('.twitch-fail').hide();
					$('.kik-pass').hide();
					$('.kik-fail').hide();
					$('.discord-pass').hide();
					$('.discord-fail').hide();
					$('.snapchat-pass').hide();
					$('.snapchat-fail').hide();

					$('.email-wrapper').css('background-color', '#ffffff');
					$('.twitch-wrapper').css('background-color', '#ffffff');
					$('.kik-wrapper').css('background-color', '#ffffff');
					$('.discord-wrapper').css('background-color', '#ffffff');
					$('.snapchat-wrapper').css('background-color', '#ffffff');

					$('.signup').hide();
					$('.paypal').show();

					setCookie('signup', "1");
				}
			});
		}
	});
}

function submitGiveaway() {
	$('.giveaway-email').fadeOut("fast", function() {
	});
}

function resizer() {
	var height = Math.floor((window.innerWidth * 9) / 16);

	if ($(window).width() < 600) {
		$('.index-background').css('top', 0);
		$('.preview-video').css('height', height + 'px');
		$('.player-frame').attr('height', height);
		$('.giveaway-wrapper').css('top', Math.floor(height * 0.79) + 'px');
		$('.video-clipper').css('top', Math.floor(height * 0.79) + 'px');
		$('.app-wrapper').css('top', (450 + Math.floor(height * 0.79)) + 'px');

	} else {
		$('.preview-video').css('height', height + 'px');
		$('.player-frame').attr('height', height);
		$('.giveaway-wrapper').css('top', Math.floor(height * 0.66) + 'px');
		$('.video-clipper').css('top', Math.floor(height * 0.66) + 'px');
		$('.app-wrapper').css('top', (450 + Math.floor(height * 0.66)) + 'px');
	}
}





var twitchRank = {
	init : 0,
	last : 0,
	curr : 0,
	max  : 0,
	perc : 0,
	prev : []
};

var viewers = {
	init : 0,
	last : 0,
	curr : 0,
	max  : 0,
	perc : 0,
	prev : []
};

var followers = {
	init : 0,
	last : 0,
	curr : 0,
	max  : 0,
	prev : []
};

var retention = {
	init : 0,
	last : 0,
	curr : 0,
	max  : 0,
	prev : []
};

var paypalButtons = {
	'0.99' : "8M5WB853Z3M64",
	'1.99' : "P5MRFZYKEWHJE",
	'2.99' : "A9JKRH5VZDK76",
	'3.99' : "D4XGA3TUDU3Q2",
	'4.99' : "748JYS3SEKEPS",
	'5.99' : "XJSDCVSB3ATJ6",
	'6.99' : "QMQFYR996XSZQ",
	'7.99' : "FQFEA5UXU6JE2",
	'8.99' : "NFJ7TBFS2QB54",
	'9.99' : "Z4CTCXH8E4BV8",
	'10.99' : "35FLB7WFRCJNN",
	'11.99' : "2EHXXWMWN9CXQ",
	'12.99' : "VXKT33S3AU45U",
	'13.99' : "KHTK6LXDJLR3G",
	'14.99' : "CBJLYUW54BJY8",
	'15.99' : "GJYMU2JN5KJP6",
	'16.99' : "DFLTSBGVXEJKG",
	'17.99' : "YN99LA6ZN52QL",
	'18.99' : "JV8SS7ABCBNZS",
	'19.99' : "GVMSQSKZHPANW"
};


var queryString = {};
window.location.href.replace(
	new RegExp("([^?=&]+)(=([^&]*))?", "g"),
	function($0, $1, $2, $3) { queryString[$1] = $3; }
);

var channel = "";
var channel_id = "";

$(document).ready(function() {
	$('.highlight-wrapper-mobile').hide();
	$('.chat-wrapper-mobile').hide();

	deleteCookie('player');

	if (getCookie('card') != "") {
		var channelName = getCookie('card');
		deleteCookie('card');
		location.href = "/player.html?channel="+channelName;
	}

	if (typeof queryString['paypal'] != 'undefined') {
		if (queryString['paypal'] == "1") {
			setCookie('paypal', "1");
			$('.paypal').hide();
			$('data.').show();
		}
	}

	if (typeof queryString['channel'] != 'undefined') {
		channel = queryString['channel'];

		populate();

	} else {
		$.ajax({
			url: 'http://beta.modd.live/api/top_streamer.php',
			type: 'GET',
			dataType: 'json',
			success: function (response) {
				var paypal = queryString['paypal'];
				if (paypal == "1") {
				} else {
				}

				channel = response.channel;
				populate();
			}
		});
	}


	resizer();
	window.addEventListener('resize', function(event){
		resizer();
	});

	$('.buy-button').click(function() {
		setCookie('card', channel);
		$('.paypal-form').submit();
	});


	$('.card-rank_percent').text((Math.floor(Math.random() * 5) + 1) + '%');
	$('.card-value-percent').text((Math.floor(Math.random() * 5) + 1) + '%');

	$('.footer-copyright').html('&copy; '+(new Date()).getFullYear()+' MODD Inc.');
});

