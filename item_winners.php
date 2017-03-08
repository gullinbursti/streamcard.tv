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

?>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>

		<script type="text/javascript">
			function claimItem(claimID) {
				$.ajax({
					type    : 'POST',
					url     : 'http://prebot.chat/item_claim.php',
					data    : {
						item_id   : claimID
					},
					success : function (data) {
						$('#claim-cell_'+claimID).html('CLAIMED - '+data);
					}
				});
			}
		</script>
	</head>
	<body>
		<table>
			<tr>
				<td>#</td>
				<td>Kik Name</td>
				<td>Item</td>
				<td>Date</td>
				<td>Status</td>
			</tr>

			<?php
			$query = 'SELECT `id`, `kik_name`, `item_name`, `claimed`, `claim_date`, `added` FROM `item_winners`;';
			$result = mysql_query($query);

			$cnt = 1;
			while ($winner_obj = mysql_fetch_object($result)) {
				echo ("<tr>");
				echo ("<td>". $cnt++ ."</td>");
				echo ("<td>". $winner_obj->kik_name ."</td>");
				echo ("<td>". $winner_obj->item_name ."</td>");
				echo ("<td>". $winner_obj->added ."</td>");
				echo (($winner_obj->claimed == 1) ? "<td>CLAIMED - ". $winner_obj->claim_date ."</td>" : "<td id='claim-cell_". $winner_obj->id ."'><input type='button' value='Claim' onclick='claimItem(". $winner_obj->id .");'></td>");
				echo ("</tr>");
			}
			?>

		</table>

	</body>
</html>