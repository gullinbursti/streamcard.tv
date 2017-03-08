<?php


// db creds
require_once ('./_db_consts.php');

// make the connection
$db_conn = mysql_connect(DB_HOST, DB_USER, DB_PASS) or die("Could not connect to database");

// select the proper db
mysql_select_db(DB_NAME) or die("Could not select database");
mysql_set_charset('utf8');


$ch = curl_init();
curl_setopt ($ch, CURLOPT_URL, "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=6636EF814B616DDEC4EF52D333646615&steamids=". $_POST['steam_id']);
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
$contents = json_decode(curl_exec($ch), true);
$player_obj = $contents['response']['players'][0];
curl_close($ch);

$ch = curl_init();
curl_setopt ($ch, CURLOPT_URL, "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=6636EF814B616DDEC4EF52D333646615&steamid=". $_POST['steam_id'] ."&count=1&format=json");
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
$contents = json_decode(curl_exec($ch), true);
$game_obj = ($contents['response']['total_count']) > 0 ? $contents['response']['games'][0] : array(
	'appid' => "",
  'name' => "",
  'playtime_2weeks' => 0
);
curl_close($ch);


$query = 'INSERT IGNORE INTO `steam_users` (`id`, `kik_name`, `steam_id`, `username`, `avatar`, `game_id`, `game_name`, `game_time`, `updated`, `added`) VALUES (NULL, "'. $_POST['kik_name'] .'", "'. $_POST['steam_id'] .'", "'. $player_obj['personaname'] .'", "'. $player_obj['avatarfull'] .'", "'. $game_obj['appid'] .'", "'. $game_obj['name'] .'", '. $game_obj['playtime_2weeks'] .', NOW(), NOW());';
$result = mysql_query($query);
$steam_id = mysql_insert_id();


echo (json_encode(array(
	'id' => $steam_id,
  'query' => $query
)));

?>