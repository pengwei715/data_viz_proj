/* Data-Viz for Actor Stacked Diagram*/

// Dimensions
var width = 400,
    height = 350,
    padding = {left: 50, right: 10, top: 20, bottom: 30},
    xRangeWidth = width - padding.left - padding.right,
    yRangeHeight = height - padding.top - padding.bottom;

// Create visStacked and svgStacked
var visStacked = d3.select("#actorStacked")
    .append("div")
    .attr({margin: "10", id: "visStacked"});

var svgStacked = visStacked.append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + [padding.left, padding.top] + ")");

// Small datasets
var dataSetSource = [
    {
        name: "Government/Military",
        violence: [{year: 2011, events: 2461},
            {year: 2012, events: 4255},
            {year: 2013, events: 2082},
            {year: 2014, events: 1619},
            {year: 2015, events: 276}]
    },
    {
        name: "Civilians/Protesters",
        violence: [{year: 2011, events: 161},
            {year: 2012, events: 226},
            {year: 2013, events: 193},
            {year: 2014, events: 279},
            {year: 2015, events: 62}]
    },
    {
        name: "Foreign",
        violence: [{year: 2011, events: 365},
            {year: 2012, events: 367},
            {year: 2013, events: 1193},
            {year: 2014, events: 766},
            {year: 2015, events: 333}]
    },
    {
        name: "Rebels/Extremists",
        violence: [{year: 2011, events: 688},
            {year: 2012, events: 2762},
            {year: 2013, events: 2072},
            {year: 2014, events: 1468},
            {year: 2015, events: 220}]
    },
    {
        name: "ISIS",
        violence: [{year: 2011, events: 0},
            {year: 2012, events: 0},
            {year: 2013, events: 69},
            {year: 2014, events: 512},
            {year: 2015, events: 64}]
    },
    {
        name: "Al Qaeda / Jabhat al-Nusra",
        violence: [{year: 2011, events: 4},
            {year: 2012, events: 44},
            {year: 2013, events: 166},
            {year: 2014, events: 234},
            {year: 2015, events: 37}]
    },
    {
        name: "Kurds",
        violence: [{year: 2011, events: 3},
            {year: 2012, events: 11},
            {year: 2013, events: 40},
            {year: 2014, events: 84},
            {year: 2015, events: 32}]
    },
    {
        name: "Unknown/Other",
        violence: [{year: 2011, events: 119},
            {year: 2012, events: 312},
            {year: 2013, events: 204},
            {year: 2014, events: 233},
            {year: 2015, events: 40}]
    }
];

var dataSetTarget = [
    {
        name: "Government/Military",
        violence: [{year: 2011, events: 400},
            {year: 2012, events: 1542},
            {year: 2013, events: 787},
            {year: 2014, events: 603},
            {year: 2015, events: 74}]
    },
    {
        name: "Civilians/Protesters",
        violence: [{year: 2011, events: 2443},
            {year: 2012, events: 2039},
            {year: 2013, events: 1054},
            {year: 2014, events: 840},
            {year: 2015, events: 193}]
    },
    {
        name: "Foreign",
        violence: [{year: 2011, events: 94},
            {year: 2012, events: 227},
            {year: 2013, events: 261},
            {year: 2014, events: 200},
            {year: 2015, events: 27}]
    },
    {
        name: "Rebels/Extremists",
        violence: [{year: 2011, events: 228},
            {year: 2012, events: 1848},
            {year: 2013, events: 1440},
            {year: 2014, events: 1420},
            {year: 2015, events: 227}]
    },
    {
        name: "ISIS",
        violence: [{year: 2011, events: 0},
            {year: 2012, events: 0},
            {year: 2013, events: 19},
            {year: 2014, events: 278},
            {year: 2015, events: 22}]
    },
    {
        name: "Al Qaeda / Jabhat al-Nusra",
        violence: [{year: 2011, events: 3},
            {year: 2012, events: 17},
            {year: 2013, events: 102},
            {year: 2014, events: 137},
            {year: 2015, events: 9}]
    },
    {
        name: "Kurds",
        violence: [{year: 2011, events: 8},
            {year: 2012, events: 22},
            {year: 2013, events: 44},
            {year: 2014, events: 73},
            {year: 2015, events: 12}]
    },
    {
        name: "Unknown/Other",
        violence: [{year: 2011, events: 625},
            {year: 2012, events: 2282},
            {year: 2013, events: 2312},
            {year: 2014, events: 1644},
            {year: 2015, events: 450}]
    }
];


// Selectors using JS (comes from js/select.js, source: https://gitcdn.xyz/repo/cool-Blue/d3-lib/master/inputs/select/select.js")
// Based on documentation:
// isoLines = d3.ui.select({
// base: inputs,
// onUpdate: update,
// data: [{text: "show lines", value: "#ccc"}, {text: "hide lines", value: "none"}]})
//

// Choose Source vs Target
selectedDataSet = dataSetSource;

var dataSetSelect = d3.ui.select({
    base: visStacked,
    before: "svgStacked",
    style: ({position: "absolute", left: width - padding.right + 25 + "px", top: 80 + "px", color: "black", opacity: 0.8}),
    data: [{text: "Source", value: "dataSetSource"}, {text: "Target", value: "dataSetTarget"}],
    onchange: function() {
        if (dataSetSelect.value() == "dataSetSource") {
            var selectedDataSet = dataSetSource;
        } else if (dataSetSelect.value() =="dataSetTarget") {
            var selectedDataSet = dataSetTarget;
        };
        updateStacked(selectedDataSet);
    }
});

// Choose Zero vs. Stacked
var offsetSelect = d3.ui.select({
    base: visStacked,
    //before: "svgStacked",
    style: {position: "absolute", left: width - padding.right + 140 + "px", top: 80 + "px", color: "black", opacity: 0.8},
    onchange: function() {
        if (dataSetSelect.value() == "dataSetSource") {
            var selectedDataSet = dataSetSource;
        } else if (dataSetSelect.value() =="dataSetTarget") {
            var selectedDataSet = dataSetTarget;
        };
        updateStacked(selectedDataSet);
    },
    data: [{text: "Total", value: "zero"}, {text: "Relative", value: "expand"}]
}).attr("class", ".selector");



// Create Stack Layout - Documentation: https://github.com/mbostock/d3/wiki/Stack-Layout
var stack  = d3.layout.stack()
    .values(function(d) { return d.violence; })
    .x(function(d) { return d.year; })
    .y(function(d) { return d.events; })
    .out(function out(d, y0, y) {
            d.p0 = y0;
            d.y = y;
        }
    );

// Axes
// x Axis
var xPadding = {inner: 0.1, outer: 0.3};
var xScale   = d3.scale.ordinal()
    .rangeBands([0, xRangeWidth], xPadding.inner, xPadding.outer);
var xAxis    = d3.cbPlot.d3Axis()
    .scale(xScale)
    .orient("bottom");
var xAxis_group  = svgStacked.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + yRangeHeight + ")")
    .style({"pointer-events": "none", "font-size": "12px"});
// y Axis
var yAxisScale = d3.scale.linear()
    .range([yRangeHeight, 0]);
var yAxis = d3.cbPlot.d3Axis()
    .scale(yAxisScale)
    .orient("left")
    .tickSubdivide(1);
var yAxis_group = svgStacked.append("g")
    .attr("class", "y axis")
    .style({"pointer-events": "none", "font-size": "12px"});

var yScale = d3.scale.linear()
    .range([0, yRangeHeight]);

//var yAxisTransition = 1000;

// Color scale (sames as ViolenceMap and ActorChord)
var color = d3.scale.ordinal()
    //.range(["#1f78b4","#b2df8a","#e31a1c","#33a02c","#a6cee3","#fdbf6f","#ff7f00","#fb9a99"]);
    //.range(['#377eb8', '#4daf4a', '#e41a1c', '#ff7f00', '#ff08e8', '#a65628', '#ffff33', '#666666']);
    .range(['#377eb8', '#a65628', '#ffff33', '#4daf4a', '#e41a1c', '#ff7f00', '#ff08e8', '#666666']);


// updateStacked: This is a function that takes in the data and updates the stacked bar based on the options

function updateStacked(dataSet) {

    // (1) To expand: new array of normalised layers + add the normalised values onto the data
    var normData = stack.offset("expand")(dataSet)
        .map(stack.values())
        .map(function(s) {
            return s.map(function(p) {return p.yNorm = p.y})
        });

    var stackedData  = stack.offset(offsetSelect.value())
        .order("default")(dataSet);

    var max_Y = d3.max(stackedData, function(d) {
        return d3.max(d.violence, function(s) {
            return s.events + s.p0
        })
    });

    var years = stackedData[0].violence.map(stack.x()),
        yearlyTotals = years.reduce(function(t, y) {
            return (t[y] = d3.sum(stackedData, function(o) {
                return o.violence.filter(function(s) {
                    return s.year == y
                })[0].events
            }), t)
        }, {});

    // Scales
    xScale.domain(years);
    yAxisScale.reset = function(){
        this.domain([0, offsetSelect.value() == "expand" ? 1 : max_Y])
            .range([yRangeHeight, 0])
            .ticks(10)

    };
    yAxisScale.reset();
    yScale.domain(yAxisScale.domain());

    // (2) To Expand: Create stackedArea (to avoid overlapping)

    var stackedArea = svgStacked.selectAll(".stackedArea")
        .data([stackedData]);

    stackedArea.enter().insert("g", ".axis")
        .attr(d3.cbPlot.transplot(yRangeHeight))
        .attr("class", "stackedArea");

    // (3) Add elements

    // Selectors labels
    svgStacked.append("text")
        .text("DATA TYPE")
        .attr("transform", "translate("+ (350) +","+(0)+")rotate(0)")
        .attr("fill", "white");

    svgStacked.append("text")
        .text("CHART TYPE")
        .attr("transform", "translate("+ (465) +","+(0)+")rotate(0)")
        .attr("fill", "white");

    svgStacked.append("text")
        .text("Jan-Mar")
        .attr("transform", "translate("+ (267) +","+(335)+")rotate(0)")
        .attr("fill", "lightgray");


    // Add Y label
    svgStacked.append("text")
        .text("Violence events")
        .attr("transform", "translate("+ (15) +","+(100)+")rotate(-90)")
        .attr("fill", "white");

    // Add Series
    stackedArea.series = stackedArea.selectAll(".series")
        .data(ID);
    stackedArea.series.enter()
        .append("g")
        .attr("class", "series");
    stackedArea.series.style("fill", function(d, i) {
        return color(i);
    });
    stackedArea.series.exit().remove();

    Object.defineProperties(stackedArea.series, d3._CB_selection_destructure);

    // Add Components
    stackedArea.series.components = stackedArea.series.selectAll(".components")
        .data(function(d) {
            return d3.entries(d);
        });
    stackedArea.series.components.enter().append("g")
        .attr("class", function(d){return d.key})
        .classed("components", true);
    stackedArea.series.components.exit().remove();

    // Add Values
    stackedArea.series.components.values = stackedArea.series.components.filter(function(d){
        return d.key == "violence"
    });
    Object.defineProperties(stackedArea.series.components.values, d3._CB_selection_destructure);

    // Add Labels
    stackedArea.series.components.labels = stackedArea.series.components.filter(function(d){
            return d.key == "name"
        })
        // reverse the stackedArea transform (it is it's own inverse)
        .attr(d3.cbPlot.transplot(yRangeHeight));
    Object.defineProperties(stackedArea.series.components.labels, d3._CB_selection_destructure);

    var s = xScale.rangeBand();

    var w = s - xPadding.inner;

    var drag = d3.behavior.drag()
        .on("dragstart", mouseOver);

    var points = stackedArea.series.components.values.points = stackedArea.series.components.values.selectAll("rect")
        .data(function(d){return d.value});

    points.enter()
        .append("rect")
        .attr({width: w, class: "point"})
        .on("mouseover", mouseOver)
        .on("mouseout", mouseOut)
        .call(drag);
    points.transition()
        .attr("x", function(d) {
            return xScale(d.year);
        })
        .attr("y", function(d) {
            return yScale(d.p0);
        })
        .attr("height", function(d) {
            return yScale(d.y);
        })
        .attr("stroke", "");

    points.exit().remove();

    Object.defineProperties(stackedArea.series.components.values.points, d3._CB_selection_destructure);

    // Axes transitions
    xAxis_group.transition().call(xAxis);
    yAxis_group.transition().call(yAxis);

    // (4) Mouse events

    // MOUSEOVER
    function mouseOver(pointData, pointIndex, groupIndex) {
        var selectedYear = pointData.year,

        // Wrap the node in a selection with the proper parent
            plotData = stackedArea.series.components.values.data,
            seriesData = plotData[groupIndex],
            currentYear = d3.transpose(plotData)[pointIndex],
            point         = stackedArea.series.components.values.points.nodes[groupIndex][pointIndex];


        /* NICE TO HAVE BUT NEEDS WORK: Make Y axis dynamic on the selection

         if(offsetSelect.value() != "expand") {
         yAxisScale.reset();

         // get the zero offset for the fly-in axis
         var pMin = d3.min(currentYear, function(s) {return s.p0});
         var refP0 = seriesData[pointIndex].p0;
         var selectedGroupHeight = d3.sum(currentYear, function(d) {return d.y});

         // set the range and domain height for the selected year
         localDomain = [0, selectedGroupHeight].map(function(d){return d + pMin - refP0}),
         localRange  = [0, selectedGroupHeight].map(function(d) {return yAxisScale(d + pMin)});

         yAxisScale
         .domain(localDomain)
         .range(localRange);
         // apply the changes to the y axis and manage the ticks
         yAxis_group.transition("axis")
         .duration(yAxisTransition)
         .call(yAxis.ticks(+(Math.abs(localRange[0] - localRange[1]) / 15).toFixed()))
         .attr("transform", "translate(" + point.attr("x") + ",0)")
         .style({"font-size": "8px"})
         .call(function(t) {d3.select(t.node()).classed("fly-in", true)});
         // align the selected series across all years
         points.transition("points")
         .attr("y", alignY(seriesData[pointIndex].p0, groupIndex))
         .call(endAll, toolTip)
         } else */
        window.setTimeout(tooltipStacked, 0); // Y axis static

        // Add Highlighting
        // 1. Points
        stackedArea.series.transition("fade")
            .attr("opacity", function(d, i) {
                return i == groupIndex ? 1 : 0.2;
            });
        /* 2. X axis highlighting
         d3.selectAll(".x.axis .tick")
         .filter(function(d) {return d == selectedYear})
         .classed("highlight", true); */

        // 3. Move the selected element to the front
        d3.select(this.parentNode)
            .moveToFront();

        xAxis_group.moveToFront();

        // 4. Legend
        legendText(groupIndex);
        // TooltipStacked
        function tooltipStacked() {
            stackedArea.series
                .append("g")
                .attr("class", "tooltipStacked")
                .attr("transform", "translate(" + [point.attr("x"), point.attr("y")] + ")")
                .append("text")
                .attr(d3.cbPlot.transflip())
                //.text(d3.format(",d")(pointData.events))
                .text(d3.format(">8.0%")(pointData.yNorm))
                .attr({x: "1.15em", y: -point.attr("height") / 2, dy: ".35em", opacity: 0})
                .transition("tooltipStacked").attr("opacity", 1)
                .style({fill: "black", "pointer-events": "none"})
        }
    }

    // MOUSEOUT
    function mouseOut(d, nodeIndex, groupIndex) {
        var year = d.year;

        d3.selectAll(".x.axis .tick")
            .filter(function(d) {
                return d == year
            })
            .classed("highlight", false);

        stackedArea.series.transition("fade")
            .attr({opacity: 1});

        var g = stackedArea.series.components.labels.nodes[groupIndex][0].select("text");
        g.classed("highlight", false);
        g.text(g.text().split(":")[0]);

        yAxisScale.reset();

        yAxis_group.selectAll(".minor").remove();

        yAxis_group
            .call(yAxis)
            //.transition("axis")
            .attr("transform", "translate(0,0)")
            .style({"font-size": "12px"})
            .call(function(t) {d3.select(t.node()).classed("fly-in", false)});

        stackedArea.series.selectAll(".tooltipStacked")
            .transition("tooltipStacked")
            .attr({opacity: 0})
            .remove();

        points.transition("points").attr("y", function(d) {
            return yScale(d.p0);
        })
    };


    var labHeight = 30,
        labRadius = 10;


    // Create the circles

    var labelCircle = stackedArea.series.components.labels.selectAll("circle")
        .data(function(d){return [d.value]});
    
    // Use the order created in stackedData
    var orderStacked = stackedData.map(function(d) {return {name: d.name, base: d.violence[0].p0}})
        .sort(function(a, b) {return b.base - a.base})
        .map(function(d) {return stackedData.map(function(p) {return p.name}).indexOf(d.name)}).reverse();

    // Add the circles and mouseover/mouseout
    labelCircle.enter().append("circle")
        .on("mouseover", function(pointData, pointIndex, groupIndex) {
            var node = this,
                typicalP0 = d3.median(stackedArea.series.components.values.data[groupIndex],
                    function(d){return d.p0});
            stackedArea.series.components.values.points.transition("points")
                .attr("y", alignY(typicalP0, groupIndex));
            stackedArea.series.transition("fade")
                .attr("opacity", function(d) {
                    return d === d3.select(node.parentNode.parentNode).datum() ? 1 : 0.2;
                });
            legendText(groupIndex);
        })
        .on("mouseout", function(pointData, pointIndex, groupIndex) {
            stackedArea.series.transition("fade")
                .attr({opacity: 1});
            stackedArea.series.components.values.points.transition("points").attr("y", function(d) {
                return yScale(d.p0);
            })
        });

    labelCircle.attr("cx", xRangeWidth + 20)
        .attr("cy", function(d, i, j) {return labHeight * orderStacked[j] + 80;})
        .attr("r", labRadius);

    // Add text to the labels
    var labelText = stackedArea.series.components.labels.selectAll("text")
        .data(function(d){return [d.value]});
    labelText.enter().append("text");
    labelText.attr("x", xRangeWidth + 40)
        .attr("y", function(d, i, j) {
            return labHeight * orderStacked[j] + 80;
        })
        .attr("dy", labRadius / 2)
        .text(function(d) {
            return d;
        });

    function legendText(groupIndex){
        // This is cool: See the total number of events by actor when moused over and highlight it
        // TO DO: If "expand", give me percentages, if "zero" give me absolutes
        var labelText = stackedArea.series.components.labels.nodes[groupIndex][0].select("text"),
            seriesData = stackedArea.series.components.values.data[groupIndex],
            format = [">8,.0f", ">8.0%"][(offsetSelect.value() == "expand") * 1];
        labelText.classed("highlight", true);
        labelText.text(labelText.datum().value + ": " + d3.format(format)(
                offsetSelect.value() != "expand" ?
                    d3.sum(seriesData, stack.y()) :
                    d3.sum(seriesData, function(s) {
                        var totalViolence = d3.sum(d3.values(yearlyTotals));
                        return s.y * yearlyTotals[s.year] / totalViolence
                    })
            ));
    }

    function alignY(p0, series) {
        var offsets = stackedArea.series.components.values.data[series].map(function(d) {
            return p0 - d.p0;
        });
        return function(d, i) {
            return yScale(d.p0 + offsets[i]);
        }
    }

    function aID(d) {
        return [d];
    }
    function ID(d) {
        return d;
    }
}


// Auxiliary functions

d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};
d3._CB_selection_destructure = {
    "nodes": {
        get: function() {
            return this.map(function(g) {
                return g.map(function(n) {
                    return d3.select(n)
                })
            })
        }
    },
    data: {
        get: function() {
            return this.map(function(g) {
                return d3.select(g[0]).datum().value
            })
        }
    }
};

// updateStacked with the selected database
updateStacked(selectedDataSet);
window.setTimeout(function(){
    updateStacked(selectedDataSet.map(function(d) {
            return {
                name: d.name, violence: d.violence.map(function(y) {
                    return {year: y.year, events: y.events }
                })
            }
        })
    )
},1000);

// endAll
function endAll(transition, callback) {
    var n = 0;
    transition
        .each(function() { ++n; })
        .each("end.endAll", function() { if (!--n) callback.apply(this, arguments); });
    if(transition.empty()) callback();
}

// Builds on http://stackoverflow.com/questions/32057842/d3-js-highlighting-stacked-bar-and-getting-selected-values/32079517#32079517
// Help from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
