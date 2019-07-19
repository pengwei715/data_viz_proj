
// SVG drawing area
var margin = {top: 40, right: 40, bottom: 60, left: 60};
var width = 600 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
var svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Initialize data
loadData();

// FIFA world cup
var data;



// Scales
var xScale = d3.time.scale()
	.range([0, width]);
var yScale = d3.scale.linear()
	.range([height, 0]);

// Axes
var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom")
	.ticks(3);
var x_group = svg.append("g")
	.attr("class", "axis x-axis")
	.attr("transform", "translate(0,"+(height)+")");

var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("left")
	.ticks(8);
var y_group = svg.append("g")
	.attr("class", "axis y-axis")
	.attr("transform", "translate(0,0)");
//.call(yAxis);

var y_title = y_group.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 0)
	.attr("x", -(height)/2)
	.attr("dy", "-3.5em")
	.style("text-anchor", "middle");

// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

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

var chartValue;
d3.select("#data-choice").on("change", function(){
	console.log("New selection.");
	updateVisualization();});

var transitionDuration = 1000;
var transitionType = "circle";



//-----------------------------------------------------------------------------
// Initializing Line chart
//-----------------------------------------------------------------------------

// Initialize data
chartValue = d3.select("#data-choice").property("value");
var line = d3.svg.line().interpolate("monotone")
	.x(function (d) {return xScale(d.YEAR);})
	.y(function (d) {return yScale(d[chartValue]);});




//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// UPDATE FUNCTION
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

// Render visualization
function updateVisualization() {
	
	console.log(data);
	//-----------------------------------------------------------------------------
	// Initialize
	//-----------------------------------------------------------------------------


	data.sort(function(a, b) { return b.YEAR - a.YEAR; });

	// Domains
	chartValue = d3.select("#data-choice").property("value");
	xScale.domain(d3.extent(data, function(d){return d.YEAR}));
	yScale.domain([0, d3.max(data, function(d){return d[chartValue]})]);
	console.log(chartValue + ", MAX: "+yScale(d3.min(data, function(d){return d[chartValue]})));

	//-----------------------------------------------------------------------------
	// Line chart
	//-----------------------------------------------------------------------------


	// Initialize data
	var line = d3.svg.line().interpolate("monotone")
		.x(function (d) {return xScale(d.YEAR);})
		.y(function (d) {return yScale(d[chartValue]);});


	// Initialize
	//path = svg.selectAll('path').data([data, function(d){return d.YEAR;}]);
	path = svg.selectAll('path').data([data]);

	// Enter
	//path.enter().append('path').attr("class", "line path").attr('d', line);
	//line.y(function (d) {return yScale(d[chartValue]);});
	path.enter().append('path').attr("class", "line path").attr('d', line);

	//path.append('path').attr("class", "line path").attr('d', line);

	// Update
	line.y(function (d) {return yScale(d[chartValue])-height;});
	path.attr("class", "line path").transition().duration(2000).attr("class", "line path").attr('d', line);

	// Exit
	//path.exit().remove();

	//-----------------------------------------------------------------------------
	// Key function / data-join
	//-----------------------------------------------------------------------------
	var circles = svg.selectAll("circle")
	 	.data(data, function(d, index){return d.YEAR});

	//-----------------------------------------------------------------------------
	// Enter
	//-----------------------------------------------------------------------------
	circles.enter().append("circle")
		.attr("class", "circle")
		.attr("fill", "#707086")
		.attr("cx", function(d) { return xScale(d.YEAR); })
		.attr("r", (width/data.length)/4)
		;

	//-----------------------------------------------------------------------------
	// Update
	//-----------------------------------------------------------------------------

	/*if (selectedValue=="stores"){y.domain([0, d3.max(data, function(d){return d.stores})]);}
	else {y.domain([0, d3.max(data, function(d){return d.revenue})]);}*/

	circles
		.style("opacity", 0.5)
		.transition(transitionType)
		.duration(transitionDuration)
		//.attr("cx", function(d) { return xScale(d.YEAR); })
		.attr("cy", function(d) {return yScale(d[chartValue])})
		.style("opacity", 0.8)
		.transition(transitionType)
		.duration(transitionDuration);

	//-----------------------------------------------------------------------------
	// Exit
	//-----------------------------------------------------------------------------

	circles.exit().transition(transitionType).duration(transitionDuration).remove();


	//-----------------------------------------------------------------------------
	// Axis update
	//-----------------------------------------------------------------------------

	// Axis
	x_group
		.transition(transitionType)
		.duration(transitionDuration)
		.call(xAxis)
		.selectAll("text")
		.style("text-anchor", "middle")
		.attr("dx", 0)
		.attr("dy", "1.5em");
	y_group
		.transition(transitionType)
		.duration(transitionDuration)
		.call(yAxis);

	y_title
		.transition(transitionType)
		.duration(transitionDuration)
		.text("abc");

}


// Show details for a specific FIFA World Cup
function showEdition(d){
	
}
