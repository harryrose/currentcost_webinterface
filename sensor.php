<?php
	header("Content-Type: application/json");
	error_reporting(E_ALL);
	ini_set('display_errors', 'On');

	$db  = new mysqli("localhost","currentcost","","sensordata");
	if($db->connect_error)
	{
		die('Connect error '.$mysqli->connect_error);
	}

	$query = "";
	if(isset($_GET['query']))
	{
		switch($_GET['query'])
		{
			case "electricity":
			$query = "SELECT sensorid,channelid,time,AVG(consumption) as consumption, MAX(consumption) as max, MIN(consumption) as min FROM electricity";
					
			break;


			case "temperature":
			$query = "SELECT sensorid,time,AVG(temperature) as temperature, MAX(temperature) as max, MIN(temperature) as min FROM temperature";
			break;

			case "humidity":
			$query = "SELECT sensorid,time,AVG(humidity) as humidity, MAX(humidity) as max, MIN(humidity) as min FROM humidity";
			break;
		}
	}
	else
	{
		print "Please specify a 'query' query string of electricity, humidity or temperature.";
		exit;
	}

	$where = "";
	$haswhere = false;
	if(isset($_GET['sensor']))
	{
		$haswhere = true;
		$where = " WHERE sensorid = ".mysql_escape_string($_GET['sensor']);
	}

	if(isset($_GET['channel']) && $_GET['query'] == 'electricity')
	{
		if(!$haswhere)
		{
			$haswhere = true;
			$where .= " WHERE ";
		}
		else
		{
			$where .= " AND ";
		}
		$where .= "channelid = '".mysql_escape_string($_GET['channel'])."'";
	}

	if(isset($_GET['date_earliest']))
	{
		if(!$haswhere)
		{
			$haswhere = true;
			$where .= " WHERE ";
		}
		else
		{
			$where .= " AND ";
		}

		$where .= "time >= STR_TO_DATE('".mysql_escape_string($_GET['date_earliest'])."','%Y-%m-%d %H:%i:%s')";
	}

	if(isset($_GET['date_latest']))
	{
		if(!$haswhere)
		{
			$haswhere = true;
			$where .= " WHERE ";
		}
		else
		{
			$where .= " AND ";
		}
		$where .= "time <= STR_TO_DATE('".mysql_escape_string($_GET['date_latest'])."','%Y-%m-%d %H:%i:%s')";
	}

	$query .= $where;

	$grouping = "second";
	if(isset($_GET['group']))
	{
		$grouping = $_GET['group'];
	}
		$query .= " GROUP BY ".($_GET['query'] == "electricity" ? "channelid,":"")."sensorid, DATE( time )";
		switch($grouping)
		{
			case "second":
				$query .=",SECOND(time)";
			case "minute":
				$query .=",MINUTE(time)";
			case "hour":
				$query .= ",HOUR(time)";
			
			default:
				//day
			break;
		}
	
	if(isset($_GET['order']))
	{
		switch($_GET['order'])
		{
			case "asc":
			case "ASC":
				$query .= " ORDER BY `time` ASC";
			break;

			case 'desc':
			case "DESC":
				$query .= " ORDER BY `time` DESC";
			break;
		}
	}

	if(isset($_GET['limit']))
	{
		$query .= " LIMIT ".mysql_escape_string($_GET['limit']);
		if(isset($_GET['skip']))
		{
			$query .= " OFFSET ".mysql_escape_string($_GET['skip']);
		}
	}
	$results = $db->query($query);

	if($results)
	{
		echo "[";
		$firstrow = 1;
		while($row = $results->fetch_assoc())
		{
			if(!$firstrow) echo ",";
			$firstrow = 0;
			echo "{";
				$firstkey = 1;
				foreach(array_keys($row) as $key)
				{
					if(!$firstkey) echo ",";
					$firstkey = 0;
					echo "\"$key\": \"{$row[$key]}\"";
				}
			echo "}";
		}		
		echo "]";
	}

?>
