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
  $('.im-icons')
    .on('mouseover', '.im-icon', function(){
      $('.im-chat').removeClass('reveal-chat').addClass('reveal-chat');
    })
    .on('mouseout', '.im-icon', function(){
      $('.im-chat').removeClass('reveal-chat');
    });









});

