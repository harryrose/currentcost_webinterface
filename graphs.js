
var dateToString = function(date) {
	return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"%20"+date.getHours()+":"+date.getMinutes()+":00";
}
var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

var plotElectricityGraph = function(element, grouping, lastDays) {
	plotElectricityGraphBetween(element, grouping, dateToString(last(lastDays)),dateToString(new Date()));
}

var plotTemperatureGraph = function(element, grouping, lastDays) {
	plotTemperatureGraphBetween(element,grouping, dateToString(last(lastDays)),dateToString(new Date()));
}

var plotHumidityGraph = function(element, grouping, lastDays) {
	plotHumidityGraphBetween(element,grouping, dateToString(last(lastDays)),dateToString(new Date()));
}

function plotElectricityWeekOverlaySub(element, minusDays,datatable) 
{

	if(minusDays == 7)
	{
		var chart = new google.visualization.LineChart(document.getElementById(element));
		chart.draw(datatable,{title: "Electricity Consumption For Past Week Overlaid",interpolateNulls: true});
		return;
	}

	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(0);
	tomorrow.setMinutes(0);
	tomorrow.setSeconds(0);
	tomorrow.setMilliseconds(0);

	
	

	var endDate = new Date(tomorrow);
	endDate.setDate(endDate.getDate() - minusDays);

	var startDate = new Date(endDate);
	startDate.setDate(startDate.getDate() -1 );

	var querystring='sensor.php?query=electricity&order=asc&date_earliest='+dateToString(startDate)+'&date_latest='+dateToString(endDate)+"&group=minute";
	
	var processData = function (data) {
		for(var i = 0; i < data.length; i++)
		{
			if(data[i].channelid != 1)
				continue;

			var dateOData = new Date(data[i].time);
			var values = [[dateOData.getHours(),dateOData.getMinutes(),dateOData.getSeconds(),0],null,null,null,null,null,null,null];
			values[minusDays+1] = parseFloat(data[i].consumption);
			datatable.addRow(values);
		}
		
		plotElectricityWeekOverlaySub(element, minusDays + 1,datatable);
	};

	$.getJSON(querystring, processData);
}
var plotElectricityWeekOverlay = function(element) {

	var datatable = new google.visualization.DataTable();
	// time (HH:MM) Today, -1d, -2d, -3d, -4d, -5d, -6d
	datatable.addColumn('timeofday',"Time");
	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(0);
	tomorrow.setMinutes(0);
	tomorrow.setSeconds(0);
	tomorrow.setMilliseconds(0);
	
	for(var i = 0; i < 7; i++)
	{
		tomorrow.setDate(tomorrow.getDate() - 1);
		datatable.addColumn('number',tomorrow.getDate()+" "+months[tomorrow.getMonth()]);
	}

	plotElectricityWeekOverlaySub(element,0,datatable);
}

function plotTemperatureWeekOverlaySub(element, minusDays,datatable) 
{

	if(minusDays == 7)
	{
		var chart = new google.visualization.LineChart(document.getElementById(element));
		chart.draw(datatable,{title: "Temperature For Past Week Overlaid",interpolateNulls: true});
		return;
	}

	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(0);
	tomorrow.setMinutes(0);
	tomorrow.setSeconds(0);
	tomorrow.setMilliseconds(0);

	
	

	var endDate = new Date(tomorrow);
	endDate.setDate(endDate.getDate() - minusDays);

	var startDate = new Date(endDate);
	startDate.setDate(startDate.getDate() -1 );

	var querystring='sensor.php?query=temperature&order=asc&sensor=0&date_earliest='+dateToString(startDate)+'&date_latest='+dateToString(endDate)+"&group=minute";
	
	var processData = function (data) {
		for(var i = 0; i < data.length; i++)
		{

			var dateOData = new Date(data[i].time);
			var values = [[dateOData.getHours(),dateOData.getMinutes(),dateOData.getSeconds(),0],null,null,null,null,null,null,null];
			values[minusDays+1] = parseFloat(data[i].temperature);
			datatable.addRow(values);
		}
		
		plotTemperatureWeekOverlaySub(element, minusDays + 1,datatable);
	};

	$.getJSON(querystring, processData);
}
var plotTemperatureWeekOverlay = function(element) {

	var datatable = new google.visualization.DataTable();
	// time (HH:MM) Today, -1d, -2d, -3d, -4d, -5d, -6d
	datatable.addColumn('timeofday',"Time");
	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(0);
	tomorrow.setMinutes(0);
	tomorrow.setSeconds(0);
	tomorrow.setMilliseconds(0);
	
	for(var i = 0; i < 7; i++)
	{
		tomorrow.setDate(tomorrow.getDate() - 1);
		datatable.addColumn('number',tomorrow.getDate()+" "+months[tomorrow.getMonth()]);
	}

	plotTemperatureWeekOverlaySub(element,0,datatable);
}

var plotElectricityGraphBetween = function(element, grouping, startTime, endTime){

	var querystring ='sensor.php?query=electricity&order=asc&date_earliest='+startTime+'&date_latest='+endTime+"&group="+grouping 
	$.getJSON(querystring, function (data) {
		var datatable = new google.visualization.DataTable();
		datatable.addColumn('datetime','Time');
		datatable.addColumn('number','Main (Watts)');
		datatable.addColumn('number','Eco7 (Watts)');

		var values = [];
		for(var i = 0; i < data.length; i++)
		{
			var date = new Date(data[i].time);
			var sensorid = parseInt(data[i].sensorid);
			var value = parseFloat(data[i].consumption);
			switch(parseInt(data[i].channelid))
			{
				case 1:
					values.push([date,value,null]);
				break;

				case 2:
					values.push([date,null,value]);
				break;
			}
		}

		datatable.addRows(values);
		var chart = new google.visualization.LineChart(document.getElementById(element));
		chart.draw(datatable,{title: "Electricity Consumption",interpolateNulls: true});
	});

}

var plotTemperatureGraphBetween = function(element, grouping, startTime, endTime){

	$.getJSON('sensor.php?query=temperature&order=asc&date_earliest='+startTime+'&date_latest='+endTime+"&group="+grouping, function (data) {
		var datatable = new google.visualization.DataTable();
		datatable.addColumn('datetime','Time');
		datatable.addColumn('number','Lounge (Celcius)');
		datatable.addColumn('number','Bedroom (Celcius)');

		var values = [];
		for(var i = 0; i < data.length; i++)
		{
			var date = new Date(data[i].time);
			var sensorid = parseInt(data[i].sensorid);
			var value = parseFloat(data[i].temperature);
			if(sensorid == 0)
			{
				values.push([date,value,null]);
			}
			else if(sensorid == 100)
			{
				values.push([date,null,value]);
			}
		}

		datatable.addRows(values);
		var chart = new google.visualization.LineChart(document.getElementById(element));
		chart.draw(datatable,{title: "Temperature",interpolateNulls: true});
	});

}
var plotHumidityGraphBetween = function(element, grouping, startTime, endTime){

	$.getJSON('sensor.php?query=humidity&order=asc&date_earliest='+startTime+'&date_latest='+endTime+"&group="+grouping, function (data) {
		var datatable = new google.visualization.DataTable();
		datatable.addColumn('datetime','Time');
		datatable.addColumn('number','Bedroom (%)');

		var values = [];
		for(var i = 0; i < data.length; i++)
		{
			var date = new Date(data[i].time);
			var sensorid = parseInt(data[i].sensorid);
			var value = parseFloat(data[i].humidity);
			if(sensorid == 100)
			{
				values.push([date,value]);
			}
		}

		datatable.addRows(values);
		var chart = new google.visualization.LineChart(document.getElementById(element));
		chart.draw(datatable,{title: "Humidity",interpolateNulls: true});
	});

}

var last = function(days) {
	var then = new Date();
	then.setDate(then.getDate() - days);
	return then;
}

