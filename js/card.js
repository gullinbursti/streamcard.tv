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
  ga('send', {
    'hitType'     : 'event',
    'eventCategory' : 'user',
    'eventAction'   : 'share',
    'eventLabel'    : channel,
    'eventValue'    : 1
  });
  window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent("Check out "+channel+"'s Stream Card. scard.tv/channel/"+channel)+"&via=TeamMODD");
}

function topButton () {
  location.href = "/index.html";
}

function addCard() {
  location.href = "http://dashboard.modd.live";
}

function legal() {
  location.href = "/legal.html";
}

function openKik () {
  if (kik.enabled) {
    //kik.openConversation("streamcard");
    window.open("https://kik.me/streamcard", '_blank');

    //kik.send('streamcard', {
    //  title     : 'Streamcard Notifications',
    //  text      : channel,
    //  data      : {
    //    channel : channel
    //  }
    //});

  } else {
    alert("Open on Kik to signup");
  }
 
}

function openDiscord () {
  console.log("DISCORD");
  //location.href = "https://discord.gg/014do3goV6bJgwIf8";
  window.open("https://discord.gg/014do3goV6bJgwIf8", '_blank');
}

function openTwitch () {
  console.log("TWITCH");
  $.ajax({
    url: 'http://beta.modd.live/api/streamer_subscribe.php',
    type: 'GET',
    data: {
      type : 'whisper',
      channel : channel,
      username : authed_username
    },
    dataType: 'json',
    success: function(response) {
    }
  });
}

function openFacebook () {
  console.log("FACEBOOK");
  window.alert ("Coming soon");
}

function support () {
  ga('send', {
    'hitType'     : 'event',
    'eventCategory' : 'user',
    'eventAction'   : 'report',
    'eventLabel'    : channel,
    'eventValue'    : 1
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


function resizeCardPage() {
  var $twitchVideo = $('#twitch-video');

  // use the width of the video container to calculate the correct height of the video container
  var height = Math.floor(($twitchVideo.innerWidth() * 9) / 16);

  if (window.innerWidth > 600) {
    // video and chat are side by side
    $('#video-and-chat').css('height', height + 'px' );
    $('#twitch-video').css('height', '100%');
  } else {
    // video and chat are stacked.  each has it's own line
    $('#video-and-chat').css('height', 'auto');
    $('#twitch-video').css('height', height + 'px');
  }
}

function setupChatAnimationEvents() {
  // show the chat animation when the chat area scrolls into view
  $('.im-chat').one('inview', function(event, isInView){
    if (isInView) {
      $(this).addClass('reveal-chat');
    }
  });

  // add event hndlers to IM buttons to animate chat messages on mouseover
  var $imChat = $('.im-chat');
  var $imIcons = $('.im-icon');
  $imIcons
    .on('click', function(event){
      var $this = $(this);
      var service = $this.attr('data-im');

      console.log(service);
      // remove highlight from the previously selected tab
      $imIcons.filter('.is-selected').removeClass('is-selected');

      // highlight the new clicked tab
      $this.addClass('is-selected');

      // trigger the chat animation when mousing over an individual chat icon
      $imChat.removeClass('reveal-chat');
      setTimeout(function(){
        $imChat.addClass('reveal-chat');
      },250);
    });
}


var authed_username = "matty_devdev";

$(function(){
  // on document ready

  resizeCardPage();
  window.addEventListener('resize', resizeCardPage);

  setupChatAnimationEvents();

  $('#footer-copyright').html('&copy; '+(new Date()).getFullYear()+' Streamcard.tv');
});

