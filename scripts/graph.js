var baseUrl = "query/?out=json";

var plot = function (div, type, startDate,aggregation) {
	var datestring = startDate.toISOString();
	var url = baseUrl + "&type="+type+"&timegt="+datestring+"&aggregation="+aggregation;

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
			row[0] = d;
			
			if(values.length > 0 && values[values.length-1][0].getTime() == d.getTime())
			{
				values[values.length-1][plotindices["sensor"+data[k].sensor]] = data[k].value;
			}
			else
			{
				for(var j = 1; j < i; j++)
				{
					if(plotindices["sensor"+data[k].sensor] == j)
					{
						row[j] = data[k].value;
					}
					else
					{
						if(k == data.length-1)
						{
							row[j] = null;
						}
						else
						{
							row[j] = values[values.length-1][j];
						}
					}
				}
				values.push(row);
			}
		}
		var graph = new Dygraph(div, values,{ "legend":"always","labels": labels, connectSeparatedPoints: true } );
	});
};

var producePlots = function() {
	$(".plot").each(function () {
		var type = $(this).attr("data-type");
		var hours = $(this).attr("data-hours");
		var aggregation = $(this).attr("data-aggregation");

		if(type == undefined || hours == undefined)
		{
			return;
		}
		
		var time = new Date();
		
		time.setTime(time.getTime() + (time.getTimezoneOffset()*60*1000) - (1000 * 3600 * hours));
		plot(this,type,time,aggregation);
	});
};
