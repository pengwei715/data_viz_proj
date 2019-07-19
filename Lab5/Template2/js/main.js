// Initialize data
loadData();

// Coffee chain data
var data;

// Load CSV file
function loadData() {
	d3.csv("data/coffee-house-chains.csv", function(error, csv) {

		csv.forEach(function(d){
			d.revenue = +d.revenue;
			d.stores = +d.stores;
		});

		// Store csv data in global variable
		data = csv;

    // Draw the visualization for the first time
		updateVisualization();
	});
}

// SVG drawing area
var margin = {top: 20, right: 10, bottom: 40, left: 60};
var padding = 100;
var width = 960 - margin.left - margin.right;
	height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
	.attr("width",width + margin.left + margin.right )
	.attr("height",height + margin.top + margin.bottom)
	.append("g")
	.attr("transform","translate(" + margin.left + "," + margin.top+")");

// Append a Group for scales
var xAxisGroup = svg.append("g")
	.attr("class","x-axis axis")
	.attr("transform", "translate(0," + height + ")");

var yAxisGroup = svg.append("g")
	.attr("class","y-axis axis")
	.attr("transform", "translate(-1," + 0.1 + ")");

// Render visualization;
//Sort function
valueKey = 1;
d3.select("#change-sorting").on("click",function(){
	valueKey = valueKey*(-1);
	console.log(valueKey);
	return updateVisualization();
});

d3.select("#ranking-type").on("change",function(){
	return updateVisualization();
});

function updateVisualization() {
  console.log(data);

	var currentKey = d3.select("#ranking-type").property('value');
	console.log(currentKey);

	data.sort(function(a,b){
		if (valueKey==1){
			return b[currentKey] - a[currentKey];
		}
		else{
			return a[currentKey] - b[currentKey];
		}
	});

	// Scales
	// Y-Scale
	var yScale = d3.scale.linear()
		.domain([0,d3.max(data,function(d){return d[currentKey]})])
		.rangeRound([height,0]);

	// X-Scale
	var xScale = d3.scale.ordinal()
		.domain(data.map(function(d) {return d.company; }))
		.rangeRoundBands([0, width], .1);

	// Axises
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

	// Deifine D3 SVG BAR
	svg.select(".x-axis")
		.transition()
		.duration(3000)
		.call(xAxis);
	svg.select(".y-axis")
		.transition()
		.duration(800)
		.call(yAxis);

	svg.selectAll("rect").remove();

	var bar = svg
		.selectAll("rect")
		.data(data, function(d){return d.company});

	//Enter
	bar.enter().append("rect");

	//Update -- that can potentially change
	bar
		.transition()
		.duration(800)
		.style("opacity",0.8)
		.attr("class","bar")
		.attr("x", function(d) { return xScale(d.company); })
		.attr("width", xScale.rangeBand())
		.attr("y", function(d) { return yScale(d[currentKey]); })
		.attr("height", function(d) { return height - yScale(d[currentKey]) });
	//Exit
	bar.exit().remove();

	//Text
	svg.selectAll(".axis-title").remove();
	var text = svg.append("text")
		.transition()
		.duration(800)
		.attr("class","axis-title")
		.attr("x",-40)
		.attr('y',-10)
		.text(currentKey);
}

//function to change data
//currentKey = "stores";

