/**
 * Created by mariaschwarz on 4/5/16.
 */

/*
alert("This is a prototype. It is programmed to work on Chrome. " +
    "Texts are going to be revised. Feedback is very welcome under any of the e-mail addresses listed in the 'About US' section. " +
    "Depending on the speed of your internet connection, the page will take a couple of seconds to load.");
*/


// Will be used to the save the loaded JSON data
var allData = [];

// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y-%m-%-d").parse;
var formatDate = d3.time.format("%b-%y");

// Variables for the data instances
var syriaregion, eventdata, world, refugee_current, refugeecount,campdata,campdata_total;

// Variables for the visualization instances
var violencemap, timeline, actionmap, actorstacked, casualties, refugeemap, timeslide, refugeestacked;

// Databases for use in various visualizations
var actors, actorcolors, eventtypes, eventcolors, casualtydata;


// Start application by loading the data
loadData();

function loadData() {
    queue()
        .defer(d3.json, "data/world.json")
        .defer(d3.json, "data/syriaregion.json")
        .defer(d3.csv, "data/eventdata.csv")
        .defer(d3.csv, "data/refugee_current.csv")
        .defer(d3.csv, "data/refugees_syriaregion.csv")
        .defer(d3.csv, "data/2016_casualties.csv")
        .defer(d3.csv, "data/campdata5.csv")
        .defer(d3.csv, "data/campdata8.csv")
        .await(function(error, data1, data2, data3, data4, data5, data6, data7, data8){
            if (!error) {

                $('.downbutton').css("visibility", "visible");
                $('body').removeClass('noscroll');

                world = data1;
                syriaregion = data2;
                eventdata = data3;
                refugee_current = data4;
                refugeecount = data5;
                casualtydata = data6;
                campdata = data7;
                campdata_total = data8;

                // Event data: Format time and convert all numbers to number values
                eventdata.forEach(function(d){
                    d.Event_ID = parseFloat(d.Event_ID);
                    d.CAMEO_Code = parseFloat(d.CAMEO_Code);
                    d.Intensity = parseFloat(d.Intensity);
                    d.Latitude = parseFloat(d.Latitude);
                    d.Longitude = parseFloat(d.Longitude);
                    d.Date = d3.time.format("%m/%d/%y").parse(d.Event_Date);
                    d.Year = parseFloat(d3.time.format("%Y")(d.Date));
                });
                eventdata.sort(function(a,b){
                    return a.Date - b.Date;
                });
                eventdata = eventdata.filter(function(d){return d.Date >= parseDate("2011-03-15");});


                // Refugee timeline (for violencemap)
                refugeecount.forEach(function(d){
                    d.Value = parseFloat(d.Value);
                    d.Date = d3.time.format("%y/%m/%d").parse(d.Date);
                });

                refugeecount = d3.nest()
                    .key(function(d) { return d.Code; })
                    //.key(function(d) { return d.Date; })
                    .rollup(function(d) { return d; })
                    .map(refugeecount);


                // Refugee current
                refugee_current.forEach(function(d){
                    d.refugee = +d.refugee;
                    d.month = +d.month;
                    d.year = +d.year;
                    d.gdppc = +d.gdppc;
                    d.population = +d.population;
                    d.per_gdppc = +d.per_gdppc;
                    d.per_1000pop = +d.per_1000pop;
                });


                // Get unique names of actors & assign colorscale to it (for use in ViolenceMap and ActorCord)
                actors = d3.map(eventdata, function(d){return d.Source_Sector_General;}).keys();
                actors = ['Government/Military','Rebels/Extremists', 'ISIS', 'Al Qaeda / Jabhat al-Nusra', 'Kurds', 'Civilians/Protesters', 'Foreign', 'Unknown/Other'];

                // Changed
                var colors2 = ['#377eb8', '#4daf4a', '#e41a1c', '#ff7f00', '#ff08e8', '#a65628    ', '#ffff33', '#666666' ];
                actorcolors = d3.scale.ordinal().domain(actors).range(colors2);

                // Changed
                eventtypes = ["Military force/light weapons", "Bombings/Aerial weapons", "(Mass) killing", "Unconventional violence", "Occupy territory", "Property/Blockade", "Abduction", "Other"];
                var colors1 = ['#377eb8', '#e41a1c', '#ff7f00', '#4daf4a', '#a65628', '#666666','#984ea3', '#ffff33'];
                //eventcolors = d3.scale.ordinal().domain([eventtypes]).range(colorbrewer["Accent"]["8"]);
                eventcolors = d3.scale.ordinal().domain(eventtypes).range(colors1);

                // Refugee bubble map
                campdata.forEach(function(d){
                    d.lati = +d.lati;
                    d.longti = +d.longti;
                    d.refugee = +d.refugee;
                    //d.date = d3.time.format("%Y/%m/%d").parse(d.date);
                    d.date = d3.time.format("%m/%d/%Y").parse(d.date);
                    //d.date = d3.time.format("%Y/%m").parse(d.date);
                });

                campdata.sort(function(a,b){
                    return a.date - b.date;
                });

                // Refugee stacked area chart
                campdata_total.forEach(function(d) {
                    d.lati = +d.lati;
                    d.longti = +d.longti;
                    d.refugee = +d.refugee;
                    d.sum = +d.sum;
                    d.sum_1 = +d.sum_1;
                    d.sum_2 = +d.sum_2;
                    d.sum_3 = +d.sum_3;
                    d.date = d3.time.format("%Y/%m/%d").parse(d.date);
                    //d.date = d3.time.format("%m/%d/%Y").parse(d.date);
                    //d.date = d3.time.format("%Y/%m").parse(d.date);
                });

                campdata_total.sort(function(a,b){
                    return a.date - b.date;
                });

                createVis();
                navbarResize();
            };
        });
};


function createVis() {
    // TO-DO: Instantiate visualization objects here
    violencemap = new ViolenceMap("violencemap", syriaregion, eventdata, refugeecount);
    timeline = new Timeline("timeline", eventdata);
    actionmap = new ActionMap("actionmap", world, refugee_current);
    casualties = new Casualties("casualtychart", casualtydata);
    refugeemap = new RefugeeMap("refugeemap", syriaregion, campdata);
    timeslide = new Timeslide("timeslide",campdata);
    refugeestacked = new RefugeeStacked("refugeestacked",campdata_total);

    <!-- Timeline KeyTakeaways-->
    timelineKeyTakeaways = new TL.Timeline('timelineKeyTakeaways', 'data/keyTakeaways.json', {
        theme_color: "#000000",
        ga_property_id: "UA-27829802-4"
    });

    initScrolls();
}

function initScrolls(){
    // Initiate scroll events

    violencemap.scrollcounter=0;
    casualties.scrollcounter=0;
    function isScrolledIntoView(elem) {
        var $window = $(window),
            docViewTop = $window.scrollTop(),
            docViewBottom = docViewTop + $window.height(),
            elemTop = $(elem).offset().top,
            elemBottom = elemTop + $(elem).outerHeight();
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));};


    $(window).scroll(function() {
        checkScrolls();
    });

    function checkScrolls() {

        if (isScrolledIntoView("#violencemap")) {
            if (violencemap.scrollcounter==0){
                violencemap.scrollcounter += 1;
                violencemap.clickevent = true;
                violencemap.playmode = "play";
                brushed_violencemap();}
        };
        if (isScrolledIntoView("#casualtySection")){
            if (casualties.scrollcounter==0){
                casualties.scrollcounter +=1;
                casualties.updateVis();
                $('#clicker2').hide();}
        };
    }
}

function brushed_violencemap() {

    var duration = 102,
        maxstep = d3.max(violencemap.eventdata, function(d){return d.Date;}),
        minstep = d3.min(violencemap.eventdata, function(d){return d.Date;});


    // This is what happens when the play button is clicked
    if (violencemap.clickevent == true) {

        violencemap.clickcounter +=1;

        // Simple play mode
        if (violencemap.playmode == "play"){

            timeline.svg.selectAll(".highlights").attr("opacity", 0.1);
            d3.selectAll('.playbutton').classed("playselected", false);
            d3.select("#playviolence").classed("playselected", true);
            d3.select("#infobox").attr("opacity", 0);
            d3.select("#infotext").attr("opacity", 0);
            d3.select("#infotext2").attr("opacity", 0);

            violencemap.clickevent = false;
            timeline.clickevent = false;

            //if (timer) {clearInterval(timer)};
            _timer = setInterval(function(){}, 100);
            if (_timer){clearInterval(_timer)}
            _timer = setInterval( function(){

                if (violencemap.currentTime < maxstep){
                    violencemap.currentTime = d3.time.day.offset(violencemap.currentTime,1);
                    timeline.currentTime = violencemap.currentTime;
                    violencemap.wrangleData();
                    timeline.handle.attr("x", timeline.xContext(violencemap.currentTime));
                    timeline.wrangleData();
                }
                else {
                    violencemap.currentTime = violencemap.startvalue;
                    violencemap.running = false;
                    clearInterval(_timer);
                    d3.selectAll('.playbutton').classed("playselected", false);
                    d3.select("#playviolence3").classed("playselected", true);
                    violencemap.playmode="paused";
                }
            }, duration);
            violencemap.running = true;
        }

        // Fast-forward mode (only show interesting parts)
        else if (violencemap.playmode == "fast"){

            // Update buttons
            d3.selectAll('.playbutton').classed("playselected", false);
            d3.select("#playviolence2").classed("playselected", true);
            d3.select("#infobox").attr("opacity", 0.8);
            d3.select("#infotext").attr("opacity", 1);
            d3.select("#infotext2").attr("opacity", 1);

            // Update click-event
            violencemap.clickevent = false;
            timeline.clickevent = false;

            // Color highlights
            timeline.svg.selectAll(".highlights").attr("opacity", 0.6);

            // Find timewindow
            var dates = timeline.highlights;

            var dateformat = d3.time.format("%m-%d-%Y");

            _timer = setInterval(function(){}, 100);
            if (_timer){clearInterval(_timer)}
            _timer = setInterval(function(){

                // Check in which timewindow we are
                if (violencemap.currentTime<dateformat.parse(dates[0][0])){
                    violencemap.currentTime = dateformat.parse(dates[0][0]);
                    //d3.select('#datacurtain').transition().duration(100).attr("opacity", 0.9).transition().duration(100).attr("opacity", 0);
                    d3.select('#infotext').text(function(){return timeline.highlighttexts[0];});
                    d3.select('#infotext2').text(function(){return timeline.highlighttexts2[0];})
                }
                else {
                    var i = 0;
                    var imax = dates.length-1;
                    var selector=2;
                    while (selector==2 & i<=imax){
                        var lower = violencemap.currentTime>=dateformat.parse(dates[i][0]);
                        var higher = violencemap.currentTime>=dateformat.parse(dates[i][1]);
                        selector = lower + higher;
                        i +=1
                    }
                    var index = i-1;
                    if (higher == 1){
                        violencemap.currentTime = minstep;
                        //violencemap.running=false;
                        clearInterval(_timer);
                        d3.selectAll('.playbutton').classed("playselected", false);
                        d3.select("#playviolence3").classed("playselected", true);
                        violencemap.playmode="paused";
                        d3.select("#infobox").attr("opacity", 0);
                        d3.select("#infotext").attr("opacity", 0);
                        d3.select("#infotext2").attr("opacity", 0);}
                    else if (selector==0){
                        d3.select('#datacurtain').transition().duration(50).attr("opacity", 0.9).transition().duration(50).attr("opacity", 0);
                        violencemap.currentTime=dateformat.parse(dates[index][0]);
                        d3.select('#infotext').text(function(){return timeline.highlighttexts[index];});
                        d3.select('#infotext2').text(function(){return timeline.highlighttexts2[index];})}
                }


                // Are we smaller than the maxvalue?
                if (violencemap.currentTime < maxstep){
                    violencemap.currentTime = d3.time.day.offset(violencemap.currentTime,1);
                    timeline.currentTime = violencemap.currentTime;
                    violencemap.wrangleData();
                    timeline.handle.attr("x", timeline.xContext(violencemap.currentTime));
                    timeline.wrangleData();
                }
                else {
                    violencemap.currentTime = violencemap.startvalue;
                    violencemap.running = false;
                    clearInterval(_timer);
                    d3.selectAll('.playbutton').classed("playselected", false);
                    d3.select("#playviolence3").classed("playselected", true);
                    violencemap.playmode="paused";
                    d3.select("#infobox").attr("opacity", 0);
                    d3.select("#infotext").attr("opacity", 0);
                    d3.select("#infotext2").attr("opacity", 0);
                }


            },duration);

            violencemap.running = true;

        }

        // Pause  mode
        else if (violencemap.playmode == "paused"){
            timeline.svg.selectAll(".highlights").attr("opacity", 0.1);
            d3.selectAll('.playbutton').classed("playselected", false);
            d3.select("#playviolence3").classed("playselected", true);

            violencemap.running = false;

            //clearInterval(timer);
            //_timer = setInterval(function(){}, 100);
            if (violencemap.clickcounter >1){clearInterval(_timer);}
            //clearInterval(timer2);

            violencemap.clickevent = false;
            timeline.clickevent = false;}

    }

    // This is what happens when the slider is being used
    else {

        clearInterval(_timer);
        d3.selectAll('.playbutton').classed("playselected", false);
        d3.select("#playviolence3").classed("playselected", true);

        violencemap.playmode = "paused";

        if (d3.event.sourceEvent) { // not a programmatic event
            value = timeline.xContext.invert(d3.mouse(this)[0]);
            timeline.brush.extent([value, value]);
            if (timeline.brush.extent()[0]<minstep){
                timeline.currentTime = minstep;
                value = minstep;}
            else if (timeline.brush.extent()[0]>maxstep){timeline.currentTime = maxstep;
                value = maxstep;}
            else {timeline.currentTime = timeline.brush.extent()[0];}
            //timeline.currentTime = timeline.brush.extent()[0];
            violencemap.currentTime = timeline.currentTime;
            //violencemap.currentTime = timeline.brush.extent()[0];
            violencemap.running = false;
            violencemap.wrangleData();
            timeline.handle.attr("x", timeline.xContext(value)-2);
            timeline.wrangleData();
        }
    }
}

function brushed_refugeemap() {

    var duration = 1,
        maxstep = d3.max(refugeemap.campdata, function(d){return d.date;}),
        minstep = d3.min(refugeemap.campdata, function(d){return d.date;});

    // This is what happens when the play button is clicked
    if (refugeemap.clickevent == true) {
        
        if (refugeemap.running == true) {
            $("#playcamp").html("<i class='fa fa-play fa-lg'></i>");
            refugeemap.running = false;
            clearInterval(timer);
            refugeemap.clickevent = false;
            timeslide.clickevent = false;
        }

        else
        if (refugeemap.running == false) {
            refugeemap.clickevent = false;
            timeslide.clickevent = false;
            $("#playcamp").html("<i class='fa fa-pause fa-lg'></i>");

            timer = setInterval(function () {
                if (refugeemap.currentTime < maxstep) {
                    refugeemap.currentTime = d3.time.day.offset(refugeemap.currentTime, 5);
                    timeslide.currentTime = refugeemap.currentTime;
                    refugeemap.wrangleData();
                    timeslide.handle.select("rect").attr("x", timeslide.xContext(refugeemap.currentTime));
                    timeslide.handle.select("text").text(formatDate(refugeemap.currentTime));
                    timeslide.handle.select("text").attr("x", timeslide.xContext(refugeemap.currentTime));
                    refugeestacked.handle.attr("x1",refugeestacked.x(d3.time.format.iso.parse(refugeemap.currentTime.toDateString())))
                        .attr("x2",refugeestacked.x(d3.time.format.iso.parse(refugeemap.currentTime.toDateString())));
                }
                else {
                    refugeemap.currentTime = refugeemap.startvalue;
                    $("#playcamp").html("<i class='fa fa-play fa-lg'></i>");

                    refugeemap.running = false;
                    clearInterval(timer);
                }
            }, duration);
            refugeemap.running = true;
        }
    }

    // This is what happens when the slider is being used
    else {

        clearInterval(timer);

        if (d3.event.sourceEvent) { // not a programmatic event
            value = timeslide.xContext.invert(d3.mouse(this)[0]);
            timeslide.brush.extent([value, value]);
            if (timeslide.brush.extent()[0] < minstep) {
                timeslide.currentTime = minstep;
                value = minstep;
            }
            else if (timeslide.brush.extent()[0] > maxstep) {
                timeslide.currentTime = maxstep;
                value = maxstep;
            }
            else {
                timeslide.currentTime = timeslide.brush.extent()[0];
            }
            refugeemap.currentTime = timeslide.currentTime;
            $("#playcamp").html("<i class='fa fa-play fa-lg'></i>");

            refugeemap.running = false;
            refugeemap.wrangleData();
            timeslide.handle.select("rect").attr("x", timeslide.xContext(refugeemap.currentTime));
            timeslide.handle.select("text").text(formatDate(refugeemap.currentTime));
            timeslide.handle.select("text").attr("x", timeslide.xContext(refugeemap.currentTime));
            refugeestacked.handle.attr("x1",refugeestacked.x(d3.time.format.iso.parse(refugeemap.currentTime.toDateString())))
                .attr("x2",refugeestacked.x(d3.time.format.iso.parse(refugeemap.currentTime.toDateString())));
        }
    }

};


