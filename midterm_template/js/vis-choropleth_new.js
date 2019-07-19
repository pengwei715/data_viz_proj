/**
 * Created by lili on 3/14/16.
 */

// --> CREATE SVG DRAWING AREA
var width = 600;
height = 570;

var svgmap = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

// Use the Queue.js library to read two files
var mapdata;
var malariainfo;
var malariaDataByCountryId = {};
var funding;

queue()
    .defer(d3.json, "data/africa.topo.json")
    .defer(d3.csv, "data/global-malaria-2015.csv")
    .defer(d3.csv, "data/global-funding.csv")
    .await(function(error, mapTopJson, malariaDataCsv, fundingData){

        console.log(mapTopJson);
        // --> PROCESS DATA
        //console.log(malariaDataCsv.length);
        malariaDataCsv = malariaDataCsv.filter(function(el,index){return el.WHO_region=="African"});
        //console.log(malariaDataCsv.length);
        var proplist = inspectElement(malariaDataCsv);
        malariaDataCsv = formatNumbers(malariaDataCsv, proplist.slice(3,8));
        var proplist = inspectElement(malariaDataCsv);

        malariaDataCsv.forEach(function(d){
            d["Detection_rate"] = (d.Malaria_cases / d.Suspected_malaria_cases)*100;
        });

        malariaDataCsv.forEach(function(d){
            malariaDataByCountryId[d.Code] = d;
        });
        //console.log(malariaDataByCountryId);
        mapdata = mapTopJson;
        malariainfo = malariaDataCsv;
        funding=fundingData;
        //console.log(malariainfo.length);

        // Initiate choropleth
        initiateChoropleth();
    });

// Initialize global variables that need to be used when updating the function
var projection, path, graticule, colorScale, subunits, countries;
var centroidpoints = {};
var countries;
var path;
var selectValue;
var domaindict;
var xtickdict;
var mapcolordict;
var mapticks; //Used for tickmarks
var xAxis;
var mapkey; // Group used
var tooltip;
var color;





function initiateChoropleth() {

    // ----------------------------------------------------------------------------------------
    // Initiate map
    // ----------------------------------------------------------------------------------------
    var projection = d3.geo.mercator().translate([width/2-100, height/2]).scale(300).center([0,11]);//rotate([-20,-35,-10]); // rotate([100,0,0])
    path = d3.geo.path().projection(projection);
    var graticule = d3.geo.graticule();
    //svg.append("path").datum(graticule).attr("class", "graticule").attr("d", path);

    // Render country area
    // Net overlaying the map
    /*svg.insert("path", ".graticule")
     .datum(topojson.feature(mapdata, mapdata.objects.collection))
     .attr("class", "land")
     .attr("d", path);*/

    //var centroidpoints = {};

    // ----------------------------------------------------------------------------------------
    // Dictionaries for optimal scaling / categories
    // ----------------------------------------------------------------------------------------
    selectValue = "At_risk";

    domaindict = {"At_risk": [0, 20, 40, 60, 80],
        "At_high_risk": [0, 20, 40, 60, 80],
        "Detection_rate": [0, 20, 40, 60, 80],
        "Malaria_cases": [0, 2000000, 5000000, 10000000, 20000000],
        "Suspected_malaria_cases": [0, 2000000, 5000000, 10000000, 20000000],
        "UN_population":[0, 5000000, 20000000, 50000000, 100000000]
    };

    xtickdict = {"At_risk": [0, 20, 40, 60, 80,100],
        "At_high_risk": [0, 20, 40, 60, 80, 100],
        "Detection_rate": [0, 20, 40, 60, 80,100],
        "Malaria_cases": [0, 2000000, 5000000, 10000000, 20000000, 60000000],
        "Suspected_malaria_cases": [0, 2000000, 5000000, 10000000, 20000000, 60000000],
        "UN_population":[0, 5000000, 20000000, 50000000, 100000000, d3.max(malariainfo, function(d){return d.UN_population;})]
    };

    mapcolordict = {"At_risk": colorbrewer.Oranges["6"],
        "At_high_risk": colorbrewer.Oranges["6"],
        "Detection_rate": colorbrewer.YlGn["6"],
        "Malaria_cases": colorbrewer.Greens["6"],
        "Suspected_malaria_cases": colorbrewer.Greens["6"],
        "UN_population":colorbrewer.Paired["6"]
    };


    // ----------------------------------------------------------------------------------------
    // Color scale
    // ----------------------------------------------------------------------------------------
    colorScale = d3.scale.threshold()
        .domain(domaindict[selectValue])
        .range(mapcolordict[selectValue]);

    /*colorScale = d3.scale.quantize()
     .domain(d3.extent(malariainfo, function(d){return d["At_risk"]}))
     .range(colorbrewer.PuRd["6"].slice(1));*/

    // ----------------------------------------------------------------------------------------
    // Tooltips initialize
    // ----------------------------------------------------------------------------------------

    //Tooltips adapted from: http://bl.ocks.org/chule/ac6d94c9df9919fdd4f2
    var sel = document.getElementById('data-choice');
    y_text = sel.options[sel.selectedIndex].text;


    var tooltip = {
        element: null,
        init: function() {
            this.element = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);},
        show: function(t) {
            this.element.html(t).transition().duration(200).style("left", d3.event.pageX + 20 + "px").style("top", d3.event.pageY - 20 + "px").style("opacity", .9);},
        move: function() {
            this.element.transition().duration(30).ease("linear").style("left", d3.event.pageX + 20 + "px").style("top", d3.event.pageY - 20 + "px").style("opacity", .9);},
        hide: function() {
            this.element.transition().duration(500).style("opacity", 0)}};

    tooltip.init();

    // ----------------------------------------------------------------------------------------
    // Countries
    // ----------------------------------------------------------------------------------------
    countries = svgmap.selectAll(".land")
        .data(topojson.feature(mapdata, mapdata.objects.collection).features)
        .enter().append("path")
        .style("fill", function(d, i) {
            if (!malariaDataByCountryId[d.properties.adm0_a3_is]) {return "#bdbdbd"}
            else {if (isNaN(malariaDataByCountryId[d.properties.adm0_a3_is]["At_risk"])){return "#bdbdbd"}
            else {return colorScale(malariaDataByCountryId[d.properties.adm0_a3_is]["At_risk"]);}
            }})
        //.attr("transform", function(d) {
        //var centroid = path.centroid(d);
        //    centroidpoints[d.properties.adm0_a3_is] = {x: centroid[0], y:centroid[1]};
        //return "translate(0,0)";})
        .attr("class", "land" )
        .attr("d", path);

    // ----------------------------------------------------------------------------------------
    // Tooltips populate
    // ----------------------------------------------------------------------------------------
    countries.on("mouseover", function (d, i) {
        tooltip.show(function(){
            if (!malariaDataByCountryId[d.properties.adm0_a3_is]){
                return "<p class='tooltip-header'>"+ d.properties.admin+"</p>"
                    +"<p>No information available</p>";}
            else {return "<p class='tooltip-header'>"+ (malariaDataByCountryId[d.properties.adm0_a3_is]['Country'])+"</p>"
                +"<p>"+y_text+":   "+d3.format(".2s")(malariaDataByCountryId[d.properties.adm0_a3_is][selectValue])+"</p>";}
        });
        color =  d3.rgb(d3.select(this).style("fill"));
        d3.select(this).style("fill", function() { return d3.rgb(colorScale.range()[5]).darker(2);});});

    countries.on("mousemove", function (d, i) {
            tooltip.move();
            d3.select(this).style("fill", function() {
                return d3.rgb(d3.select(this).style("fill")).brighter(0);});
        })
        .on("mouseout", function (d, i) {
            tooltip.hide();
            d3.select(this).style("fill", function() {
                return color;});
        });



    // Tooltips from: http://techslides.com/responsive-d3-map-with-zoom-and-pan-limits


    //console.log(centroidpoints);

    // Render country boundaries
    svgmap.insert("path", ".graticule")
        //.datum(topojson.mesh(mapdata, mapdata.objects.collection, function(a, b) { return a !== b; }))
        .datum(topojson.mesh(mapdata, mapdata.objects.collection))
        .attr("class", "boundary")
        .attr("d", path);

    // ----------------------------------------------------------------------------------------
    // Legend
    // ----------------------------------------------------------------------------------------
    // key - adapted from http://bl.ocks.org/chule/ac6d94c9df9919fdd4f2

    mapticks = d3.scale.linear()
        //.domain([0, d3.max(malariainfo, function(d){return d[selectValue];})])
        .domain([0, d3.max(xtickdict[selectValue])])
        .range([0, width-50]);

    xAxis = d3.svg.axis()
        .scale(mapticks)
        .orient("bottom")
        .tickSize(13)
        .tickValues(xtickdict[selectValue])
        .tickFormat(function(d) {return d3.format(" ")(d);});

    mapkey = svgmap.append("g")
        .attr("class", "key")
        .attr("transform", "translate("+(25)+",30)");

    mapkey.selectAll("rect")
        .data(colorScale.range().map(function(d, i) {
            return {
                x0: i ? mapticks(colorScale.domain()[i - 1]) : mapticks.range()[0],
                x1: i < colorScale.domain().length ? mapticks(colorScale.domain()[i]) : mapticks.range()[1],
                z: d
            };
        }))
        .enter().append("rect")
        .attr("height", 8)
        .attr("x", function(d) { return d.x0; })
        .attr("width", function(d) {
            //console.log(d);
            return d.x1 - d.x0; })
        .style("fill", function(d) { return d.z; });


    mapkey
        .attr("class", "x axis")
        .call(xAxis)
        .append("text")
        .attr("class", "caption")
        .attr("y", -6)
        .text(y_text);
    // key end


    // Render data labels in circles <-- that does not look good since some countries are way too small
    /*var maplabelcircles = svg.selectAll("circle").data(malariainfo)
     .enter().append("circle")
     .attr("class", "circle")
     .attr("fill", "lightgrey")
     .attr("stroke", "white")
     .attr("r", 4)
     .attr("cx", function(d){return centroidpoints[d.Code]["x"];})
     .attr("cy", function(d){return centroidpoints[d.Code]["y"];});*/

    //updateChloropleth();
}



// Updating the graph based on choice
d3.select("#data-choice").on("change", function(){
    updateChloropleth();});
//d3.select('#submit').on("click", function(){updateVisualization(); console.log("clicked");});

d3.select("#At_risk").on("click", function(){
    $("#data-choice").val("At_risk");
    updateChloropleth();
});
d3.select("#At_high_risk").on("click", function(){
    $("#data-choice").val("At_high_risk");
    updateChloropleth();
});
d3.select("#Suspected_malaria_cases").on("click", function(){
    $("#data-choice").val("Suspected_malaria_cases");
    updateChloropleth();
});
d3.select("#Malaria_cases").on("click", function(){
    $("#data-choice").val("Malaria_cases");
    updateChloropleth();
});
d3.select("#Detection_rate").on("click", function(){
    $("#data-choice").val("Detection_rate");
    updateChloropleth();
});




function updateChloropleth(){
    selectValue = d3.select("#data-choice").property("value");

    colorScale.domain(domaindict[selectValue]).range(mapcolordict[selectValue]);
    //mapticks.domain([0, d3.max(malariainfo, function(d){return d[selectValue];})]);
    mapticks.domain([0, d3.max(xtickdict[selectValue])]);
    xAxis.tickValues(xtickdict[selectValue])
        .tickFormat(function(d) {return d3.format(".1s")(d);});

    mapkey.selectAll("rect")
        .data(colorScale.range().map(function(d, i) {
            return {
                x0: i ? mapticks(colorScale.domain()[i - 1]) : mapticks.range()[0],
                x1: i < colorScale.domain().length ? mapticks(colorScale.domain()[i]) : mapticks.range()[1],
                z: d
            };
        }))
        .transition()
        .duration(1000)
        .attr("x", function(d) {
            return d.x0; })
        .attr("width", function(d) {
            return d.x1 - d.x0; })
        .style("fill", function(d) { return d.z; });

    var sel = document.getElementById('data-choice');
    y_text = sel.options[sel.selectedIndex].text;

    mapkey
        .transition()
        .duration(1000)
        .call(xAxis)
        .select(".caption")
        .attr("class", "caption")
        .attr("y", -6)
        .text(y_text);

    countries
        .data(topojson.feature(mapdata, mapdata.objects.collection).features)
        .transition()
        .duration(1000)
        //.attr("d", path)
        .style("fill", function(d, i) {
            //console.log(d);
            //console.log(d.properties.adm0_a3_is);
            if (!malariaDataByCountryId[d.properties.adm0_a3_is]) {return "#bdbdbd"}
            else {if (isNaN(malariaDataByCountryId[d.properties.adm0_a3_is][selectValue])){
                return "#bdbdbd"}
            else {
                return colorScale(malariaDataByCountryId[d.properties.adm0_a3_is][selectValue]);}
            }});


}

// Auxiliary functions
// Function to inspect data in the web console
function inspectElement(data){
    var proplist = [];
    var object = data[0 ];
    for(var property in object){
        //console.log(property + ': ' + object[property] + " (" + typeof(object[property]) + ")");
        proplist.push(property);
    }
    return proplist;
}

// Function to format strings to numbers
function formatNumbers(data, proplist){
    data.forEach(function(d){
        for (property in proplist){
            d[proplist[property]] = +d[proplist[property]];
            //console.log(data[element] + " & " + data[element][proplist[property]]);
        };
    });
    return data;
}