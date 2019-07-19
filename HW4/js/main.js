// Load CSV file
// TO CREATE AN AREA CHART
d3.csv("data/zaatari-refugee-camp-population.csv", function(data){
	data2 = data;
	var formatDate = d3.time.format("%Y-%m-%d");
	var date_format = d3.time.format("%b %Y");
	data2.forEach(function(d){
		d.population = +d.population;
		d.date = formatDate.parse(d.date);
	});
	// Analyze the dataset in the web console
	console.log(data2);
	console.log("Length: " + data.length);

	// Create SVG for CHART (left column)
	// SVG Size
	var margin = {top: 40, right:40, bottom:50, left:40};
	var padding = 10;
	var width = 700 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	// Define Scales
	// Y-Scale
	var populationScale = d3.scale.linear()
		.domain([0,d3.max(data2,function(d){return d.population;})])
		.rangeRound([height,0]);

	// X-Scale
	var dateScale = d3.time.scale()
		.domain(d3.extent(data2, function(d) { return d.date; }))
		.range([0,width]);

	// Deifine D3 SVG AREA
	var svg = d3.select("#chart-area").append("svg")
		.attr("width",width + margin.left + margin.right )
		.attr("height",height + margin.top + margin.bottom)
		.append("g")
		.attr("transform","translate(" + margin.left + "," + margin.top+")");


	var area = d3.svg.area()
		.x(function(d) { return dateScale(d.date); })
		.y0(height)
		.y1(function(d) { return populationScale(d.population); });

	svg.append("path")
		.datum(data2)
		.attr("class", "area")
		.attr("d", area);

	// Axes
	var xAxis = d3.svg.axis()
		.scale(dateScale)
		.orient("bottom")
		.tickFormat(date_format);

	var yAxis = d3.svg.axis()
		.scale(populationScale)
		.orient("left")
		.ticks(10)
		.tickFormat(d3.format("s"));

	svg.append("g")
		.attr("class", "xaxis axis")
		.attr("transform", "translate(0.5," + (height+0.5) + ")")
		.call(xAxis);

	svg.append("g").attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.attr("class", "yaxis axis")
		.attr("transform", "translate(0.5," + 0.5 + ")")
		.call(yAxis)
		.append("text")
		.attr("class","axis-label")

		.text("Population");

	// Change x-axis text
	svg.selectAll(".xaxis text")  // select all the text elements for the xaxis
		.attr("transform", function(d) {
			return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-20)";
		});

	// Add Chart title
	svg.append("g")
		.attr("transform", "translate("+width/2 + "," + margin.top/2 + ")")
		.append("text")
		.attr("class","chart-title")
		.style("text-anchor", "middle")
		.text("Camp Population");


	//********************************************************************************
	// tooltip
	var bisectDate = d3.bisector(function(d) { return d.date; }).left; // **
	var focus = svg.append("g")                            // **********
		.style("display", "none");

	// append the x line
	focus.append("line")
		.attr("class", "x")
		.style("stroke", "black")
		.style("stroke-dasharray", "4,4")
		.style("opacity", 0.8)
		.attr("y1", 0)
		.attr("y2", height);

	// append the y line
	focus.append("line")
		.attr("class", "y")
		.style("stroke", "black")
		.style("stroke-dasharray", "4,4")
		.style("opacity", 0.8)
		.attr("x1", width)
		.attr("x2", width);

	// append the circle at the intersection
	focus.append("circle")
		.attr("class", "y")
		.style("fill", "#FFC2AA")
		.style("stroke", "red")
		.style("stroke-width", 2)
		.attr("r", 5);

	// place the value at the intersection
	focus.append("text")
		.attr("class", "y1")
		.style("stroke", "white")
		.style("stroke-width", "4px")
		.style("opacity", 0.8)
		.attr("dx", 10)
		.attr("dy", "-2em");
	focus.append("text")
		.attr("class", "y2")
		.attr("dx", 10)
		.attr("dy", "-2em");

	// place the date at the intersection
	focus.append("text")
		.attr("class", "y3")
		.style("stroke", "white")
		.style("stroke-width", "4px")
		.style("opacity", 0.8)
		.attr("dx", 8)
		.attr("dy", "-1em");
	focus.append("text")
		.attr("class", "y4")
		.attr("dx", 8)
		.attr("dy", "-1em");


	// append the rectangle to capture mouse
	svg.append("rect")
		.attr("width", width)
		.attr("height", height)
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function() { focus.style("display", null); })
		.on("mouseout", function() { focus.style("display", "none"); })
		.on("mousemove", mousemove);

	function mousemove() {
		var x0 = dateScale.invert(d3.mouse(this)[0]),
			i = bisectDate(data, x0, 1),
			d0 = data[i - 1],
			d1 = data[i],
			d = x0 - d0.date > d1.date - x0 ? d1 : d0;

		focus.select("circle.y")
			.attr("transform",
				"translate(" + dateScale(d.date) + "," +
				populationScale(d.population) + ")");

		focus.select("text.y1")
			.attr("transform",
				"translate(" + (dateScale(d.date)-40) + "," +
				populationScale(d.population) + ")")
			.text(d.population);

		focus.select("text.y2")
			.attr("transform",
				"translate(" + (dateScale(d.date)-40) + "," +
				populationScale(d.population) + ")")
			.text(d.population);

		focus.select("text.y3")
			.attr("transform",
				"translate(" + (dateScale(d.date)-40) + "," +
				populationScale(d.population) + ")")
			.text(formatDate(d.date));

		focus.select("text.y4")
			.attr("transform",
				"translate(" + (dateScale(d.date)-40) + "," +
				populationScale(d.population) + ")")
			.text(formatDate(d.date));

		focus.select(".x")
			.attr("transform",
				"translate(" + dateScale(d.date) + "," +
				populationScale(d.population) + ")")
			.attr("y2", height-populationScale(d.population));

		focus.select(".y")
			.attr("transform",
				"translate(" + width * -1 + "," +
				populationScale(d.population) + ")")
			.attr("x2", width + dateScale(d.date));
	}

});






// TO CREATE A BAR CHART

d3.csv("data/shelter.csv", function(data) {
	data2 = data;
	data2.forEach(function (d) {
		d.share = +d.share;
	});
	// Analyze the dataset in the web console
	console.log(data2);

	// Create SVG for bart chart (right column)
	// SVG Size
	var margin = {top: 40, right:5, bottom: 50, left:40};
	var padding = 10;
	var width = 500 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	// Y-Scale
	var shareScale = d3.scale.linear()
		.domain([0,1])
		.rangeRound([height,0]);

	// X-Scale
	var typeScale = d3.scale.ordinal()
		.domain(data2.map(function(d) { return d.type; }))
		.rangeRoundBands([0, width], .1);

	var xAxis = d3.svg.axis()
		.scale(typeScale)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(shareScale)
		.orient("left")
		.ticks(5, "%");

	// Deifine D3 SVG AREA
	var svg = d3.select("#bar-area").append("svg")
		.attr("width",width + margin.left + margin.right )
		.attr("height",height + margin.top + margin.bottom)
		.append("g")
		.attr("transform","translate(" + margin.left + "," + margin.top+")");

	svg.append("g")
		.attr("class", "xaxis axis")
		.attr("transform", "translate(1," + (height+1) + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "yaxis axis")
		.attr("transform", "translate(1," + 1 + ")")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Share of HH");

	var group = svg.append("g")
		.attr("transfrom","translate(0,0")
		.selectAll(".bar")
		.data(data2)
		.enter()

	var barchart = group.append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return typeScale(d.type); })
		.attr("width", typeScale.rangeBand())
		.attr("y", function(d) { return shareScale(d.share); })
		.attr("height", function(d) { return height - shareScale(d.share) });

	var percentFormat = d3.format("%");

	var barlabel=group.append("text")
		.attr("class","bar-label")
		.attr("x",function(d) { return typeScale(d.type)+padding*5.5; })
		.attr("y", function(d) { return shareScale(d.share)-padding; })
		.text(function(d){
			return percentFormat(d.share);
		})

	// Add Chart title
	svg.append("g")
		.attr("transform", "translate("+width/2 + "," + margin.top/2 + ")")
		.append("text")
		.attr("class","chart-title")
		.style("text-anchor", "middle")
		.text("Type of Shelter");
});