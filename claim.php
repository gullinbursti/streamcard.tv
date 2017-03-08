<?php

define('DB_HOST', "internal-db.s4086.gridserver.com");
define('DB_NAME', "db4086_modd");
define('DB_USER', "db4086_modd_usr");
define('DB_PASS', "f4zeHUga.age");

require_once('stripe-php-4.1.1/init.php');

// make the connection
$db_conn = mysql_connect(DB_HOST, DB_USER, DB_PASS) or die("Could not connect to database");

// select the proper db
mysql_select_db(DB_NAME) or die("Could not select database");
mysql_set_charset('utf8');

$query = 'SELECT `name`, `game_name`, `image_url` FROM `flip_inventory` WHERE `id` = '. $_GET['item_id'] .' LIMIT 1;';
$result = mysql_query($query);

if (mysql_num_rows($result) == 1) {
	$item_obj = mysql_fetch_object($result);
	$item_name = $item_obj->name;
	$game_name = $item_obj->game_name;
	$image_url = $item_obj->image_url;
}

$tracking_id = "UA-83707103-1";
$curl = curl_init();
curl_setopt_array($curl, array(
	CURLOPT_USERAGENT => "GameBots-Tracker-v2",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_POST => 1,
	CURLOPT_POSTFIELDS => http_build_query(array(
		'v'   => 1,
		'tid' => $tracking_id,
		'cid' => md5($_SERVER['REMOTE_ADDR']),
		't'   => "event",
		'ec'  => "claim-page-load",
		'ea'  => "",
		'el'  => "",
		'ev'  => "0"
	)),
	CURLOPT_URL => "http://www.google-analytics.com/collect"
));

$r = curl_exec($curl);
curl_close($curl);

$tracking_id = "UA-83707103-1";
$curl = curl_init();
curl_setopt_array($curl, array(
	CURLOPT_USERAGENT => "GameBots-Tracker-v2",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_POST => 1,
	CURLOPT_POSTFIELDS => http_build_query(array(
		'v'   => 1,
		'tid' => $tracking_id,
		'cid' => md5($_SERVER['REMOTE_ADDR']),
		't'   => "event",
		'ec'  => "claim-page-load-". ((intval($_GET['from_user']) > 0) ? "FACEBOOK" : "KIK"),
		'ea'  => "",
		'el'  => "",
		'ev'  => "0"
	)),
	CURLOPT_URL => "http://www.google-analytics.com/collect"
));

$r = curl_exec($curl);
curl_close($curl);

$curl = curl_init();
curl_setopt_array($curl, array(
	CURLOPT_USERAGENT => "GameBots-Tracker-v2",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_POST => 1,
	CURLOPT_POSTFIELDS => http_build_query(array(
		'payload' => json_encode(array(
			'channel'   => "#bot-alerts",
			'username'  => (intval($_GET['from_user']) > 0) ? "gamebotsc" : "game.bots",
			'icon_url'  => (intval($_GET['from_user']) > 0) ? "https://cdn1.iconfinder.com/data/icons/logotypes/32/square-facebook-128.png" : "http://icons.iconarchive.com/icons/chrisbanks2/cold-fusion-hd/128/kik-Messenger-icon.png",
			'text'      => "Claim button pressed by ". $_GET['from_user'],
			'attachments' => array(
				array('image_url' => $image_url)
			)
		))
	)),
	CURLOPT_URL => "https://hooks.slack.com/services/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"
));

$r = curl_exec($curl);
curl_close($curl);


?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
    <title>Pre</title>
    <meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
    <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, width=device-width">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="format-detection" content="telephone=no" />
		<link rel="apple-touch-icon" sizes="57x57" href="img/icon/apple-icon-57x57.png">
		<link rel="apple-touch-icon" sizes="60x60" href="img/icon/apple-icon-60x60.png">
		<link rel="apple-touch-icon" sizes="72x72" href="img/icon/apple-icon-72x72.png">
		<link rel="apple-touch-icon" sizes="76x76" href="img/icon/apple-icon-76x76.png">
		<link rel="apple-touch-icon" sizes="114x114" href="img/icon/apple-icon-114x114.png">
		<link rel="apple-touch-icon" sizes="120x120" href="img/icon/apple-icon-120x120.png">
		<link rel="apple-touch-icon" sizes="144x144" href="img/icon/apple-icon-144x144.png">
		<link rel="apple-touch-icon" sizes="152x152" href="img/icon/apple-icon-152x152.png">
		<link rel="apple-touch-icon" sizes="180x180" href="img/icon/apple-icon-180x180.png">
		<link rel="icon" type="image/png" sizes="192x192"  href="img/icon/android-icon-192x192.png">
		<link rel="icon" type="image/png" sizes="32x32" href="img/icon/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="96x96" href="img/icon/favicon-96x96.png">
		<link rel="icon" type="image/png" sizes="16x16" href="img/icon/favicon-16x16.png">
		<link rel="manifest" href="/manifest.json">
		<meta name="msapplication-TileColor" content="#ffffff">
		<meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
		<meta name="theme-color" content="#ffffff">
		<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
		<script src="js/index.js"></script>
		
		<!--Start of Tawk.to Script-->
		<script type="text/javascript">
		var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
		(function(){
		var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
		s1.async=true;
		s1.src='https://embed.tawk.to/5820c8f4e808d60cd07ca25b/default';
		s1.charset='UTF-8';
		s1.setAttribute('crossorigin','*');
		s0.parentNode.insertBefore(s1,s0);
		})();
		</script>
		<!--End of Tawk.to Script-->

		<link href="https://fonts.googleapis.com/css?family=PT+Sans|Rajdhani|Open+Sans|Nunito:100, 200, 300, 400,700|Varela+Round" rel="stylesheet">
		<link rel="stylesheet" href="css/index-shop.css">
	</head>
	<body>
		
		
		
	
			</div>
			<!-- 
	<div class="change-log" onclick="freeItem()" style="font-weight:600; color:#fff;	font-family: 'Nunito', sans-serif;padding-left:12px; padding-right:12px; padding-top:3px; padding-bottom:3px; border-radius:16px;"><img src="img/chat.png"></div> -->
		
		<div class="logo" onclick="home()"><img src="img/square-legal.png"></div>
		
		<div class="shop-header"></div>
		
    <div class="price-area" style="width:100%">

		   <div class="price-text" style=" line-height:34px;  border-bottom: 1px solid #ccc; color:#666; text-align:left; font-size:14px; padding-left:15px;padding-top:10px; padding-bottom:8px; text-transform:uppercase; ">TO CLAIM YOUR <a href="https://steamcommunity.com/tradeoffer/new/?partner=317337787&token=Mz9kSulb" target="_blank"  style="color:#000; font-weight:600; font-size:14px; text-transform:uppercase;  text-decoration:none;"><?= ($item_name); ?></a>
				  <div style="padding-left:10px; ">🌟 Give us <a href="http://kik.me/support.gamebots.1" target="_blank"  style="color:#7d3ecb; font-weight:600; font-size:14px; text-transform:uppercase;  text-decoration:none; background:#ededed;padding:3px;border-radius:4px; padding-left:5px; padding-right:5px;">5 stars on Kik</a></div>
					
					<!--
					<div style="padding-left:10px; ">➜ Join Gamebots <a href="http://steamcommunity.com/groups/gamebotsc" target="_blank"  style="color:#666; font-size:14px; text-transform:uppercase;  text-decoration:underline;">Steam group</a></div>
					
					
					<div style="padding-left:10px; ">➜ Submit Steam <a href="https://steamcommunity.com/tradeoffer/new/?partner=317337787&token=Mz9kSulb" target="_blank"  style="color:#666; font-size:14px; text-transform:uppercase;  text-decoration:underline;">trade request</a></div>
						
					-->
					
					<div style="padding-left:10px; ">👥 Share Gamebots with <a href="http://kik.me/support.gamebots.1" target="_blank"  style="color:#7d3ecb; font-weight:600; font-size:14px; text-transform:uppercase;  text-decoration:none; background:#ededed;padding:3px;border-radius:4px; padding-left:5px; padding-right:5px;">Kik friends</a></div>
										
					<div style="padding-left:10px; ">💬 Message <a href="http://kik.me/support.gamebots.1" target="_blank"  style="color:#7d3ecb; font-weight:600; font-size:14px; text-transform:uppercase;  text-decoration:none; background:#ededed;padding:3px;border-radius:4px; padding-left:5px; padding-right:5px;">support</a> for Item URL</div>
					
					
			 
			 </div>
			 
		</div>
		
		

	     <div id='main'>
	
				   <aside><img src="<?= ($image_url); ?>" id="item-image" width="148px;" height="148px" />
						
						 
						 </aside>
					 
					   <aside>
					   	
						
									
							
					   </aside>
	     </div>
		
		
    <div class="price-area" style="width:100%">


 <div class="price-text" onclick="terms()" style="float:left; line-height:28px; color:#ccc; text-align:left; font-size:14px; text-decoration:none; text-transform:none; padding-left:20px;padding-top:10px;">© Pre</div>

			 
		</div>


		
		
		
		
	</body
</html>