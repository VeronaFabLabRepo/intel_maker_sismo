<?php
	$servername = "localhost";
	$username = "intelmaker";
	$password = "vrfablabintel";
	$dbname = "intelmaker";
	
	$stazioni = array();
	$stazioni['GREZZANA'] = array(45.52,11.01);
	//TODO aggiungere qui stazioni
	
	$conn = new mysqli($servername, $username, $password,$dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
	$start = htmlspecialchars($_GET["start"]);
	$end = htmlspecialchars($_GET["end"]);
	
	$sql = "SELECT distinct seismometer FROM seismometer WHERE UNIX_TIMESTAMP(ins_tmst) > $start AND UNIX_TIMESTAMP(ins_tmst) < $end";
	
	$result = $conn->query($sql);
	
	$seismometer = array();
	
	while($row = $result->fetch_assoc()) {
		$stazione = $row['seismometer'];
		$coordinates = $stazioni[$stazione];
		
		$seismometer[$stazione] = $coordinates;
	}
	
	$result = array(
		'result' => 'OK',
		'message' => 'richiesta esguita correttamente', 
		'seismometer' => $seismometer
	);
	
	$data = json_encode($result);
	echo $data;
?>