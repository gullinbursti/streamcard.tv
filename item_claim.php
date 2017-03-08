<?php

define('DB_HOST', "internal-db.s4086.gridserver.com");
define('DB_NAME', "db4086_modd");
define('DB_USER', "db4086_modd_usr");
define('DB_PASS', "f4zeHUga.age");


// make the connection
$db_conn = mysql_connect(DB_HOST, DB_USER, DB_PASS) or die("Could not connect to database");

// select the proper db
mysql_select_db(DB_NAME) or die("Could not select database");
mysql_set_charset('utf8');

$query = 'UPDATE `item_winners` SET `claimed` = 1, `claim_date` = NOW() WHERE `id` = '. $_POST['item_id'] .' LIMIT 1;';
$result = mysql_query($query);

echo (date("Y-m-d H:i:s"));
?>