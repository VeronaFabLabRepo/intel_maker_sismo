<?php
	$servername = "localhost";
	$username = "intelmaker";
	$password = "vrfablabintel";
	$dbname = "intelmaker";
	
	$conn = new mysqli($servername, $username, $password,$dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
	$start = htmlspecialchars($_GET["start"]);
	$end = htmlspecialchars($_GET["end"]);
	
	$sql = "SELECT * FROM seismometer WHERE UNIX_TIMESTAMP(ins_tmst) > $start AND UNIX_TIMESTAMP(ins_tmst) < $end";
	
	$result = $conn->query($sql);
	
	$ax = array();
	$ay = array();
	$az = array();
	$time = array();
	
	$minimo;
	$massimo;
	
	while($row = $result->fetch_assoc()) {
		$ax[] = $row['ax'];
		$ay[] = $row['ay'];
		$az[] = $row['az'];
		$time[] = $row['ins_tmst'];
		
	}
	
	$sql = "SELECT min(ins_tmst) as minimo ,max(ins_tmst) as massimo FROM seismometer WHERE UNIX_TIMESTAMP(ins_tmst) > $start AND UNIX_TIMESTAMP(ins_tmst) < $end";
	$result = $conn->query($sql);
	
	if($row = $result->fetch_assoc()){
		$minimo = $row['minimo'];
		$massimo = $row['massimo'];
	}
	
	
	$result = array(
		'result' => 'OK',
		'message' => 'richiesta esguita correttamente', 
		'minimo' => $minimo,
		'massimo' => $massimo,
		'ax' => $ax,
		'ay' => $ay,
		'az' => $az,
		'time' => $time
	);
	
	$data = json_encode($result, JSON_NUMERIC_CHECK );
	echo $data;
?>