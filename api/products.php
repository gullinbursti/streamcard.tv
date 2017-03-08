<?php header("access-control-allow-origin: *");

$server_time = new DateTime('NOW', new DateTimeZone('America/Los_Angeles'));


// db creds
require_once ('./db_consts.php');


// make the connection
$db_conn = mysqli_connect(DB_HOST, DB_USER, DB_PASS) or die("Could not connect to database");

// select the proper db
mysqli_select_db($db_conn, DB_NAME) or die("Could not select database");


if ($_POST['action'] == "INSERT") {
	$query = 'INSERT IGNORE INTO `products` (`id`, `name`, `display_name`, `email`, `password`, `logo_url`, `added`) VALUES (NULL,  "'. $_POST['name'] .'", "'. $_POST['display_name'] .'", "'. $_POST['email'] .'", "'. $_POST['password'] .'", "'. $_POST['logo_url'] .'", NOW());';
	$result = mysqli_query($db_conn, $query);

} else if ($_POST['action'] == "UPDATE") {
	$query = 'UPDATE `products` SET `name` = '. $_POST['name'] .', `display_name` = '. $_POST['display_name'] .', `email` = '. $_POST['email'] .', `password` = '. $_POST['password'] .', `logo_url` = '. $_POST['logo_url'] .' WHERE `id` = '. $_POST['id'] .';';
	$result = mysqli_query($db_conn, $query);

} elseif ($_POST['action'] == "DELETE") {

}

$query = 'SELECT NOW() AS `dt`;';
$result = mysqli_query($db_conn, $query);

echo (json_encode(array(
	'timestamp' =>mysqli_fetch_object($result)->dt
)));


if ($db_conn) {
	mysqli_close($db_conn);
	$db_conn = null;
}

?>