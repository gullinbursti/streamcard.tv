// GOOGLE ANALYTICS
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-79705534-1', 'auto');
ga('send', 'pageview');

// CAPTURE STRING URL
function numberWithCommas(x) {
    return (x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
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


var queryString = {};
window.location.href.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function($0, $1, $2, $3) {
        queryString[$1] = $3;
    }
);

// ASSIGN USER ID & REDIRECT TYPE, EXAMPLE ?t=76213712371723767128&t=h
var type = (typeof queryString['t'] != "undefined") ? queryString['t'] : "";
var fromUser = (typeof queryString['u'] != "undefined") ? queryString['u'] : "";
var toUser = (typeof queryString['r'] != "undefined") ? queryString['r'] : "";
var youtubeID = (typeof queryString['y'] != "undefined") ? queryString['y'] : "";
var itemName = (typeof queryString['i'] != "undefined") ? queryString['i'] : "";

if (fromUser != "") {
  setCookie('kik_name', fromUser);

} else {
	fromUser = getCookie('kik_name');
}

function cancel() {
	kik();

//  var redirectWindow = window.open('http://www.kik.me/game.bots', '_self');
//
//  $.ajax({
//      type: 'POST',
//      url: '/echo/json/',
//      success: function (data) {
//          redirectWindow.location;
//      }
//  });
}

function kik() {
	$(".overlay-menu-bg").hide();
	$(".overlay-menu").hide();
	$(".overlay-video").hide();

	if (kik.enabled) {
		kik.send('game.bots', {
			title     : 'CHAT NOW',
			text      : 'CHAT NOW',
			pic       : 'http://cdn.kik.com/user/pic/game.bots',
			big       : true,
			noForward : false,
			data      : {
				id : 'Open'
			}
		});

	} else {
	  var redirectWindow = window.open('http://www.kik.me/game.bots', '_self');
	  $.ajax({
	      type: 'POST',
	      url: '/echo/json/',
	      success: function (data) {
	          redirectWindow.location;
	      }
	  });
	}
}

function success() {
	 $(".loader-item").hide();
	 document.getElementById("steam").innerHTML="Success! One moment...";

	 setTimeout (kik, 1000);
}

function fail() {
	 $(".loader-item").hide();
	 document.getElementById("steam").innerHTML="Authentication Failed. Please try again.";
}

function steamRedirect() {
  var redirectWindow = window.open('http://gamebots.chat/steam_auth.php?login', '_self');
	
  $.ajax({
      type: 'POST',
      url: '/echo/json/',
      success: function (data) {
          redirectWindow.location;
      }
  });
}

function steamBot() {
	$('html,body').animate({scrollTop:0}, 0);
	$(".profile-image").attr('src', "http://cdn.kik.com/user/pic/" + fromUser);
	$(".overlay-menu-bg").show();
	$(".overlay-menu-steam").show();
	document.body.style['overflow-y'] = 'hidden';

	$.ajax({
		type: 'GET',
		url: 'http://beta.modd.live/api/bot_tracker.php',
		data: {
			src: "kik",
			category: "steam-button",
			//action: CryptoJS.MD5(user).toString(),
			action: "steam-button",
			label: fromUser,
			value: "0"
		},
		success: function (data) {}
	});

	if (typeof queryString['a'] != "undefined") {
		$.ajax({
			type: 'POST',
			url: 'steam_api.php',
			data : {
				kik_name : getCookie('kik_name'),
				steam_id : queryString['a']
			},
			success: function (data) {
				success();
			}
		});

	} else {
		setTimeout (steamRedirect, 5000);
	}
}

function profileBot () {
	$('html,body').animate({scrollTop:0}, 0);
	$(".profile-image").attr('src', "http://cdn.kik.com/user/pic/" + toUser);
	$(".overlay-menu-bg").show();
	$(".overlay-menu-profile").show();
	document.body.style['overflow-y'] = 'hidden';

//	$(".main-action").text("KIK:"+kik.enabled);
	if (kik.enabled) {
		kik.send(toUser, {
			title: fromUser,
			text: 'CHAT NOW',
			pic: 'http://cdn.kik.com/user/pic/' + fromUser,
			big: true,
			noForward: false,
			data: {
				id: 'Open'
			}
		});

	} else {
		setTimeout(function(){location.href="http://kik.me/" + toUser} , 5000);
	}
}

function videoBot () {
	$('html,body').animate({scrollTop:0}, 0);
	$(".game-name").text(queryString['g']);
	$(".game-level").text(queryString['l']);
	$(".overlay-menu-bg").show();
	$(".overlay-menu-video").show();
	$(".video-frame").attr('src', "https://www.youtube.com/embed/"+youtubeID+"?rel=0&controls=0&showinfo=0");
	document.body.style['overflow-y'] = 'hidden';
}

function twitterBot() {
  $('html,body').animate({scrollTop:0}, 0);
  $(".overlay-menu-bg").show();


	$.ajax({
		type: 'GET',
		url: 'http://beta.modd.live/api/bot_tracker.php',
		data: {
			src: "kik",
			category: "twitter-button",
			//action: CryptoJS.MD5(user).toString(),
			action: "twitter-button",
			label: fromUser,
			value: "0"
		},
		success: function (data) {
			//location.href = "twitter://post?message="+fromUser+"%20just%20won%20an%20item%20on%20Gamebots!%20Want%20to%20win?\r\n1.%20Retweet%20this\r\n2.%20Install%20Gamebots%20taps.io%2FBj1og\r\n3.%20Follow%20%40gamebotsc";
			location.href="https://twitter.com/intent/tweet?text="+fromUser+"%20just%20won%20an%20item%20on%20Gamebots!%20Want%20to%20win?%0A1.%20Retweet%20this%0A2.%20Install%20Gamebots%20taps.io%2FBj1og%0A3.%20Follow%20%40gamebotsc";
			//kik.open("twitter://post?message="+fromUser+"%20just%20won%20an%20item%20on%20Gamebots!%20Want%20to%20win?\r\n1.%20Retweet%20this\r\n2.%20Install%20Gamebots%20taps.io%2FBj1og\r\n3.%20Follow%20%40gamebotsc");
			//kik.open("http://taps.io/Bj1_g");

//			var redirectWindow = window.open('http://www.kik.me/game.bots', '_blank');
//			$.ajax({
//				type: 'POST',
//				url: '/echo/json/',
//				success: function (data) {
//					redirectWindow.location;
//				}
//			});
		}
	});
}

function stripeBot() {
	$('html,body').animate({scrollTop:0}, 0);
	$(".overlay-menu-bg").show();
	$(".stripe-form").show();
}


$(document).ready(function () {
//	kik.ready(function () {
//		$(".main-action").text("KIK:"+kik.enabled);
//	});

	if (type == "p") {
		setTimeout(profileBot, 2);

	} else if (type == "v") {
		setTimeout(videoBot, 2);

	} else if (type == "s") {
		setTimeout(steamBot, 2);
		
	} else if (type == "t") {
		setTimeout(twitterBot, 2);

	} else if (type == "c") {
		setTimeout(stripeBot, 2);

	} else {
//		var redirectWindow = window.open('http://www.gamebots.chat', '_self');
//		$.ajax({
//			type    : 'POST',
//			url     : '/echo/json/',
//			success : function (data) {
//				redirectWindow.location;
//			}
//		});
//	}


		$(".main-action").click(function () {
			if (kik.enabled) {
				kik.send(toUser, {
					title     : fromUser,
					text      : 'CHAT NOW',
					pic       : 'http://cdn.kik.com/user/pic/' + fromUser,
					big       : true,
					noForward : false,
					data      : {
						id : 'Open'
					}
				});

			} else {
				var redirectWindow = window.open('http://www.kik.me/game.bots', '_self');
				$.ajax({
					type    : 'POST',
					url     : '/echo/json/',
					success : function (data) {
						redirectWindow.location;
					}
				});
			}
		});
	}
});