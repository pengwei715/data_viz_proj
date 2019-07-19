
// SVG drawing area
var margin = {top: 30, right: 20, bottom: 40, left: 80},
	width = 650 - margin.left - margin.right,
	height = 410 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Circle image
svg.append("defs").attr("id", "mdef")
	.append("pattern")
	.attr("id", "image")
	.attr("x", 0).attr("y", 0)
	.attr("height", 20)
	.attr("width", 20)
	.append("image")
	.attr("x", 0).attr("y", 0)
	.attr("height", 20).attr("width", 20)
	.attr("xlink:href", "http://images.clipartpanda.com/soccer-ball-clipart-soccer-ball-clip-art-4.png");

//SVG Grroup
svg.append("g")
	.attr("class","x-axis axis")
	.attr("transform", "translate(0," + (height+10) + ")");

svg.append("g")
	.attr("class","y-axis axis")
	.attr("transform", "translate(-10," + "0" + ")");

// Initialize data
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

// Date parser
var formatDate = d3.time.format("%Y");

// Load data
loadData();

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

	// Make sure the starting year is larger than the ending year
	if (+dateKey1>=+dateKey2){
		alert("Error: Please make sure your start year is before your end year.");
		return;}

	// Filter data based on those time periods
	var newData = data.filter(function (el, index) {
		return (formatDate(el.YEAR) >= dateKey1 && formatDate(el.YEAR) <= dateKey2);
	});
	console.log(newData);

	// Update scale domains
	x.domain(d3.extent(newData, function(d) { return d.YEAR; }));
	y.domain([0,d3.max(newData, function(d) { return d[currentKey]; })]);

	// Deifine D3 SVG BAR
	svg.select(".x-axis")
		.transition()
		.duration(800)
		.call(xAxis);
	svg.select(".y-axis")
		.transition()
		.duration(800)
		.call(yAxis);

	// Text for y_title
	var sel = document.getElementById('data-type');
	y_text = sel.options[sel.selectedIndex].text;
	svg.selectAll(".axis-title").remove();
	var text = svg.append("text")
		.transition()
		.duration(800)
		.attr("class","axis-title")
		.attr("x",-40)
		.attr('y',-10)
		.text(y_text);

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
	lineGraph.enter().append("path").attr("class", "line");

	svg.select(".line")
		.transition()
		.duration(800)
		.attr("class", "line")
		.attr("d", lineFunction(newData));

	// Circles (another points for tooltips)
	var circle = svg.selectAll("circle").data(newData);

	//Enter
	circle.enter().append("circle")
		.attr("class", "tooltip-circle");

		//Update
	circle
		.transition()
		.duration(800)
		.attr("r",function(d){return 8;})
		.attr("cx",function(d){return x(d.YEAR)})
		.attr("cy",function(d){return y(d[currentKey])});

	// Call Table Function
	$("#content-0").text("Click on a circle for more information");

	document.getElementById("content-0").innerHTML = "Click on a circle for more information";
	circle
		.style("pointer-events", "all")
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		.on("click",showEdition);
	//Exit
	circle.exit().remove();
}

// Show details for a specific FIFA World Cup
var showEdition = function(d) {
	console.log(d);
	$("#content-0").text(formatDate(d.YEAR) +  " FIFA World Cup ");
	$("#content-1").text(d.WINNER);
	$("#content-2").text(d.GOALS);
	$("#content-3").text(d.AVERAGE_GOALS);
	$("#content-4").text(d.MATCHES);
	$("#content-5").text(d.TEAMS);
	$("#content-6").text(d3.format(",")(d.AVERAGE_ATTENDANCE));
	$("#content-7").text(d.LOCATION);
	d3.select(".selected").classed("selected", false);
	d3.select(this).classed("selected", true);
};
