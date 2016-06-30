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

function openMessenger(service) {
	channelName = getCookie('channel');

  ga('send', {
    'hitType'       : 'event',
    'eventCategory' : service,
    'eventAction'   : 'Open',
    'eventLabel'    : (twitch_auth.twitch_name != "") ? twitch_auth.twitch_name : channelName,
    'eventValue'    : 1
  });

  // $('.overlay-title').html('Opening ' + (channelName || service) + '&trade;');
  $('.overlay-title').html('Opening...');
  $('.overlay-message').addClass('narrow').html(
    renderOverlayImIcon(service, channelName)
  );
  $('.overlay-container').addClass('is-loading');
  $('.overlay-footer').html(
    '<div class="overlay-footer-item success-footer-item">Remember to enter "' + channelName + '"</div>'
  );
  $('.overlay-button').addClass('is-not-displayed');
  $('.overlay-alert').removeClass('is-hidden');

  setTimeout(function() {
    $('.overlay-alert').addClass('is-hidden');
    $('.overlay-button').removeClass('is-hidden');

    if (service.toLowerCase() == "kik") {
      openKik(channelName);

    } else if (service.toLowerCase() == "discord") {
      openDiscord(channelName);

    } else if (service.toLowerCase() == "twitch") {
      openTwitch(channelName);

    } else if (service.toLowerCase() == "facebook") {
      openFacebook(channelName);
    }
  }, 3000);

}

function openKik () {
  console.log("KIK - ["+isMobile()+"]["+kik.enabled+"]");

  if (isMobile()) {
    if (kik.enabled) {
      kik.openConversation("streamcard");

    } else {
      location.href = "card://" + location.hostname + "/open_kik.html";
      setTimeout(function () {
        location.href = "https://kik.me/streamcard";
      }, 5000);
    }

  } else {
    location.href = "https://kik.me/streamcard";
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
    twitchAuth(channelName);

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
        $('.overlay-footer').empty();
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
  location.href = "http://m.me/streamcardtv";
}

function twitchAuth(channelName) {
  setCookie('channel', channelName);

  // localhost redirect
  if (location.hostname == "localhost")
    location.href = "https://api.twitch.tv/kraken/oauth2/authorize?action=authorize&client_id=bdmreezjx7g0syk09kyzmkds978vrdj&login=&login_type=login&redirect_uri=http%3A%2F%2Flocalhost%2Fcard.html&response_type=token&scope=user_read+channel_subscriptions+chat_login&utf8=%E2%9C%93&force_verify=true";

  // live app redirect
  else {
    location.href = "https://api.twitch.tv/kraken/oauth2/authorize?action=authorize&client_id=kn6iwqzezy1kir29dvrleq4m0bf1t87&login=&login_type=login&redirect_uri=http%3A%2F%2Fgamebots.chat%2Fcard.html&response_type=token&scope=user_read+channel_subscriptions+chat_login&utf8=%E2%9C%93&force_verify=false";
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
    'hitType'     : 'event',
    'eventCategory' : 'user',
    'eventAction'   : 'share',
    'eventLabel'    : channel,
    'eventValue'    : 1
  });
  window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent("Check out "+channel+"'s Stream Card. p.00m.co/"+channel)+"&via=TeamMODD");
}

function support () {
  ga('send', {
    'hitType'     : 'event',
    'eventCategory' : 'user',
    'eventAction'   : 'report',
    'eventLabel'    : channel,
    'eventValue'    : 1
  });
}

function showInstantMessengersOverlay(featureBotName) {
  $('.overlay-title').text('Select a messenger');
  $('.overlay-message').html(
    renderOverlayImIcon('Kik', featureBotName) +
    renderOverlayImIcon('Discord', featureBotName) +
    renderOverlayImIcon('Twitch', featureBotName) +
    renderOverlayImIcon('Facebook', featureBotName)
  );
  $('.overlay-button').removeClass('is-hidden').text('Cancel');
  $('.overlay-alert').removeClass('is-hidden');
}



function registerTopFeatureBarButtonHandler() {
  $('.top-feature-bar').on('click', '.feature-button', function(event){
    var $button = $(event.target);
    var buttonText = $button.text();

    showInstantMessengersOverlay(buttonText);
  });
}




function resizer() {
  var height = Math.floor($('.header-wrapper').width() * 9 / 16);

  //$('.preview-video').css('height', height + 'px');
  $('.player-frame').attr('height', height);
  //$('#header-text').css('padding-top', (height - 30) + 'px');
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

  registerTopFeatureBarButtonHandler();

  $('#footer-copyright').html('&copy; '+(new Date()).getFullYear()+' GameBots™ <br> Trademarks & logos belong to their respective owners');
  
  // trigger an IM icon overlay if the user scrolls down enough to make the trigger div appear
  //  (uses jQuery "inview" plugin)
  $('#im-overlay-trigger-when-visible').one('inview', function(){
    //showInstantMessengersOverlay();
  });
});
