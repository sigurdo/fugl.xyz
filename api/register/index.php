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
	$endtime = $_POST['endtime'] ? $_POST['endtime'] : date("Y-m-d H:i:s");
	$starttime = $_POST['starttime'] ? $_POST['starttime'] : date("Y-m-d H:i:s", strtotime($endtime)-60);
	$birdminutes = $_POST['birdminutes'] ? $_POST['birdminutes'] : 0;
	$topspeed = $_POST['topspeed'] ? $_POST['topspeed'] : "NULL";
	$temperature = $_POST['temperature'] ? $_POST['temperature'] : "NULL";
	$humidity = $_POST['humidity'] ? $_POST['humidity'] : "NULL";

	$sql = "INSERT INTO observation (turbine_id, starttime, endtime, birdminutes, topspeed, temperature, humidity) VALUES ($turbine_id, '$starttime', '$endtime', $birdminutes, $topspeed, $temperature, $humidity)";
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
