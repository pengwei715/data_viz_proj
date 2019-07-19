/******** Designer Maria Schwarz ********/


Timeline = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.eventdata = _data;
	var iso = d3.time.format.iso;

	// Create aggregate data by time of year
	this.eventtimeline = d3.nest()
		.key(function(d){return d.Date;})
		.rollup(function(d){return d.length})
		.entries(this.eventdata);

	this.eventtimeline.forEach(function(d){
		d.key = iso.parse(d.key);
	});

	// -------------------------------------------------------------------------
	// Create a cumulative and a single day version  - to switch between views
	// -------------------------------------------------------------------------
	var nest = this.eventtimeline;
	var nest = nest.map(function(d) {
		var filtered = nest.filter(function(v){return v.key <= d.key;});
		return {key: d.key, values: d3.sum(filtered, function(h){return h.values;})};
	});
	this.eventtimelinebyday = this.eventtimeline;
	this.eventtimelinecumulative = nest;
	this.eventtimeline = this.eventtimelinecumulative;


	// -------------------------------------------------------------------------
	// Initialize :)
	// -------------------------------------------------------------------------
	this.initVis();
};


Timeline.prototype.initVis = function(){
	var vis = this;

	// -------------------------------------------------------------------------
	// SVG Drawing area
	// -------------------------------------------------------------------------

	vis.margin = {top: 10, right: 0, bottom: 20, left: 60};
	vis.width = $("#"+vis.parentElement).width() - vis.margin.left - vis.margin.right;
	vis.height = 80 - vis.margin.top - vis.margin.bottom;

	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
		.attr("width", vis.width + vis.margin.left + vis.margin.right)
		.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
		.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// Overlay with path clipping
	vis.svg.append("defs").append("clipPath")
		.attr("id", "clip")
		.append("rect")
		.attr("width", vis.width)
		.attr("height", vis.height);


	// -------------------------------------------------------------------------
	// Scales and axes
	// -------------------------------------------------------------------------
	vis.x = d3.time.scale()
		.range([0, vis.width])
		.domain(d3.extent(vis.eventtimeline, function(d) { return d.key; }));

	vis.y = d3.scale.linear()
		.range([vis.height, 0])
		.domain([0, d3.max(vis.eventtimeline, function(d) { return d.values; })]);

	vis.xAxis = d3.svg.axis()
		.scale(vis.x)
		.orient("bottom")
		.tickFormat(d3.time.format("%b-%y"))
		.ticks(d3.time.month, 6);

	vis.yAxis = d3.svg.axis()
		.scale(vis.y)
		.orient("left")
		.tickFormat(d3.format("s"))
		.ticks(3);


	// -------------------------------------------------------------------------
	// Background highlights
	// -------------------------------------------------------------------------	//

	var dateformat = d3.time.format("%m-%d-%Y");

	vis.highlights = [['03-16-2011', '03-30-2011'], // 1
		['05-01-2011', '05-30-2011'], // 2
		['12-01-2011', '12-30-2011'], // 3
		['07-01-2012', '07-30-2012'], // 4
		['03-01-2013', '03-30-2013'], // 5
		['01-01-2014', '02-01-2014'], // 6
		['09-01-2014', '09-15-2014'], //7
		['09-16-2014', '10-10-2014'], //8
		['10-15-2014', '11-30-2014'], //9
		['01-01-2015', '01-29-2015'], //10
		['01-30-2015','02-28-2015']]; //11
	vis.highlighttexts = ['Mar 2011: Security forces shoot', // 1
		'May 2011: Army tankers crushing anti-', // 2
		'Dec 2011: Twin suicide bombings', // 3
		'Jul 2012: Rebels push the', // 4
		'Mar 2013: Conflict erupts in Raqqa', // 5
		'Jan 14: ISIS attacks Raqqa', //6
		'Sep 2014: US launches airstrikes', //7
		'Sep 2014: Kurdish forces push', //8
		'Fall 2014: Lebanon and Jordan close',//9
		'Jan 15: After losing Kobani, ISIS',//10
		'2015: Refugee numbers in Turkey']; //11

	vis.highlighttexts2 = ['protestors in Southern City Deraa', // 1
		'regime protests in various cities.', //2
		'outside Damascus kill 44.', //3
		'government out of Aleppo', //4
		'after rebels seize control.', //5
		'and Aleppo', //6
		'against ISIS in Aleppo & Raqqa.', //7
		'ISIS out of Kobani.', //8
		'borders and/or impose restrictions.', //9
		'keeps attacking key cities.', //10
		'are increasing rapidly.']; //11

	vis.timestamps = vis.svg.selectAll(".highlights")
		.data(vis.highlights)
		.enter().append('rect')
		.attr("class", "highlights")
		.attr("fill", "red")
		.attr("opacity", 0.1)
		.attr("x",function(d){return vis.x(dateformat.parse(d[0]));})
		.attr("width",function(d){return vis.x(dateformat.parse(d[1]))-vis.x(dateformat.parse(d[0]));})
		.attr("y", 0)
		.attr("height", vis.height);



	// -------------------------------------------------------------------------
	// Path generators
	// -------------------------------------------------------------------------

	// SVG area path generator: baseline
	vis.area = d3.svg.area()
		.x(function(d) { return vis.x(d.key); })
		//.x(function(d) { return vis.x(iso.parse(d.key)); })
		.y0(vis.height)
		.y1(function(d) { return vis.y(d.values); });

	vis.svg.append("path")
		.datum(vis.eventtimeline)
		.attr("class", "baselinearea")
		.attr("fill", "darkgrey")
		.attr("d", vis.area);

	// SVG area path generator: overlay (time passed; will be updated with data wrangling)
	vis.areaselect = d3.svg.area()
		.x(function(d) { return vis.x(d.key); })
		//.x(function(d) { return vis.x(iso.parse(d.key)); })
		.y0(vis.height)
		.y1(function(d) { return vis.y(d.values); });

	vis.svg.append("path")
		.datum(vis.eventtimeline)
		.attr("class", "timelineoverlay")
		.attr("fill", "red")
		.attr("d", vis.areaselect);

	// -------------------------------------------------------------------------
	// Initialize brush event
	// -------------------------------------------------------------------------

	vis.brushcounter = 0;

	vis.xContext = d3.time.scale()
		.range([0,vis.width])
		.domain(d3.extent(vis.eventtimeline, function(d) { return d.key; }));

	vis.brush = d3.svg.brush()
		.x(vis.xContext)
		.extent([0, 0])
		.on("brush", brushed_violencemap);

	vis.slider = vis.svg.append("g")
		.attr("class", "slider")
		.call(vis.brush);

	vis.slider.selectAll(".extent,.resize")
		.remove();

	vis.slider.select(".background")
		.attr("height", vis.height);

	vis.handle = vis.slider.append("rect")
		.attr("class", "handle")
		//.attr("transform", "translate(0," + vis.height + ")")
		.attr("width", 4)
		.attr("height", vis.height)
		.attr("y", 0);

	vis.svg.append("g")
		.attr("class", "x-axis axis timeline-axis")
		.attr("transform", "translate(0," + vis.height + ")")
		.call(vis.xAxis);

	vis.svg.append("g")
		.attr("class", "y-axis axis timeline-axis")
		.call(vis.yAxis);

	vis.wrangleData();
};


Timeline.prototype.wrangleData = function() {
	var vis = this;
	vis.displayData = vis.eventtimeline.filter(function(d){return d.key <= vis.currentTime;})
	vis.updateVis();
};


Timeline.prototype.updateVis = function(){
	var vis = this;
	vis.svg.select(".timelineoverlay")
		.datum(vis.displayData)
		.attr("fill", "red")
		.attr("d", vis.areaselect);
};



