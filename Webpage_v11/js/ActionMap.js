/******** Designer Lily Li ********/

ActionMap = function(_parentElement, _mapdata, refugee_current){
    this.parentElement = _parentElement;
    this.mapdata = _mapdata;
    this.refugee_current = refugee_current;
    this.displayData = []; // see data wrangling
    this.initVis();
};

ActionMap.prototype.initVis = function() {
    var vis = this;

    // -------------------------------------------------------------------------
    // Create Country Code Property
    // -------------------------------------------------------------------------

    vis.countryById = {};
    vis.refugee_current.forEach(function (d) {
        vis.countryById[d.code] = d;
    });

    // -------------------------------------------------------------------------
    // SVG Drawing area
    // -------------------------------------------------------------------------

    vis.margin = {top: 10, right: 10, bottom: 20, left: 0};
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.svg.append("rect")
        .attr("class", "background")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .on("click", clicked);

    vis.mapg = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");
        //.attr("transform", "translate(0,0)");

        // -------------------------------------------------------------------------
    // Initialize map projection
    // -------------------------------------------------------------------------
    vis.projection = d3.geo.mercator().translate([vis.width / 2, vis.height / 2]).scale(480).center([15, 45]);
    vis.path = d3.geo.path().projection(vis.projection);
    vis.graticule = d3.geo.graticule();

    // -------------------------------------------------------------------------
    // Dictionaries for optimal scaling / categories
    // -------------------------------------------------------------------------

    vis.selectValue = "refugee";

    vis.domaindict = {
        "refugee": [0,100000,250000, 500000, 1000000,d3.max(vis.refugee_current, function (d) {return d.refugee;})],
        "gdppc": [0, 5000, 10000, 20000, 40000,60000],
        "population": [30000, 5000000,10000000,20000000, 40000000,60000000],
        "per_gdppc": [0, 10, 50, 100, 150, 200],
        "per_1000pop": [0, 10, 30, 60, 100,160]
    };

    vis.xtickdict = {
        "refugee": [0,100000, 250000, 500000, 1000000, d3.max(vis.refugee_current, function (d) {return d.refugee;})],
        "gdppc": [0, 5000, 10000, 20000, 40000,60000, d3.max(vis.refugee_current, function (d) {return d.gdppc;})],
        "population": [30000, 5000000,10000000, 20000000, 40000000,60000000, d3.max(vis.refugee_current, function (d) {return d.population;})],
        "per_gdppc": [0, 10,50, 100, 150, 200, d3.max(vis.refugee_current, function (d) {return d.per_gdppc;})],
        "per_1000pop": [0,10, 30, 60, 100,160, d3.max(vis.refugee_current, function (d) {return d.per_1000pop;})]
    };

    vis.mapcolordict = {
        "refugee": colorbrewer.Reds["7"],
        "gdppc": colorbrewer.Purples["7"],
        "population": colorbrewer.Reds["8"],
        "per_gdppc": colorbrewer.Blues["7"],
        "per_1000pop": colorbrewer.Greens["7"]
    };

    // -------------------------------------------------------------------------
    // Color Scale
    // -------------------------------------------------------------------------

    vis.colorScale = d3.scale.threshold();

    vis.colorScale
        .domain(vis.domaindict[vis.selectValue])
        .range(vis.mapcolordict[vis.selectValue]);

    // ----------------------------------------------------------------------------------------
    // Countries
    // ----------------------------------------------------------------------------------------

    vis.countries = vis.mapg.selectAll(".land")
        .data(topojson.feature(vis.mapdata, vis.mapdata.objects.subunits).features);

    vis.countries
        .enter().append("path")
        .style("fill", function (d, i) {
            if (!vis.countryById[d.id] && d.id!= "SYR") {return "#bdbdbd"}
            else if (d.id === "SYR") { return "white"}
            else if (isNaN(vis.countryById[d.id][vis.selectValue])) {return "#bdbdbd"}
                else {return vis.colorScale(vis.countryById[d.id][vis.selectValue]);}
        })
        .attr("class", function(d,i){
            if (!vis.countryById[d.id] && d.id!= "SYR") {return "land landtransparent"}
            else if (d.id === "SYR") { return "land landshow"}
            else if (isNaN(vis.countryById[d.id][vis.selectValue])) {return "land landtransparent"}
            else {return "land landshow"}
        })
        .attr("d", vis.path)
        .attr("transform","translate(50,50)")
        .on("click", clicked);

    vis.mapg.insert("path", ".graticule")
        .datum(topojson.mesh(vis.mapdata, vis.mapdata.objects.subunits))
        .attr("class", "boundary")
        .attr("d", vis.path)
        .attr("transform","translate(50,50)");

    // ----------------------------------------------------------------------------------------
    // Legend
    // ----------------------------------------------------------------------------------------
    // key - adapted from http://bl.ocks.org/chule/ac6d94c9df9919fdd4f2

    vis.mapticks = d3.scale.linear()
        .domain([0, d3.max(vis.xtickdict[vis.selectValue])])
        .range([0, vis.height]);

    vis.xAxis = d3.svg.axis()
        .scale(vis.mapticks)
        .orient("left")
        .tickSize(13)
        .tickValues(vis.xtickdict[vis.selectValue])
        .tickFormat(function (d) {
            if (vis.selectValue == "refugee" || vis.selectValue == "gdppc" || vis.selectValue == "population") {
                return d3.format(".1s")(d);}
            else
            {return d3.round(d);}});

    vis.mapkey = vis.svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(50,20)");

    vis.mapkey.selectAll("rect")
        .data(vis.colorScale.range().map(function(d, i) {
            return {
                x0: i ? vis.mapticks(vis.colorScale.domain()[i - 1]) : vis.mapticks.range()[0],
                x1: i < vis.colorScale.domain().length ? vis.mapticks(vis.colorScale.domain()[i]) : vis.mapticks.range()[1],
                z: d
            };
        }))
        .enter().append("rect")
        .attr("width", 15)
        .attr("y", function(d) { return d.x0; })
        .attr("height", function(d) {return d.x1 - d.x0; })
        .style("fill", function(d) { return d.z; });

    vis.mapkey
        .attr("class", "x axis")
        .call(vis.xAxis)
        .append("text")
        .attr("class", "caption")
        .attr("y", 20)
        .attr("x",-450)
        .attr("transform", "rotate(-90)")
        .attr("dy", ".71em")
        .style("text-anchor", "start")
        .attr("fill","black")
        .text("Refugee Count");
    // key end

    // ----------------------------------------------------------------------------------------
    // Tooltips initialize
    // ----------------------------------------------------------------------------------------

    vis.tooltip = {
        element: null,
        init: function() {
            this.element = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
        },
        show: function(t) {
            this.element.html(t).transition().duration(200).style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY - 10 + "px").style("opacity", .9);
        },
        move: function() {
            this.element.transition().duration(30).ease("linear").style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY - 10 + "px").style("opacity", .9);
        },
        hide: function() {
            this.element.transition().duration(500).style("opacity", 0)
        }};

    vis.tooltip.init();

    // ----------------------------------------------------------------------------------------
    // Tooltips populate
    // ----------------------------------------------------------------------------------------

    vis.countries.on("mouseover", function (d, i) {

        // Show country information
        vis.tooltip.show(function () {
            if (!vis.countryById[d.id] && d.id!=="SYR") {
                vis.infowidth = 0;
                vis.infoheight = 0;
                vis.yValue = -50;
                return "<p>No information available</p>";
            }
            else if (d.id == "SYR") {
                vis.infowidth = 0;
                vis.infoheight = 0;
                vis.yValue = -50;
                return "<p class='tooltip-header'>Syria</p>";
            }
            else {
                vis.infowidth = 265;
                vis.infoheight = 90;
                vis.yValue = vis.mapticks(vis.countryById[d.id][vis.selectValue]);
             }
        });

        // To Create Circle to Indicate the value on the legend
        vis.indicator = vis.mapkey.append("circle")
            .attr("r", 6.3)
            .attr("cx", 8)
            .attr("cy", vis.yValue)
            .attr("fill","white")
            .attr("stroke","black")
            .attr("stroke-width", 1.5);

        // To create information box on the top-left hand side
        vis.box0 = vis.svg.append("rect")
            .attr("x",70)
            .attr("y", 20)
            .attr("width", function() {
                if (d.id == "MKD") {
                    return vis.infowidth + 80;
                }
                else {
                    return vis.infowidth;
                }
            })
            .attr("height",vis.infoheight)
            .attr("opacity",0.8)
            .attr("fill","white");

        vis.box1 = vis.svg
            .append("text")
            .attr("id","information")
            .attr("transform", "rotate(0)")
            .attr("y",  30)
            .attr("x", 80)
            .attr("dy", ".71em")
            .style("text-anchor", "start")
            .attr("fill","black")
            .text(function(){
                if (!vis.countryById[d.id]) {
                    return "";
                }
                else {
                    return vis.countryById[d.id]["destination"];}
            })
            .attr("font-size",18);

        vis.box2 = vis.svg
            .append("text")
            .attr("id","information")
            .attr("transform", "rotate(0)")
            .attr("y", 50)
            .attr("x", 80)
            .attr("dy", ".71em")
            .style("text-anchor", "start")
            .attr("fill","black")
            .text(function(){
                if (!vis.countryById[d.id]) {
                    return "";
                }
                else {
                    return "Refugee Count" + ":   " + d3.format(".2s")(vis.countryById[d.id]["refugee"])}
            })
            .attr("font-size",13);

        vis.box3 = vis.svg
            .append("text")
            .attr("id","information")
            .attr("transform", "rotate(0)")
            .attr("y", 70)
            .attr("x", 80)
            .attr("dy", ".71em")
            .style("text-anchor", "start")
            .attr("fill","black")
            .text(function(){
                if (!vis.countryById[d.id]) {
                    return "";
                }
                else {
                    return "Refugee over per Capita Income" + ":   " + d3.format(".2s")(vis.countryById[d.id]["per_gdppc"])}
            })
            .attr("font-size",13);

        vis.box4 = vis.svg
            .append("text")
            .attr("id","information")
            .attr("transform", "rotate(0)")
            .attr("y", 90)
            .attr("x", 80)
            .attr("dy", ".71em")
            .style("text-anchor", "start")
            .attr("fill","black")
            .text(function(){
                if (!vis.countryById[d.id]) {
                    return "";
                }
                else {
                    return "Refugee per 1000 Population" + ":   " + d3.format(".2s")(vis.countryById[d.id]["per_1000pop"])}
            })
            .attr("font-size",13);

        // To save the original color
        vis.color =  d3.rgb(d3.select(this).style("fill"));
        d3.select(this).style("fill", function() { return d3.rgb(vis.colorScale.range()[6]).darker(2);});});

        // Change map color when mouseover
    vis.countries.on("mousemove", function (d, i) {
        vis.tooltip.move();
        d3.select(this).style("fill", function () {
                if (!vis.countryById[d.id] && d.id !== "SYR") {
                    return "#bdbdbd"
                }
                else if (d.id == "SYR") {
                    return "white";
                    //return brighter(0)("yellow");
                }
                else {
                    return d3.rgb(d3.select(this).style("fill")).brighter(0);
                }
            })
            .on("mouseout", function (d, i) {
                vis.tooltip.hide();
                d3.select(this).style("fill", function () {
                    return vis.color;
                });
                vis.indicator.remove();
                vis.box0.remove();
                vis.box1.remove();
                vis.box2.remove();
                vis.box3.remove();
                vis.box4.remove();
            });
    });

    // ----------------------------------------------------------------------------------------
    // Map click-to-zoom via transform
    // ----------------------------------------------------------------------------------------
    // from https://bl.ocks.org/mbostock/2206590

    function clicked(d){
        vis.x = 0;
        vis.y = 0;
        vis.k = 1;

          if ((d && vis.centered !== d) && (vis.countryById[d.id] || d.id == "SYR")) {
                vis.centroid = vis.path.centroid(d);
                vis.x = vis.centroid[0];
                vis.y = vis.centroid[1];
                vis.k = 2;
                vis.centered = d;
            } else {
                vis.x = vis.width / 2;
                vis.y = vis.height / 2;
                vis.k = 1;
                vis.centered = null;
            }

            vis.mapg.selectAll("path");
                //.classed("active", vis.centered && function(d) { return d === vis.centered; });

            vis.mapg.transition()
                .duration(750)
                .attr("transform", "translate(" + vis.width / 2 + "," + vis.height / 2 + ")scale(" + vis.k + ")translate(" + -vis.x + "," + -vis.y + ")")
                .style("stroke-width", 1.5 / vis.k + "px");
        };

    // ----------------------------------------------------------------------------------------
    // Initiate the text on the left-hand side
    // ----------------------------------------------------------------------------------------
    $("#actionmap-content").html("<div class='am_textbox'><p>Small Distances. Big Hearts.<br><br>Turkey, Lebanon, and Jordan " +
        "received over 90% of total Syrian refugees since the war began.</p></div>");

    vis.wrangleData();
};

ActionMap.prototype.wrangleData = function(){
    var vis = this;
    vis.displayData = vis.refugee_current;

    // -------------------------------------------------------------------------
    // Update the graph based on choice
    // -------------------------------------------------------------------------

    d3.select("#refugee").on("click", function(){
        vis.selectValue = d3.select("#refugee").property("id");
        vis.selectTitle = d3.select("#refugee").property("value");
        $("#actionmap-content").html("<div class='am_textbox'><p>Small Distances. Big Hearts.<br><br>Turkey, Lebanon, and Jordan " +
            " received over 90% of total Syrian refugees since the war began.</p></div>");
        d3.selectAll('.am_button').classed('selected', false);
        d3.selectAll('.am_button_fix').classed('selected', false);
        d3.select(this).classed('selected',true);

        vis.updateVis();});

    d3.select("#per_gdppc").on("click", function(){
        vis.selectValue = d3.select("#per_gdppc").property("id");
        vis.selectTitle = d3.select("#per_gdppc").property("value");
        //$(".am_button").removeClass('selected');
        //$(this).attr('class', 'btn btn-default am_button selected');
        d3.selectAll('.am_button').classed('selected', false);
        d3.selectAll('.am_button_fix').classed('selected', false);
        d3.select(this).classed('selected',true);
        $("#actionmap-content").html("<div class='am_textbox'><p>Small Wallets. Big Hearts.<br><br>Countries " +
            " receiving the most refugees are those with low relative per capita income.</p></div>");
        vis.updateVis();});

    d3.select("#per_1000pop").on("click", function(){
        vis.selectValue = d3.select("#per_1000pop").property("id");
        vis.selectTitle = d3.select("#per_1000pop").property("value");
        //$(".am_button").removeClass('selected');
        //$(this).attr('class', 'btn btn-default am_button selected');
        d3.selectAll('.am_button').classed('selected', false);
        d3.selectAll('.am_button_fix').classed('selected', false);
        d3.select(this).classed('selected',true);
        $("#actionmap-content").html("<div class='am_textbox'><p>Small Nations. Big Hearts.<br><br>Most " +
            " receiving countries have small populations. Refugee inflows have large relative effects. </p></div>");
        vis.updateVis();});
};

ActionMap.prototype.updateVis = function() {
    var vis = this;

    vis.colorScale.domain(vis.domaindict[vis.selectValue]).range(vis.mapcolordict[vis.selectValue]);
    vis.mapticks.domain([0, d3.max(vis.xtickdict[vis.selectValue])]);
    vis.xAxis.tickValues(vis.xtickdict[vis.selectValue])
        .tickFormat(function (d) {
            if (vis.selectValue == "refugee" || vis.selectValue == "gdppc" || vis.selectValue == "population") {
                return d3.format(".1s")(d);
            }
            else {
                return d3.round(d);
            }
        });

    vis.mapkey.selectAll("rect")
        .data(vis.colorScale.range().map(function (d, i) {
            return {
                x0: i ? vis.mapticks(vis.colorScale.domain()[i - 1]) : vis.mapticks.range()[0],
                x1: i < vis.colorScale.domain().length ? vis.mapticks(vis.colorScale.domain()[i]) : vis.mapticks.range()[1],
                z: d
            };
        }))
        .transition()
        .duration(1000)
        .attr("y", function (d) {
            return d.x0;
        })
        .attr("height", function (d) {
            return d.x1 - d.x0;
        })
        .style("fill", function (d) {
            return d.z;
        });

    vis.mapkey
        .transition()
        .duration(1000)
        .call(vis.xAxis)
        .select(".caption")
        .attr("class", "caption")
        .text(function () {
            return vis.selectTitle;
    });

    vis.countries
        .data(topojson.feature(vis.mapdata, vis.mapdata.objects.subunits).features)
        .attr("class", function(d,i){
            if (!vis.countryById[d.id] && d.id!= "SYR") {return "land landtransparent"}
            else if (d.id === "SYR") { return "land landshow"}
            else if (isNaN(vis.countryById[d.id][vis.selectValue])) {return "land landtransparent"}
            else {return "land landshow"}
        })
        .transition()
        .duration(1000)
        .style("fill", function (d, i) {
            if (!vis.countryById[d.id] && d.id!= "SYR") {return "#bdbdbd"}
            else if (d.id === "SYR") { return "white"}
            else if (isNaN(vis.countryById[d.id][vis.selectValue])) {return "#bdbdbd"}
            else {return vis.colorScale(vis.countryById[d.id][vis.selectValue]);}
        });
};
