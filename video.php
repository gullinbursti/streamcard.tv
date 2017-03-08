<?php

$username = $_GET['username'];
$username_md5 = md5($_GET['username']);
$preview_image = $_GET['img'];
$youtube_id = $_GET['youtube_id'];
$video_title = $_GET['title'];

?>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
	<head>
		<!-- HEADER & INCLUDES -->
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta http-equiv="cache-control" content="max-age=0" />
		<meta http-equiv="cache-control" content="no-cache" />
		<meta http-equiv="expires" content="0" />
		<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
		<meta http-equiv="pragma" content="no-cache" />
		<meta name="title" content="<?= ($video_title); ?>">
		<meta name="description" content="<?= ($video_title); ?>">
		<meta name="author" content="">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<title><?= ($video_title); ?></title>

		<meta property="og:site_name" content="<?= ($video_title); ?>">
		<meta property="og:url" content="<?= (isset($_SERVER['HTTPS']) ? "https://" : "http://") . $_SERVER["HTTP_HOST"] . $_SERVER['REQUEST_URI'] ?>">
		<meta property="og:title" content="<?= ($video_title); ?>">
		<meta property="og:description" content="<?= ($video_title); ?>">
		<meta property="og:image" content="<?= ($preview_image); ?>">

		<!-- JS INCLUDES -->
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
		<script type="text/javascript" src="http://cdn.kik.com/kik/2.3.6/kik.js"></script>

		<style type="text/css">
			html, body {
				background-color: #000000;
				border: 0px;
				margin: 0px;
				overflow: hidden;
				padding: 0px;
				background-size: 100%;
				background-image: url("http://i.imgur.com/2qSUIPa.png");
				background-size: cover;
			}

			iframe
			{
				margin:0;
				padding:0;
				border:none;
				overflow:hidden;
				display: block;
				z-index:1000;
				width:300px;

			}

			#loader {
				color:#fff;
				width:100%;
				text-align:center;

				font-family: "Helvetica", Times, serif;
				font-size: 20px;
				z-index:10;
				position:absolute; top:100px; line-height:0px;
			}

			#video {
				position:absolute;
				top:200px;
				left:0px;
				z-index:0;
				width:100%;
				
			}


		</style>

		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-83707103-1', 'auto');
			ga('send', 'pageview');

			ga('send', {
				'hitType': 'event',
				'eventCategory': 'video',
				'eventAction': 'view',
				'eventLabel': '',
				'eventValue': 1
			});

			$.ajax({
				url       : "http://beta.modd.live/api/bot_tracker.php",
				method    : 'GET',
				dataType  : 'json',
				data      : {
					src       : "kik",
					category  : "click",
					action    : "<?= (md5($_GET['user'])); ?>",
					label     : "<?= ($_GET['user']); ?>",
					value     : "0",
					cid       : "<?= (md5($_GET['user'])); ?>"
				}
			}).then(null, function (jqXHR, textStatus, errorThrown) {
			}).always(function () {
			});

		</script>

	</head>

	<body>
		<script type="text/javascript">
			kik.metrics.enableGoogleAnalytics('UA-83707103-1', 'gamebots.chat', true);

			$(document).ready(function() {
				var video_url = "https://www.youtube.com/embed/"+"<?= ($youtube_id); ?>"+"?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=1";

				/*function adjust () {

					$(function(){
						$('#video').css({ width: $(window).innerWidth()  + 'px', height: $(window).innerHeight()  + 'px' });

						$(window).resize(function(){
							$('#video').css({ width: $(window).innerWidth() + 'px', height: $(window).innerHeight() + 'px' });
						});
					});

				}
					*/
					
					function adjust () {

						$(function(){
							$('#video').css({ width: $(window).innerWidth()  + 'px', height: '260'  + 'px' });

							$(window).resize(function(){
								$('#video').css({ width: $(window).innerWidth() + 'px', height: '260' + 'px' });
							});
						});

					}

				setTimeout(function(){
					$('#video').attr("src", video_url);
					$('#loader').remove();
					$('#loaded').show();
					adjust();
				}, 5000);
			});



		</script>
		<div id="loader">Loading Chat...<br>
			<img src="img/loader.gif" width="50px" height="50px" style="padding-top:30px;">

			<div style="padding-top:20px;">
				<img src="<?= ($profile_image); ?>" width="100" height="100" style="padding-bottom:20px;" /><br>
				<img src="<?= ($preview_image); ?>" width="320" height="180" />
		</div>

		</div>



		<iframe id="video" src="" frameborder="0" allowfullscreen></iframe>


		<div class="ads">
			<script type='text/javascript' src="//offers.appnext.com/widget/online/ver3/new/v3/frameManager.js"></script>
			<iframe style="border: 0;" src="//offers.appnext.com/widget/online/ver3/new/v3/index.html?cnt=500&cat=Arcade,Adventure,Card,Entertainment,Productivity&android_id=8a6448b3-7845-4b9a-a1a5-a81ece078996&ios_id=5c31003b-342f-4c7b-bde0-fe562c15cbb9&postback_parameters=&title=&btn_color=&btn_text=&btn_position=right" width="100%" height="100%" id='appnext_widget' onload="FrameManager.registerFrame(this)"></iframe>
		</div>
	</body>
</html>