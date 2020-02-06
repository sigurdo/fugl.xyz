<?php
if ($_SERVER["REQUEST_METHOD"] == "GET") {
	$db = mysqli_connect("mysql.stud.ntnu.no", "sigurdht_fugl-get", "password", "sigurdht_fugl");
	$result = mysqli_query($db, "SELECT * FROM observation");
	$array = array();
	while ($row = mysqli_fetch_assoc($result)) {
		$array[] = $row;
	}
	echo json_encode($array);
}
?>
