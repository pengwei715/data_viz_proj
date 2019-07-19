// SVG Size
var margin = {top: 10, right:10, bottom: 30, left:30};
var padding = 22;
var w = 900 - margin.left - margin.right;
var h = 500 - margin.top - margin.bottom;

// Load CSV file
d3.csv("data/wealth-health-2014.csv", function(data){
	data2 = data;
	data2.forEach(function(d){
		d.Income = +d.Income;
		d.LifeExpectancy = +d.LifeExpectancy;
		d.Population = +d.Population;
	});

	data2.sort(function (a, b) {
		return b.Population - a.Population;
	});

	// Analyze the dataset in the web console
	console.log(data2);
	console.log("Countries: " + data2.length);

	//Activity 1
	var svg = d3.select("#chart-area").append("svg:svg")
				.attr("width",w + margin.left + margin.right )
				.attr("height",h + margin.top + margin.bottom);

	var group = svg.append("g")
		.attr("transform","translate(" + margin.left + "," + margin.top+")");

	var incomeScale = d3.scale.log()
						.domain([Math.round(d3.min(data2,function(d){return (d.Income);})-100)
							,d3.max(data2,function(d){return d.Income;})])
						.range([0,w]);
	//Linear
	//var incomeScale = d3.scale.log()
	//					.domain([0,d3.max(data2,function(d){return d.Income;})])
	//					.range([0,w-padding])
	//					.nice();

	var lifeExpectancyScale = d3.scale.linear()
								.domain([d3.min(data2,function(d){return d.LifeExpectancy;})
									,d3.max(data2,function(d){return d.LifeExpectancy;})])
								.range([h-padding,0])
								.nice();

	//Activity 3
	var popScale = d3.scale.linear()
		.domain([d3.min(data2,function(d){return d.Population}),
			d3.max(data2,function(d){return d.Population})])
		.range([4,30]);

	var colorPalette = d3.scale.category10();
	colorPalette.domain(data2.map(function(d){
		return d.Region;
	}));

	//text the scale functions]
	var maxX=d3.max(data2,function(d){
		return d.Income
	});
	var maxY=d3.max(data2,function(d){
		return d.LifeExpectancy;
	});
	console.log(maxX);
	console.log(maxY);

	console.log(incomeScale(133563));
	console.log(lifeExpectancyScale(84));

	var circle = group.selectAll("circle")
		.data(data2)
		.enter().append("circle")
		.attr("cx",function(d){
			return incomeScale(d.Income);
		})
		.attr("cy",function(d){
			return lifeExpectancyScale(d.LifeExpectancy);
		})
		.attr("r",function(d){
			return popScale(d.Population);
		})
		.attr("fill",function(d){
			return colorPalette(d.Region);
		})
		.attr("class", "scatter-plot");

	//Activity 2
	var xAxis = d3.svg.axis()
		.scale(incomeScale)
		.orient("bottom")
		.tickValues([1000,2000,4000,8000,16000,32000,100000])
		.tickFormat(d3.format(",d"));

	var yAxis = d3.svg.axis()
					.scale(lifeExpectancyScale)
					.orient("left")
					.ticks(10)

	var axisX = svg.append("g")
		.attr("class","axis x-axis")
		.attr("transform","translate(" + (margin.left-1) + "," + (h-margin.top-0.5) +")")
		.call(xAxis);

	var axisY = svg.append("g")
		.attr("class","axis y-axis")
		.attr("transform","translate("+(margin.left-1)+","+(margin.top+0.5)+")")
		.call(yAxis);

	var xLable = svg.append("g")
		.attr("transform","translate("+(w-padding*4)+","+(h-padding)+")")
		.append("text")
		.attr("class","axis-label")
		.style("text-anchor", "middle")
		.text("Income per Person (GDP per Capita)");

	var yLable = svg.append("g")
		.attr("transform","translate("+ padding*2 +","+padding*2.5+")")
		.append("text")
		.attr("class","axis-label")
		.attr("transform",'rotate(-90)')
		.style("text-anchor", "middle")
		.text("Life Expectancy");
});
