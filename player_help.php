<?php header("access-control-allow-origin: *");


if (!isset($_GET['sid'])) {
	header("Location: http://gamebots.chat/");
}


// db creds
require_once ('./_db_consts.php');

// make the connection
$db_conn = mysql_connect(DB_HOST, DB_USER, DB_PASS) or die("Could not connect to database");

// select the proper db
mysql_select_db(DB_NAME) or die("Could not select database");
mysql_set_charset('utf8');


$query = 'SELECT `username`, `topic_name`, `level`, `chat_id` FROM `kikbot_sessions` WHERE `id` = '. $_GET['sid'] .' LIMIT 1;';
$result = mysql_query($query);

$player_obj = array();
if (mysql_num_rows($result) == 1) {
	$player_obj = mysql_fetch_object($result);

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
	  <meta name="title" content="<?= ($player_obj->username); ?>">
	  <meta name="description" content="<?= ($player_obj->topic_name ." - ". $player_obj->level); ?>">
    <meta name="author" content="MODD Website V.0.5.0">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title><?= ($_GET['username']); ?></title>

	  <meta property="og:site_name" content="<?= ($_GET['username']); ?>">
	  <meta property="og:url" content="<?= (isset($_SERVER['HTTPS']) ? "https://" : "http://") . $_SERVER["HTTP_HOST"] . $_SERVER['REQUEST_URI'] ?>">
	  <meta property="og:title" content="<?= ($player_obj->username); ?>">
	  <meta property="og:description" content="<?= ($player_obj->topic_name ." - ". $player_obj->level); ?>">
	  <meta property="og:image" content="https://i.imgur.com/avKU6FJ.jpg">

	  <!-- JS INCLUDES -->
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
	  <script type="text/javascript" src="http://cdn.kik.com/kik/2.3.6/kik.js"></script>

	  <style type="text/css">
		  html, body {
			  background-color: #000000;
		  }
	  </style>
  </head>

  <body>
  <script type="text/javascript">
	  $(document).ready(function() {
		  kik.ready(function () {
			  kik.openConversation("<?= ($player_obj->username); ?>");
		  });
	  });
  </script>
  </body>
</html>
