// GOOGLE ANALYTICS
(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-79705534-1', 'auto');
ga('send', 'pageview');



// CAPTURE STRING URL
function numberWithCommas(x) {
    return (x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}

var queryString = {};
window.location.href.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function($0, $1, $2, $3) {
        queryString[$1] = $3;
    }
);

// ASSIGN USER ID & REDIRECT TYPE, EXAMPLE ?t=76213712371723767128&t=h
var user = queryString['u'];
var type = queryString['t'];

function menu() {
    $('html,body').animate({
        scrollTop: 0
    }, 0);
    //$(".overlay-menu-bg").show();
    $(".overlay-menu").show();
    $(".main-action").hide();
    $(".main-tagline").hide();
    $(".video-player").hide();
    document.body.style['overflow-y'] = 'hidden';
    document.body.style['position'] = 'fixed';


}

ga('send', {
    'hitType': 'event',
    'eventCategory': 'Website',
    'eventAction': 'Load',
    'eventLabel': '',
    'eventValue': 2
});

function home() {
    var redirectWindow = window.open('index.html', '_self');

    $.ajax({
        type: 'POST',
        url: '/echo/json/',
        success: function(data) {
            redirectWindow.location;
        }
    });
}

function cancel() {
    $(".overlay-menu-bg").hide();
    $(".overlay-menu").hide();
    $(".overlay-menu-profile").hide();
    $(".overlay-menu-video").hide();
    document.body.style['overflow-y'] = 'scroll';
    document.body.style['position'] = '';
}

function remove() {
    $(".overlay-menu-bg").hide();
    $(".overlay-menu").hide();
    $(".overlay-video-rewards").hide();
    $(".overlay-video-intro").hide();
    $(".profileBot").hide();
    $(".videoBot").hide();
    document.body.style['overflow-y'] = 'scroll';
    document.body.style['position'] = '';
    //location.reload();
}

function removeVideo() {
    $(".overlay-menu-bg").hide();
    $(".overlay-menu").hide();
    $(".overlay-video-rewards").hide();
    $(".overlay-video-intro").hide();
    document.body.style['overflow-y'] = 'scroll';
    document.body.style['position'] = '';
    //location.reload();
}

function kik() {

    ga('send', {
        'hitType': 'event',
        'eventCategory': 'Website',
        'eventAction': 'Kik',
        'eventLabel': '',
        'eventValue': 1
    });

    $(".overlay-menu-bg").hide();
    $(".overlay-menu").hide();
    $(".overlay-video-rewards").hide();
    $(".overlay-video-intro").hide();

    var redirectWindow = window.open('http://www.kik.me/game.bots', '_blank');



    $.ajax({
        type: 'POST',
        url: '/echo/json/',
        success: function(data) {
            redirectWindow.location;
        }
    });


    document.body.style['overflow-y'] = 'scroll';
    document.body.style['position'] = '';


}


function changelog() {

    ga('send', {
        'hitType': 'event',
        'eventCategory': 'Website',
        'eventAction': 'Change-log',
        'eventLabel': '',
        'eventValue': 1
    });

    $(".overlay-menu-bg").hide();
    $(".overlay-menu").hide();
    $(".overlay-video-rewards").hide();
    $(".overlay-video-intro").hide();

    var redirectWindow = window.open('https://medium.com/p/de60b345642c', '_blank');



    $.ajax({
        type: 'POST',
        url: '/echo/json/',
        success: function(data) {
            redirectWindow.location;
        }
    });


    document.body.style['overflow-y'] = 'scroll';
    document.body.style['position'] = '';


}



function fb() {

    ga('send', {
        'hitType': 'event',
        'eventCategory': 'Website',
        'eventAction': 'Facebook',
        'eventLabel': '',
        'eventValue': 2
    });

    var redirectWindow = window.open('http://m.me/gamebotsc', '_blank');

    $.ajax({
        type: 'POST',
        url: '/echo/json/',
        success: function(data) {
            redirectWindow.location;
        }
    });


    $(".overlay-menu-bg").hide();
    $(".overlay-menu").hide();
    $(".overlay-video-rewards").hide();
    $(".overlay-video-intro").hide();

    document.body.style['overflow-y'] = 'scroll';
    document.body.style['position'] = '';
}

function support() {
    window.location.href = "mailto:user@example.com?subject=Subject&body=message%20goes%20here";
    $(".overlay-menu-bg").hide();
    $(".overlay-menu").hide();
    $(".overlay-video-rewards").hide();
    $(".overlay-video-intro").hide();
}

function terms() {
    location.href = "terms.html";
    $(".overlay-menu-bg").hide();
    $(".overlay-menu").hide();
    $(".overlay-video-rewards").hide();
    $(".overlay-video-intro").hide();
}

function videointro() {
    $('html,body').animate({
        scrollTop: 0
    }, 0);
    document.body.style['overflow-y'] = 'scroll';
    document.body.style['position'] = 'fixed';
    $(".overlay-menu-bg").show();
    $(".overlay-video-intro").show();

}

function videorewards() {
    $('html,body').animate({
        scrollTop: 0
    }, 0);
    $(".overlay-menu-bg").show();
    $(".overlay-video-rewards").show();
    document.body.style['overflow-y'] = 'hidden';
}


$(document).ready(function () {
	$.ajax({
		type: 'POST',
		url: 'http://beta.modd.live/api/kikbot_total.php',
		data : {
			type : "users"
		},
		success: function (data) {
			$('.total').text(numberWithCommas(data));
		}
	});
});