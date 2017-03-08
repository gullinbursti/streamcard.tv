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

$query = 'SELECT `name`, `info`, `price`, `image_url` FROM `hotbot_products` WHERE `id` = '. $_GET['item_id'] .' LIMIT 1;';
$result = mysql_query($query);

$item_name = "";
$item_info = "";
$item_price = 0;
$item_image = "";
if (mysql_num_rows($result)) {
	$item_obj = mysql_fetch_object($result);
	$item_name = $item_obj->name;
	$item_info = $item_obj->info;
	$item_price = $item_obj->price;
	$item_image = $item_obj->image_url;
}


if ($_GET['a'] == 1) {
	if (isset($_POST['stripeToken'])) {
		\Stripe\Stripe::setApiKey("sk_live_XhtvWeK1aZ1ggqLrJ4Z0SOZZ");
//		\Stripe\Stripe::setApiKey("sk_test_3QTHaM9IjN2g3AI91Gqqaoxo");
		try {
			$charge = \Stripe\Charge::create(array(
				"amount"      => $item_price * 100, // Amount in cents
				"currency"    => "usd",
				"source"      => $_POST['stripeToken'],
				"description" => "Pre (on Messenger)"
			));
		} catch (\Stripe\Error\Card $e) {
			// The card has been declined
		}
	}

	$query = 'SELECT `name`, `info`, `price`, `image_url` FROM `hotbot_products` WHERE `id` = '. $_GET['item_id'] .' LIMIT 1;';
	$result = mysql_query($query);

	if (mysql_num_rows($result)) {
		$item_obj = mysql_fetch_object($result);
		$item_name = $item_obj->name;
		$item_info = $item_obj->info;
		$item_price = $item_obj->price;
		$item_image = $item_obj->image_url;
	}


	$query = 'INSERT INTO `fb_purchases` (`id`, `chat_id`, `item_id`, `added`) VALUES (NULL, "'. $_GET['from_user'] .'", "'. $_GET['item_id'] .'", NOW());';
	$result = mysql_query($query);
	$item_id = mysql_insert_id();

	$curl = curl_init();
	curl_setopt_array($curl, array(
		CURLOPT_USERAGENT => "GameBots-Tracker-v2",
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_POST => 1,
		CURLOPT_POSTFIELDS => http_build_query(array(
			'payload' => json_encode(array(
				'channel'   => "#bot-alerts",
        'username'  => (intval($_GET['from_user']) > 0) ? "gamebotsc" : "the.hot..bot",
        'icon_url'  => (intval($_GET['from_user']) > 0) ? "https://cdn1.iconfinder.com/data/icons/logotypes/32/square-facebook-128.png" : "http://icons.iconarchive.com/icons/chrisbanks2/cold-fusion-hd/128/kik-Messenger-icon.png",
        'text'      => "Purchase by ". $_GET['from_user'] .":\n". $item_name ."\n". $item_info ."\n$". $item_price,
        'attachments' => array(
	        array('image_url' => $item_image)
        )
			))
		)),
		CURLOPT_URL => "https://hooks.slack.com/services/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"
	));

	$r = curl_exec($curl);
	curl_close($curl);

	$query = 'SELECT `chat_id` FROM ` hotbot_logs` WHERE `username` = "'. $_GET['from_user'] .'" LIMIT 1;';
	$result = mysql_query($query);

	if (mysql_num_rows($result) == 1) {
		$chat_id = mysql_fetch_object($result)->chat_id;

		$curl = curl_init();
		curl_setopt_array($curl, array(
			CURLOPT_USERAGENT => "GameBots-Tracker-v2",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_POST => 1,
			CURLOPT_POSTFIELDS => http_build_query(array(
				'token' => "b221ac2f599be9d53e738669badefe76",
				'to_user' => $_GET['from_user'],
				'chat_id' => $chat_id,
			  'message' => "Thank you for purchasing ". $item_name . "!\n\nWe will deliver the games digital key the instant it becomes available.\n\nSupport: www.prebot.chat"
			)),
			CURLOPT_URL => "http://159.203.250.4:8080/stripe-callback"
		));

		$r = curl_exec($curl);
		curl_close($curl);

		//header("Location: http://m.me/gamebotsc");
	}

} else {
	$curl = curl_init();
	curl_setopt_array($curl, array(
		CURLOPT_USERAGENT => "GameBots-Tracker-v2",
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_POST => 1,
		CURLOPT_POSTFIELDS => http_build_query(array(
			'payload' => json_encode(array(
				'channel'   => "#bot-alerts",
				'username'  => (intval($_GET['from_user']) > 0) ? "gamebotsc" : "the.hot.bot",
				'icon_url'  => (intval($_GET['from_user']) > 0) ? "https://cdn1.iconfinder.com/data/icons/logotypes/32/square-facebook-128.png" : "http://icons.iconarchive.com/icons/chrisbanks2/cold-fusion-hd/128/kik-Messenger-icon.png",
				'text'      => "Buy button pressed by ". $_GET['from_user'],
				'attachments' => array(
					array('image_url' => $item_image)
				)
			))
		)),
		CURLOPT_URL => "https://hooks.slack.com/services/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"
	));

	$r = curl_exec($curl);
	curl_close($curl);
}

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
		<div class="change-log" onclick="freeItem()" style="background:#5b23a0; font-weight:600; color:#fff;	font-family: 'Nunito', sans-serif;padding-left:12px; padding-right:12px; padding-top:3px; padding-bottom:3px; border-radius:16px;">Support</div>-->
		
		<div class="logo" onclick="home()"><img src="img/square-legal.png"></div>
		
		<div class="shop-header"></div>
		
    <div class="price-area" style="width:100%">

		   <div class="price-text" onclick="" style=" line-height:34px;  border-bottom: 1px solid #ccc; color:#666; text-align:left; font-size:14px; padding-left:15px;padding-top:10px; padding-bottom:8px; text-transform:uppercase;">Pre order for <b>$<?= (money_format('%i', $item_price)); ?></b><br>
				  <div style="padding-left:10px; ">🔑 Reserve a <a href="http://kik.me/support.gamebots.1" target="_blank"  style="color:#7d3ecb; font-weight:600; font-size:14px; text-transform:uppercase;  text-decoration:none; background:#ededed;padding:3px;border-radius:4px; padding-left:5px; padding-right:5px;">Pre Key</a> below</a></div>
					<div style="padding-left:10px; ">🕒 Get Bot <a href="http://kik.me/support.gamebots.1" target="_blank"  style="color:#7d3ecb; font-weight:600; font-size:14px; text-transform:uppercase;  text-decoration:none; background:#ededed;padding:3px;border-radius:4px; padding-left:5px; padding-right:5px;">alerts</a> up to the release</a></div>
					<div style="padding-left:10px; ">🎮 Checkout up to <a href="http://kik.me/support.gamebots.1" target="_blank"  style="color:#7d3ecb; font-weight:600; font-size:14px; text-transform:uppercase;  text-decoration:none; background:#ededed;padding:3px;border-radius:4px; padding-left:5px; padding-right:5px;">50% off</a></div>
			 
			 </div>
			 
		</div>
		<div class="confirmed" style="width: 100%; text-align: center; display: none">Thank you for your purchase! Pre will send your purchase confirmation shortly</div>
		

	     <div id='main'>

	
				   <aside><img src="<?= ($item_image); ?>" id="item-image" width="120px;" /></aside>
					 <aside>
						 <?= ($item_name); ?>
					 </aside>
					 
					   <aside>
					   	
							<!--				data-key="pk_test_hEOqIXLLiGcTTj7p2W9XxuCP"-->
<!--							data-key="pk_live_7OvF9BcQ3LvNZd0z0FsPPgNF"-->
									<form class="pay-form" style="float:right; padding-right:20px;padding-top:65px;" action="/stripe.php?a=1&from_user=<?= ($_GET['from_user']); ?>&item_id=<?= ($_GET['item_id']); ?>" method="POST">
										<script
											src="https://checkout.stripe.com/checkout.js" class="stripe-button"
											data-key="pk_live_7OvF9BcQ3LvNZd0z0FsPPgNF"
											data-amount="<?= ($item_price * 100); ?>"

											data-name="<?= ($item_name); ?>"
											data-description="Widget"
											data-image="http://i.imgur.com/i6EWIkJ.png"
											data-locale="auto"
											data-label="$<?= ($item_price); ?> Pre"
											data-zip-code="true">
										</script>
										<input name="from-user" type="hidden" value="<?= ($_GET['from_user']); ?>">
										<input name="item-id" type="hidden" value="<?= ($_GET['item_id']); ?>">
									</form>
									<script type="text/javascript">
										$(document).ready(function () {
											var queryString = {};
											window.location.href.replace(
												new RegExp("([^?=&]+)(=([^&]*))?", "g"),
												function($0, $1, $2, $3) { queryString[$1] = $3; }
											);

											if (typeof queryString['a'] != 'undefined') {
												$('.pay-form').hide();
												$('.confirmed').show();

											} else {
												$.ajax({
													type    : 'GET',
													url     : 'http://beta.modd.live/api/bot_tracker.php',
													data    : {
														src      : "facebook",
														category : "buy-button",
														action   : "buy-button",
														label    : "<?= ($_GET['from_user']); ?>",
														value    : "0"
													},
													success : function (data) {
													}
												});
											}
										});
									</script>
							
					   </aside>
	     </div>



    <div class="price-area" style="width:100%">



		  <div class="price-text" onclick="terms()" style="float:left; line-height:28px; color:#ccc; text-align:left; font-size:14px; text-decoration:none; text-transform:none; padding-left:20px;padding-top:10px;">© Pre</div>

			 
		</div>

		
		
		
		
	</body
</html>