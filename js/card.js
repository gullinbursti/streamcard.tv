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
	alert ("share");
}

function topButton () {
	alert ("top");
}

$(function(){
  // on document ready

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










});

