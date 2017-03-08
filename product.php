<?php

define('DB_HOST', "internal-db.s4086.gridserver.com");
define('DB_NAME', "db4086_modd");
define('DB_USER', "db4086_modd_usr");
define('DB_PASS', "f4zeHUga.age");


if ($_GET['a'] == 1) {
	// make the connection
	$db_conn = mysql_connect(DB_HOST, DB_USER, DB_PASS) or die("Could not connect to database");

	// select the proper db
	mysql_select_db(DB_NAME) or die("Could not select database");
	mysql_set_charset('utf8');

	$query = 'UPDATE `fb_products` SET `enabled` = 0;';
	$result = mysql_query($query);

	$query = 'INSERT INTO `fb_products` (`id`, `name`, `info`, `image_url`, `price`, `added`) VALUES (NULL, "'. $_POST['txt-name'] .'", "'. $_POST['txt-info'] .'", "'. $_POST['txt-image'] .'", '. $_POST['txt-price'] .', NOW());';
	$result = mysql_query($query);
	$item_id = mysql_insert_id();

	if ($_POST['submit-type'] == "broadcast") {
		$query = 'SELECT DISTINCT `chat_id` FROM `fbbot_logs`;';
		$result = mysql_query($query);

		//$user_obj = array('chat_id' => "1219553058088713");
		while ($user_obj = mysql_fetch_object($result)) {

			$payload_arr = array(
				'recipient' => array(
					'id' => $user_obj->chat_id
				),
			  'message' => array(
				  'attachment' => array(
					  'type' => "template",
				    'payload' => array(
					    'template_type' => "generic",
				      'elements' => array(
					      array(
						      'title'     => $_POST['txt-name'],
					        'subtitle'  => $_POST['txt-info'],
					        'image_url' => $_POST['txt-image'],
					        'item_url'  => "https://prebot.chat/stripe.php?id=". $item_id ."&from_user=". $user_obj->chat_id ."&item_id=". $item_id,
					        'buttons'   => array(
						        array(
							        'type'  => "web_url",
                      'url'   => "https://prebot.chat/stripe.php?id=". $item_id ."&from_user=". $user_obj->chat_id ."&item_id=". $item_id,
                      'title' => "Buy"
						        )
					        )
					      )
				      )
				    )
				  )
			  )
			);

			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, "https://graph.facebook.com/v2.6/me/messages?access_token=EAAXFDiMELKsBAM0ukSiFZBhCHFWJIqMHhv1uwuL0GZB59PZC7AljrESQetUJRlusUTkzyMnM67Ahn9etkboS4ZCXIRoipiIUIYUh11nx3FQqDRKLxdGZCWSsONZBwQEpjV67GV7majCwB5iTUaaDPoQZC3FAIAxZCeQ5cdqhE9DSMBKS9Gzpv9Yt");
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload_arr));
			curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_FAILONERROR, 1);
			curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 300);
			curl_setopt($ch, CURLOPT_TIMEOUT, 60);

			$result = json_decode(curl_exec($ch), true);
			curl_close($ch);

			if ($_POST['video-url'] != "") {
				$payload_arr = array(
					'recipient' => array(
						'id' => $user_obj->chat_id
					),
					'message'   => array(
						'attachment'    => array(
							'type'    => "video",
							'payload' => array(
								'url' => $_POST['video-url']
							)
						),
						'quick_replies' => array(
							array(
								'content_type' => "text",
								'title'        => "Show More",
								'payload'      => "PRODUCT_SHOW-MORE"
							),
							array(
								'content_type' => "text",
								'title'        => "Show Less",
								'payload'      => "PRODUCT_SHOW-LESS"
							)
						)
					)
				);

				$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL, "https://graph.facebook.com/v2.6/me/messages?access_token=EAAXFDiMELKsBAM0ukSiFZBhCHFWJIqMHhv1uwuL0GZB59PZC7AljrESQetUJRlusUTkzyMnM67Ahn9etkboS4ZCXIRoipiIUIYUh11nx3FQqDRKLxdGZCWSsONZBwQEpjV67GV7majCwB5iTUaaDPoQZC3FAIAxZCeQ5cdqhE9DSMBKS9Gzpv9Yt");
				curl_setopt($ch, CURLOPT_POST, 1);
				curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload_arr));
				curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
				curl_setopt($ch, CURLOPT_FAILONERROR, 1);
				curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 300);
				curl_setopt($ch, CURLOPT_TIMEOUT, 60);

				$result = json_decode(curl_exec($ch), true);
				curl_close($ch);
			}


			if ($_POST['txt-message'] != "") {
				$payload_arr = array(
					'recipient' => array(
						'id' => $user_obj->chat_id
					),
					'message'   => array(
						'text' => $_POST['txt-message']
					)
				);

				$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL, "https://graph.facebook.com/v2.6/me/messages?access_token=EAAXFDiMELKsBAM0ukSiFZBhCHFWJIqMHhv1uwuL0GZB59PZC7AljrESQetUJRlusUTkzyMnM67Ahn9etkboS4ZCXIRoipiIUIYUh11nx3FQqDRKLxdGZCWSsONZBwQEpjV67GV7majCwB5iTUaaDPoQZC3FAIAxZCeQ5cdqhE9DSMBKS9Gzpv9Yt");
				curl_setopt($ch, CURLOPT_POST, 1);
				curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload_arr));
				curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
				curl_setopt($ch, CURLOPT_FAILONERROR, 1);
				curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 300);
				curl_setopt($ch, CURLOPT_TIMEOUT, 60);

				$result = json_decode(curl_exec($ch), true);
				curl_close($ch);
			}
		}
	}
}

?>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	</head>

	<body>
		<form class="product-form" action="/product.php?a=1" method="post">
			<label for="txt-name">Name: </label><input type="text" name="txt-name" value="" /><br />
			<label for="txt-info">Info: </label><input type="text" name="txt-info" value="" /><br />
			<label for="txt-price">Price: $</label><input type="text" name="txt-price" value="" /><br />
			<label for="txt-image">Image: </label><input type="text" name="txt-image" value="" /><br />
			<hr />
			<label for="video-url">Video URL: </label><input type="text" name="video-url" value="" /><br />
			<label for="txt-message">Final Message: </label><input type="text" name="txt-message" value="" /><br />
			<hr />
			<input type="hidden" class="submit-type" name="submit-type" value="" />
			<input type="button" id="submit-button" value="Submit" />
			<input type="button" id="broadcast-button" value="Broadcast" /><br />
		</form>

		<script type="text/javascript">
			$(document).ready(function () {
				$('#submit-button').click(function() {
					$('.submit-type').val("submit");
					$('.product-form').submit();
				});

				$('#broadcast-button').click(function() {
					$('.submit-type').val("broadcast");
					$('.product-form').submit();
				});
			});
		</script>
	</body>
</html>