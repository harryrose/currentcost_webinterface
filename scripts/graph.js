var baseUrl = "query/?out=json";

var plot = function (div, type, startDate) {
	var datestring = startDate.toISOString();
	var url = baseUrl + "&type="+type+"&timegt="+datestring;

	$.getJSON(url, function(data) {
		var values = [];
		var plotindices = {};
		var i = 1;
		var labels = ["Time"];

	
		for(var k = data.length -1; k >= 0; k --)
		{	
			if(! ("sensor"+data[k].sensor in plotindices))
			{
				labels[i] = "Sensor "+data[k].sensor;
				plotindices["sensor"+data[k].sensor] = i ++;
			}
		}
		for(var k = data.length -1; k >= 0; k --)
		{
			var d = new Date(data[k].time);
			var row = [];
			for(var j = 0; j < i; j++) row[j] = null;

			row[0] = d;
			row[ plotindices["sensor"+data[k].sensor] ] = data[k].value;
			values.push(row);
		}
		var graph = new Dygraph(div, values,{ "legend":"always","labels": labels, connectSeparatedPoints: true } );
	});
};

var producePlots = function() {
	$(".plot").each(function () {
		var type = $(this).attr("data-type");
		var hours = $(this).attr("data-hours");

		if(type == undefined || hours == undefined)
		{
			return;
		}
		
		var time = new Date();
		
		time.setTime(time.getTime() + (time.getTimezoneOffset()*60*1000) - (1000 * 3600 * hours));
		plot(this,type,time);
	});
};