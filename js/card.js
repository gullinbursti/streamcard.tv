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
		'hitType'			: 'event',
		'eventCategory'	: 'user',
		'eventAction'		: 'share',
		'eventLabel'		: channel,
		'eventValue'		: 1
	});
	window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent("Check out "+channel+"'s Stream Card. p.00m.co/"+channel)+"&via=TeamMODD");
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
    .on('mouseover', function(event){
      // trigger the chat animation when mousing over an individual chat icon
      $imChat.addClass('reveal-chat');
    })
    .on('mouseout', function(event){
      // reset for chat animation when mousing out of an individual chat icon
      $imChat.removeClass('reveal-chat');
    });

  // add events to the container of the im chat icons so the chat list animates when chat is visible when the mouse is totally
  //  outside the chat icons container.
  $('.im-icons')
    .on('mouseout', function(event){
      // in the final mouseout of the im icons container, put the reveal-chat class back after all 
      //  threads exit so that the chat is still visible when the mouse is no longer in the im icons container.
      setTimeout(function(){
        $imChat.addClass('reveal-chat');
      }, 0);
    })
    .get(0).addEventListener('mouseover', function(event){
      // remove the reveal-chat class in the event capture phase, so that mousing over the im icons re-triggers the animation
      $imChat.removeClass('reveal-chat');
    }, true);

}

$(function(){
  // on document ready

  resizeCardPage();
  window.addEventListener('resize', resizeCardPage);

  setupChatAnimationEvents();

  $('#footer-copyright').html('&copy; '+(new Date()).getFullYear()+' Streamcard.tv');
});

