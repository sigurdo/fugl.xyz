<?php
if ($_SERVER["REQUEST_METHOD"] == "GET") {
	echo "Her er det ingenting å finne med GET<br>";
}
if ($_SERVER["REQUEST_METHOD"] == "POST") {
	/*Required format for data:
	{
		db_username: username,
		db_password: password,
		turbine_id: id,
		time: "YYYY-MM-DD hh:mm:ss", (optional)
		speed: speed
	}
	*/
	//$ = $_POST[''];
	$db_username = $_POST['db_username'];
	$db_password = $_POST['db_password'];
	$turbine_id = $_POST['turbine_id'];
	$time = $_POST['time'] ? $_POST['time'] : date("Y-m-d H:i:s");
	$speed = $_POST['speed'];
	$table = $_POST['table'];

	$sql = "INSERT INTO observation (turbine_id, time, speed) VALUES ($turbine_id, '$time', $speed)";
	echo "sql: $sql <br>";
	echo "username: $db_username<br>";
	echo "password: $db_password<br>";

	$db = mysqli_connect("mysql.stud.ntnu.no", "sigurdht_$db_username", $db_password, "sigurdht_fugl");
	if (!$db) echo "Kunne ikke koble til mysql: <i>".mysqli_connect_error()."</i>, skrev du feil passord?<br>";
	else {
		if (mysqli_query($db, $sql)) echo "Spørringen gikk vellykket<br>";
		else echo "Spørringen feilet<br>";
	}
}
?>
