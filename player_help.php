<?php header("access-control-allow-origin: *");


// get out if no id
if (!isset($_GET['lid'])) {
	header("Location: http://gamebots.chat/");
}


// db creds
require_once ('./_db_consts.php');

// make the connection
$db_conn = mysql_connect(DB_HOST, DB_USER, DB_PASS) or die("Could not connect to database");

// select the proper db
mysql_select_db(DB_NAME) or die("Could not select database");
mysql_set_charset('utf8');


$query = 'SELECT `username`, `chat_id` FROM `kikbot_logs` WHERE `id` = '. $_GET['lid'] .' LIMIT 1;';
$result = mysql_query($query);

$log_obj = array();
if (mysql_num_rows($result) == 1) {
	$log_obj = mysql_fetch_object($result);

} else {
	header("Location: http://gamebots.chat/");
}


// connection open
if ($db_conn) {

	// so close it!
	mysql_close($db_conn);
	$db_conn = null;
}


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
	  <meta name="title" content="<?= ($log_obj->username); ?>">
	  <meta name="description" content="<?= ($log_obj->username); ?>">
    <meta name="author" content="MODD Website V.0.5.0">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>CHAT NOW</title>

	  <meta property="og:site_name" content="<?= ($log_obj->username); ?>">
	  <meta property="og:url" content="<?= (isset($_SERVER['HTTPS']) ? "https://" : "http://") . $_SERVER["HTTP_HOST"] . $_SERVER['REQUEST_URI'] ?>">
	  <meta property="og:title" content="<?= ($log_obj->username); ?>">
	  <meta property="og:description" content="<?= ($log_obj->username); ?>">
	  <meta property="og:image" content="https://i.imgur.com/avKU6FJ.jpg">

	  <!-- JS INCLUDES -->
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
	  <script type="text/javascript" src="http://cdn.kik.com/kik/2.3.6/kik.js"></script>
	  <link rel="kik-icon" href="http://i.imgur.com/RsjJ18M.png">
	  <style type="text/css">
	    html, body {
		    background-color: #000000;
				border: 0;
		    margin: 0;
		    overflow: hidden;
		    padding: 0;
				background-size: 100%;
				background-image: url("http://i.imgur.com/0Jbv3cf.png");
				background-size: cover;
	    }

			#loader {
				color:#fff;
				width:100%;
				text-align:center;
				line-height:300px;
				font-family: "Helvetica", Times, serif;
				font-size: 20px;
			}
	  </style>
		
		<script type="text/javascript">
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-83707103-1', 'auto');
		  ga('send', 'pageview');
			
			ga('send', {
			'hitType': 'event',
			'eventCategory': 'open',
			'eventAction': 'conversation',
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
  				action    : "<?= (md5($log_obj->username)); ?>",
  				label     : "<?= ($log_obj->username); ?>",
  				value     : "0",
  				cid       : "<?= (md5($log_obj->username)); ?>"
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
		  
			setTimeout(function() {
				kik.ready(function () {
					$('#loader').remove();

					if (kik.message) {
					//kik.openConversation('game.bots');
						kik.openConversation("<?= ($log_obj->username); ?>");

					} else {
						kik.send('<?= ($log_obj->username); ?>', {
							title     : '<?= ($log_obj->username); ?>',
							text      : 'CHAT NOW',
							pic       : 'http://i.imgur.com/rddWfbV.png',
							big       : true,
							noForward : true,
							data      : { passvar : 'open' }
						});
					}
				});
			}, 2000);
	  });
  </script>
		<div id="loader">Loading player...<br><img src="img/spinner.gif" width="50px" height="50px"></div>
  </body>
</html>
