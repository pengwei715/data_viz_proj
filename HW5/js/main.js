
// SVG drawing area
var margin = {top: 30, right: 20, bottom: 40, left: 80},
	width = 650 - margin.left - margin.right,
	height = 410 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// SVG Grroup
svg.append("g")
	.attr("class","x-axis axis")
	.attr("transform", "translate(0," + (height+10) + ")");

svg.append("g")
	.attr("class","y-axis axis")
	.attr("transform", "translate(-10," + "0" + ")");

// Scales
var x = d3.time.scale()
	.range([0, width]);
var y = d3.scale.linear()
	.range([height,0]);

// Axises
var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.tickFormat(formatDate);
var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

// LineFunction
var lineFunction = d3.svg.line()
	.interpolate("cardinal");

//D3 tip
var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
		return d.EDITION + "<br>"+ "Goals: " + d.GOALS;
	});

svg.call(tip);

// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// Initialize data
loadData();

/*/Alternative Slection
//Chart area (in d3) -- need to convert between the data key to a pretty version for the chart
var chartOptions = {
	GOALS: "Goals",
	AVERAGE_GOALS: "Average Goals",
	MATCHES: "Matches",
	TEAMS: "Teams",
	AVERAGE_ATTENDANCE: "Average Attendance",
	YEAR: "Year"
};
console.log(d3.keys(chartOptions));
console.log(d3.values(chartOptions));
*/

// FIFA world cup
var data;

// Load CSV file
function loadData() {
	d3.csv("data/fifa-world-cup.csv", function(error, csv) {

		csv.forEach(function(d){
			// Convert string to 'date object'
			d.YEAR = formatDate.parse(d.YEAR);
			
			// Convert numeric values to 'numbers'
			d.TEAMS = +d.TEAMS;
			d.MATCHES = +d.MATCHES;
			d.GOALS = +d.GOALS;
			d.AVERAGE_GOALS = +d.AVERAGE_GOALS;
			d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
		});

		// Store csv data in global variable
		data = csv;

		// Draw the visualization for the first time
		updateVisualization();
	});
}

// Select from the option box
d3.select("#data-type").on("change",function(){
	return updateVisualization();
});
d3.select("#filter").on("click",function(){
	return updateVisualization();
});

// Render visualization
function updateVisualization() {
	console.log(data);

	// Get the selected chart option
	var currentKey = d3.select("#data-type").property('value');
	console.log(currentKey);

	// Get selected time period

	dateKey1 = d3.select("#date-type1").property("value");
	dateKey2 = d3.select("#date-type2").property("value");
	console.log(dateKey1);
	console.log(dateKey2);

	// Filter data based on those time periods
	var newData = data.filter(function (el, index) {
		return (formatDate(el.YEAR) >= dateKey1);
	});

	var newData = newData.filter(function (el, index) {
		return (formatDate(el.YEAR) <= dateKey2);
	});
	console.log(newData);

	// Update scale domains
	x.domain(d3.extent(newData, function(d) { return d.YEAR; }));
	y.domain([0,d3.max(newData, function(d) { return d[currentKey]; })]);

	console.log(d3.max(newData, function(d) { return d[currentKey]}));

	// Deifine D3 SVG BAR
	svg.select(".x-axis")
		.transition()
		.duration(800)
		.call(xAxis);
	svg.select(".y-axis")
		.transition()
		.duration(800)
		.call(yAxis);

	//Line function
	lineFunction
		.x(function(d) { return x(d.YEAR); })
		.y(function(d) { return y(d[currentKey]); });

	var lineGraph = svg.selectAll("path")
		.data(data);

	// Delete old bars
	lineGraph
		.exit().transition(800).style("opacity",0.2).remove();

	// Add new bars
	lineGraph.enter().append("path");

	lineGraph.select(".line")
		.attr("cx", function(d) {return x(d.YEAR);})
		.attr("cy", function(d) {return y(d[currentKey]);})
		.transition()
		.duration(800)
		.attr("d", lineFunction(newData));

	svg.append("path")
		.attr("class", "line")
		.attr("d", lineFunction(newData));

	// Circles (another points for tooltips)
	var circle = svg.selectAll("circle").data(newData);
	var sel = document.getElementById('data-choice');
	y_text = sel.options[sel.selectedIndex].text;

	//Enter
	circle.enter().append("circle")
		.attr("class", "tooltip-circle");

		//Update
	circle
		.transition()
		.duration(800)
		.attr("r",function(d){return 5;})
		.attr("cx",function(d){return x(d.YEAR)})
		.attr("cy",function(d){return y(d[currentKey])});

	// Call Table Function
	document.getElementById("content-0").innerHTML = "Click on a circle for more information";
	circle
		.style("pointer-events", "all")
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		.on("mousemove",function(d,i){
			document.getElementById("content-0").innerHTML = formatDate(d.YEAR) +  " FIFA World Cup ";
			document.getElementById("content-1").innerHTML = d.WINNER;
			document.getElementById("content-2").innerHTML = d.GOALS;
			document.getElementById("content-3").innerHTML = d.AVERAGE_GOALS;
			document.getElementById("content-4").innerHTML = d.MATCHES;
			document.getElementById("content-5").innerHTML = d.TEAMS;
			document.getElementById("content-6").innerHTML = d.AVERAGE_ATTENDANCE;
			document.getElementById("content-7").innerHTML = d.LOCATION;
		});
	//Exit
	circle.exit().remove();
}

// Show details for a specific FIFA World Cup
function showEdition(){

}
