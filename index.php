<html>
	<head>
		<title>Graphs!</title>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
		<script type="text/javascript" src="https://www.google.com/jsapi"></script>
		<script type="text/javascript">

		      // Load the Visualization API and the piechart package.
     		 google.load('visualization', '1.0', {'packages':['corechart']});
		</script>
		<script src="graphs.js"></script>

		<script type='text/javascript'>
			$(document).ready(function() {
				updatePlotsTimer();
				});


			var updatePlots = function()
			{
				plotElectricityGraph("elecchart24","minute",1);
				plotTemperatureGraph("tempchart24","minute",1);
				plotHumidityGraph("humidity24","minute",1);

				plotElectricityGraph("elecchart7","hour",7);
				plotTemperatureGraph("tempchart7","hour",7);
				plotHumidityGraph("humidity7","hour",7);

				plotElectricityWeekOverlay("elecoverlay");
				plotTemperatureWeekOverlay("tempoverlay");
			}
			
			var updatePlotsTimer = function()
			{
				updatePlots();
				setTimeout(updatePlotsTimer,60000);
			}

		</script>
	</head>

	<body>
		<h2>Last 24 Hours</h2>
		<div id='elecchart24'></div>
		<div id='tempchart24'></div>
		<div id='humidity24'></div>

		<h2>Last Week</h2>
		<div id='elecoverlay'></div>
		<div id='tempoverlay'></div>
		<div id='elecchart7'></div>
		<div id='tempchart7'></div>
		<div id='humidity7'></div>
	</body>
</html>
