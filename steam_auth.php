<?php
require ('steamauth/steamauth.php');
unset($_SESSION['steam_uptodate']);
?>
<!DOCTYPE html>
<html>
	<head>
		<title>page</title>
	</head>
	<body>
		<?php
		if(!isset($_SESSION['steamid'])) {

			echo "welcome guest! please login<br><br>";
			loginbutton(); //login button

		}  else {
			include ('steamauth/userInfo.php');

			header('Location: http://gamebots.chat/bot.html?t=s&a=' . $steamprofile['steamid']);

			//Protected content
			//echo "Welcome back " . $steamprofile['personaname'] . "</br>";
			//echo "here is your avatar: </br>" . '<img src="'.$steamprofile['avatarfull'].'" title="" alt="" /><br>'; // Display their avatar!

			//logoutbutton();
		}
		?>
	</body>
</html>
<!--Version 3.2-->
