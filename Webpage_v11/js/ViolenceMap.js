/******** Designer Maria Schwarz ********/

ViolenceMap = function(_parentElement, _mapdata, _eventdata, _refugeecount){
    this.parentElement = _parentElement;
    this.mapdata = _mapdata;
    this.eventdata = _eventdata;
    this.refugeecount = _refugeecount;
    this.displayData = []; // see data wrangling

    // -------------------------------------------------------------------------
    // Initialize :)
    // -------------------------------------------------------------------------
    this.initVis();

};

ViolenceMap.prototype.initVis = function() {
    var vis = this;

    // -------------------------------------------------------------------------
    // SVG Drawing area
    // -------------------------------------------------------------------------
    vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
    //vis.width = d3.min([$("#"+vis.parentElement).width() - vis.margin.left - vis.margin.right, 500]);
    vis.width = $("#"+vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 425 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // TO-DO: Overlay with path clipping
    vis.svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", vis.width)
        .attr("height", vis.height);

    // ----------------------------------------------------------------------------------------
    // Tooltips initialize
    // ----------------------------------------------------------------------------------------

    var tooltip = {
        element: null,
        init: function() {
            this.element = d3.select("body").append("div").attr("class", "vmtooltip").style("opacity", 0);},
        show: function(t) {
            this.element.html(t).transition().duration(200).style("left", d3.event.pageX + 20 + "px").style("top", d3.event.pageY - 20 + "px").style("opacity", .9);},
        move: function() {
            this.element.transition().duration(30).ease("linear").style("left", d3.event.pageX + 20 + "px").style("top", d3.event.pageY - 20 + "px").style("opacity", .9);},
        hide: function() {
            this.element.transition().duration(500).style("opacity", 0)}};

    tooltip.init();

    // -------------------------------------------------------------------------
    // Initialize map projection
    // -------------------------------------------------------------------------
    vis.projection = d3.geo.mercator().translate([vis.width/2, vis.height/2]).scale(2500).center([36.5,34.35]);
    vis.path = d3.geo.path().projection(vis.projection);
    vis.graticule = d3.geo.graticule();

    var merge = d3.set([7,9]);

    var names = ["0", "1", "Cyprus (Turkey)", "Cyprus (Greece)", "Egypt", "Gaza", "6", "8", "Israel", "Jordan", "Lebanon", "Saudi Arabia", "14", "Syria", "Turkey", "West Bank"];

    // Render country shapes
    vis.countries = vis.svg.selectAll(".land")
        //.data(topojson.feature(vis.mapdata, vis.mapdata.objects.subunits).features)
        .data(topojson.feature(vis.mapdata, vis.mapdata.objects.subunits).features.filter(function(d,i){return (i!=7) & (i!=9)}))
        .enter().append("path")
        .style("fill", function(d, i) {
            d.countryid = i;
            return "darkgrey";})
        .style("stroke", "white")
        .style("stroke-width", "2px")
        .attr("class", "land" )
        .attr("id", function(d,i){return "id_"+i;})
        .attr("d", vis.path)
        .on("mouseover", function (d, i) {tooltip.show(function(){
            return "<p class='tooltip-header'><strong>" + names[i] +"</strong></p>";});})
        .on("mousemove", function (d, i) {
            tooltip.move();})
        .on("mouseout", function (d, i) {
            tooltip.hide();});


    var merge = d3.set([7,9]);
    vis.svg.append("path")
        .datum(topojson.merge(vis.mapdata, vis.mapdata.objects.subunits.geometries.filter(function(d, i) {
            return merge.has(i); })))
        .attr("class", "land" )
        .style("fill", function(d, i) {
            d.countryid = i;
            return "darkgrey";})
        .style("stroke", "white")
        .style("stroke-width", "2px")
        .attr("d", vis.path)
        .on("mouseover", function (d, i) {tooltip.show(function(){
            return "<p class='tooltip-header'><strong>Iraq</strong></p>";});})
        .on("mousemove", function (d, i) {
            tooltip.move();})
        .on("mouseout", function (d, i) {
            tooltip.hide();});;

    
    // -------------------------------------------------------------------------
    // Initialize longitude / latitude jitter (to better see various violent events happening at the same place)
    // -------------------------------------------------------------------------
    vis.jitter = 0.1; // This will make sure that events happening in the same location will not overlap completely
    vis.normaldist = d3.random.normal(0,1);

    // -------------------------------------------------------------------------
    // Calendar
    // -------------------------------------------------------------------------
    vis.calendar = vis.svg.append("foreignObject")
        .attr("width", 10)
        .attr("height", 10)
        .attr("opacity", 0)
        .attr("x", vis.width-50)
        .attr("y", 10)
        .append("xhtml:div")
        .attr("id", "calendar")
        .style("font", "14px 'Helvetica Neue'")
        .html("<time datetime='2014-09-20' class='icon'>"+
            "<em>March</em>"+
            "<strong>2011</strong>"+
            "<span>20</span>"+
            "</time>");

    // -------------------------------------------------------------------------
    // Create patterns for refugee people presentation
    // -------------------------------------------------------------------------
    var foo = [];
    for (var i = 1; i <= 100; i++) {foo.push(i);}
    var definitions = vis.svg.append("defs");
    foo.forEach(function(el, i){
        definitions.append("pattern")
            .attr("id", function(){return "pattern"+el}).attr("x", "0").attr("y", "0").attr("width", "30").attr("height", "40")
            .attr("patternUnits", "objectBoundingBox")
            .append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("height", function(){return el/100*30})
            .attr("width", "30")
            .attr("stroke", "none")
            .attr("fill", "white");
    });

    // -------------------------------------------------------------------------
    // Initialize refugee people representation
    // -------------------------------------------------------------------------
    var countersize = "30px";
    var figsize = "29px";
    var countercolor = "red";
    var figcolor = "white";

    var countercoordinates = {
        TUR : {coord: [37.4, 37.55], maxcount: 2715789, init: "", name: "Turkey"},
        IRQ : {coord: [41.4, 33.75],  maxcount: 245909, init: "", name: "Iraq"},
        JOR : {coord: [35.72, 31.82],  maxcount: 638633, init: "", name: "Jordan" },
        EGY : {coord: [29.9, 30.5],  maxcount: 119301, init: "", name:"Egypt" },
        LBN : {coord: [32.0, 33.75],  maxcount: 1055984, init: "", name: "Lebanon"}
    };

    vis.neighborcountries = ["TUR", "IRQ", "JOR", "EGY", "LBN"];
    vis.countryname = {TUR: "Turkey", IRQ: "Iraq", JOR: "Jordan", LBN: "Lebanon"};

    // Group for all number counters
    vis.counters = vis.svg.append("g").attr("class", "counters").selectAll('text')
        .data(vis.neighborcountries);

    vis.counters
        .enter().append("text")
        .attr('font-size', countersize )
        .attr("class", "counter")
        .attr("transform", function(d,i) {return "translate(" + vis.projection(countercoordinates[d]["coord"]) + ")";})
        .style("fill", countercolor)
        .text(function(d) { return d.init; })
        .on("mouseover", function (d, i) {tooltip.show(function(){
            return "<p class='tooltip-header'><strong>" + countercoordinates[d]["name"] +"</strong></p>";});})
        .on("mousemove", function (d, i) {
            tooltip.move();})
        .on("mouseout", function (d, i) {
            tooltip.hide();});

    // Lebanon line
    vis.svg.append('line')
        .attr("id", "lebanonline")
        .attr('font-size', "25px" )
        .attr("x1",vis.projection([35.3, 33.75])[0]-10)
        .attr("x2",vis.projection([36.1, 33.75])[0]-10)
        .attr("y1",vis.projection([35.3, 33.75])[1]-10)
        .attr("y2",vis.projection([36.1, 33.75])[1]-10)
        .style("stroke", countercolor)
        .style("stroke-width", "2");


    // -------------------------------------------------------------------------
    // Initialize little people counter ;) <-- I am so excited about this ;)
    // -------------------------------------------------------------------------

    vis.peoplecoordinates = {
        TUR : {coord: [31.1, 37.75], array: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18], cutoff: 9},
        IRQ : {coord: [37.6, 33.00],  array: [1,2,3], cutoff: 9},
        JOR : {coord: [35.5, 31.1],  array: [1,2,3,4,5,6,7], cutoff: 3 },
        EGY : {coord: [28.9, 30.4],  array: [1,2], cutoff: 3  },
        LBN : {coord: [29.5, 33.0],  array: [1,2,3,4,5,6,7,8,9,10,11,12], cutoff: 6}
    };


    vis.peoplescaleAll = d3.scale.linear()
        .domain([1,10])
        .range([210,0]);
    vis.peoplescaleJOR = d3.scale.linear()
        .domain([1,10])
        .range([0,210]);
    vis.barwidth=210/10+3;


    vis.neighborcountries.forEach(function(v){
        vis.peoplescale  = (v=="JOR")? vis.peoplescaleJOR : vis.peoplescaleAll;
        vis[v+"people"] = vis.svg.selectAll('.littlepeople'+v).data(vis.peoplecoordinates[v]["array"]);
        vis[v+"people"]
            .enter().append("text")
            .attr("x", function(d){
                return (d>vis.peoplecoordinates[v]["cutoff"])? vis.peoplescale(d-vis.peoplecoordinates[v]["cutoff"]) : vis.peoplescale(d);})
            .attr("y", function(d){return (d>vis.peoplecoordinates[v]["cutoff"])? 35 : 0;})
            .attr("class", function(){return "littlepeople littlepeople"+v;})
            .attr("transform", function() {return "translate(" + vis.projection(vis.peoplecoordinates[v]["coord"]) + ")";})
            .attr('font-family', 'FontAwesome')
            .attr('font-size', figsize )
            .style("fill", "none")
            .text(function(d) {
                return (d % 2 == 0)? ' \uf183' : ' \uf182'})
            .on("mouseover", function (d, i) {tooltip.show(function(){
                return "<p class='tooltip-header'>" + countercoordinates[v]["name"] +"</p>";});})
            .on("mousemove", function (d, i) {
                tooltip.move();})
            .on("mouseout", function (d, i) {
                tooltip.hide();});

    });

    // Render places
    vis.svg.append("path")
        .datum(topojson.feature(vis.mapdata, vis.mapdata.objects.places))
        .attr("d", vis.path)
        .attr("class", "place");

    vis.svg.selectAll(".place-label")
        .data(topojson.feature(vis.mapdata, vis.mapdata.objects.places).features)
        .enter().append("text")
        .attr("class", "place-label")
        .attr("transform", function(d) { return "translate(" + vis.projection(d.geometry.coordinates) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });

    vis.svg.selectAll(".place-label")
        .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
        .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; });


    // -------------------------------------------------------------------------
    // Initialize play button / slider
    // -------------------------------------------------------------------------

    vis.infobox = vis.svg.append("g");
    vis.infobox
        .attr("class", "label axis")
        .append("rect")
        .attr("id", "infobox")
        .attr("x", vis.width-250)
        .attr("y", vis.height-55)
        .attr("width", 258)
        .attr("height", 60)
        .attr("fill", "black")
        .attr("opacity", 0);

    vis.infobox
        //.attr("class", "label axis")
        .append("text")
        .attr("id", "infotext")
        .attr("x", vis.width-240)
        .attr("y", vis.height-32)
        .attr("fill", "white")
        .attr("opacity", 0)
        .attr("font-size", '0.7em');
    vis.infobox
        //.attr("class", "label axis")
        .append("text")
        .attr("id", "infotext2")
        .attr("x", vis.width-240)
        .attr("y", vis.height-8)
        .attr("fill", "white")
        .attr("opacity", 0)
        .attr("font-size", '0.7em');

    vis.startvalue = d3.min(vis.eventdata, function(d){return d.Date});
    vis.currentTime = vis.startvalue;
    vis.grieveperiod = 60;

    vis.running = false;
    vis.clickcounter = 0;

    // Playbutton
    $("#playviolence").on("click", function(){
        if (vis.playmode=="play"){}
        else {
            vis.playmode="paused";
            vis.clickevent = true;
            brushed_violencemap();
            vis.playmode = "play";
            vis.clickevent = true;
            brushed_violencemap();}
    });

    // Fast forward-button
    $("#playviolence2").on("click", function(){
        if (vis.playmode=="fast"){}
        else{
            vis.playmode="paused";
            vis.clickevent = true;
            brushed_violencemap();
            vis.playmode = "fast";
            vis.clickevent = true;
            brushed_violencemap();}
    });

    // Pause button
    $("#playviolence3").on("click", function(){
        if (vis.playmode=="paused"){}
        else {
            vis.playmode = "paused";
            vis.clickevent = true;
            brushed_violencemap();}
    });


    // -------------------------------------------------------------------------
    // Initialize data select buttons
    // -------------------------------------------------------------------------

    vis.datacoloring = "vm_overview_legend";
    vis.legendselection = {
        'vm_overview_legend' : {},
        "vm_actortypes_legend": {
            "Government/Military": 1,
            "Civilians/Protesters": 1,
            "Rebels/Extremists": 1,
            "Unknown/Other" : 1,
            "Foreign" : 1,
            "Al Qaeda / Jabhat al-Nusra" : 1,
            "Kurds" : 1,
            "ISIS" : 1
        },
        'vm_violencetypes_legend': {
            "Other" : 1,
            "Military force/light weapons": 1,
            "Abduction" : 1,
            "Unconventional violence": 1,
            "(Mass) killing" : 1,
            "Bombings/Aereal weapons": 1,
            "Occupy territory": 1,
            "Property/Blockade": 1
        }
    };
    var prepstring = function(d){return d.replace(/\s+/g, '-').replace('/','').replace('(','').replace(')','').toLowerCase();}

    $('.vm_button').on('click', function(){
        $('.vm_legend').hide();
        var panelId = $(this).attr('data-panelid');
        $('#'+panelId).show();
        vis.datacoloring = panelId;

        actors.forEach(function(d){
            vis.legendselection['vm_actortypes_legend'][d] = 1;
            d3.select('#'+prepstring(d)).attr("fill-opacity", function(){
                return (vis.legendselection['vm_actortypes_legend'][d]);
            }).attr("stroke-opacity", 1);
        });

        eventtypes.forEach(function(d){
            vis.legendselection['vm_violencetypes_legend'][d] = 1;
            d3.select('#'+prepstring(d)).attr("fill-opacity", function(){
                return (vis.legendselection['vm_violencetypes_legend'][d]);
            }).attr("stroke-opacity", 1);
        });

        $(".vm_button").removeClass('selected');
        $(this).attr('class', 'btn btn-default vm_button selected');
        vis.updateVis();
    });

    // -------------------------------------------------------------------------
    // SVG drawing legends in buttons
    // -------------------------------------------------------------------------
    // Button actoroverview
    var svgwidth = $("#vm_actortypes_legend").width();
    var svgheight = 280;
    var button1svg = d3.select("#vm_actortypes_legend").append("svg")
        .attr("width", svgwidth)
        .attr("height", svgheight);

    button1svg.append("text").attr("class", "legend")
        .attr("x", 3)
        .attr("y", function(d,i){return 30*i+20+5.5;})
        .attr("fill", "white")
        .text("Click on any of the circles to select/deselect actors.");

    button1svg.selectAll("legend_actor_circle")
        .data(actors)
        .enter().append("circle")
        .attr("class", "legend_actor_circle")
        .attr("id", function(d){return prepstring(d);} )
        .attr("cx", 12)
        .attr("cy", function(d,i){return 30*i+50;})
        .attr("r", 9)
        .attr("fill", function(d,i){return actorcolors(d);} )
        .attr("stroke", function(d,i){return actorcolors(d);} )
        .attr("stroke-width", 3 )
        .attr("stroke-opacity", 1 )
        .on("click", function(d){
            vis.legendselection['vm_actortypes_legend'][d] = (vis.legendselection['vm_actortypes_legend'][d] ==1)? 0 : 1;
            d3.select('#'+prepstring(d)).attr("fill-opacity", function(){
                return (vis.legendselection['vm_actortypes_legend'][d]);
            }).attr("stroke-opacity", 1);
            vis.updateVis();
        });

    button1svg.selectAll(".textlegend1")
        .data(actors)
        .enter().append("text")
        .attr("class", "legend textlegend1")
        .attr("fill", function(d,i){return actorcolors(d);} )
        .attr("x", 32)
        .attr("y", function(d,i){return 30*i+50+5.5;})
        .text(function(d,i){return d;} )
        .on("click", function(d){
            vis.legendselection['vm_actortypes_legend'][d] = (vis.legendselection['vm_actortypes_legend'][d] ==1)? 0 : 1;
            d3.select('#'+prepstring(d)).attr("fill-opacity", function(){
                return (vis.legendselection['vm_actortypes_legend'][d]);
            }).attr("stroke-opacity", 1);
            vis.updateVis();
        });


    // Button eventoverview
    var svgwidth = $("#vm_actortypes_legend").width();
    var svgheight = 280;
    var button2svg = d3.select("#vm_violencetypes_legend").append("svg")
        .attr("width", svgwidth)
        .attr("height", svgheight);

    button2svg.append("text").attr("class", "legend")
        .attr("x", 3)
        .attr("y", function(d,i){return 30*i+20+5.5;})
        .attr("fill", "white")
        .text("Click on any of the circles to select/deselect types of violence.");

    button2svg.selectAll(".legend_violence_circle")
        .data(eventtypes)
        .enter().append("circle")
        .attr("class", "legend_violence_circle")
        .attr("id", function(d){return prepstring(d);} )
        .attr("cx", 12)
        .attr("cy", function(d,i){return 30*i+50;})
        .attr("r", 9)
        .attr("fill", function(d,i){return eventcolors(d);} )
        .attr("stroke", function(d,i){return eventcolors(d);} )
        .attr("stroke-width", 3 )
        .attr("stroke-opacity", 1 )
        .on("click", function(d){
            vis.legendselection['vm_violencetypes_legend'][d] = (vis.legendselection['vm_violencetypes_legend'][d] ==1)? 0 : 1;
            d3.select('#'+prepstring(d)).attr("fill-opacity", function(){
                return (vis.legendselection['vm_violencetypes_legend'][d]);
            }).attr("stroke-opacity", 1);
            vis.updateVis();
        });

    button2svg.selectAll(".textlegend2")
        .data(eventtypes)
        .enter().append("text")
        .attr("class", "legend textlegend2")
        .attr("fill", function(d,i){return eventcolors(d);} )
        .attr("x", 32)
        .attr("y", function(d,i){return 30*i+50+5.5;})
        .text(function(d,i){return d;} )
        .on("click", function(d){
            vis.legendselection['vm_violencetypes_legend'][d] = (vis.legendselection['vm_violencetypes_legend'][d] ==1)? 0 : 1;
            d3.select('#'+prepstring(d)).attr("fill-opacity", function(){
                return (vis.legendselection['vm_violencetypes_legend'][d]);
            }).attr("stroke-opacity", 1);
            vis.updateVis();
        });

    // Needs to come after SVG areas have been defined! (Else width of zero gets assigned)
    $('.vm_legend').hide();

    // Filter, aggregate, modify data
    vis.wrangleData();
};

ViolenceMap.prototype.wrangleData = function(){
    var vis = this;

    // -------------------------------------------------------------------------
    // Filter data (grievance period)
    // -------------------------------------------------------------------------
    vis.displayData = vis.eventdata.filter(function(d){return (d.Date >= (d3.time.day.offset(vis.currentTime,-vis.grieveperiod))) && (d.Date <= vis.currentTime);});

    vis.refugeeDisplay = {};
    vis.neighborcountries.forEach(function(d){


        var filtercountry = vis.refugeecount[d];
        var filterdates = filtercountry.filter(function(v){
            return (v.Date >= vis.currentTime);});
        var nextdate = d3.min(filterdates, function(d){return d.Date});
        var nextvalue = filtercountry.filter(function(v){return v.Date == nextdate})[0]["Value"];
        var mindate = d3.min(filtercountry, function(d){return d.Date});
        filterdates = filtercountry.filter(function(v){
            return (v.Date <= d3.max([vis.currentTime, mindate]));});
        var lastdate = (vis.currentTime < mindate) ? vis.startvalue : d3.max(filterdates, function(v){return v.Date;});
        var lastvalue = (vis.currentTime < mindate) ? 0 : filtercountry.filter(function(v){return v.Date == lastdate})[0]["Value"];

        var diff = Math.floor(vis.currentTime.getTime() - lastdate.getTime());
        var interval = Math.floor(nextdate.getTime() - lastdate.getTime());
        var day = 1000 * 60 * 60 * 24;
        var daysdiff = Math.floor(diff/day);
        var daysinterval = Math.floor(interval/day);

        vis.refugeeDisplay[d] = lastvalue + ((daysinterval==0)? 0 :(daysdiff/daysinterval)*(nextvalue-lastvalue));
    });
    vis.updateVis();
};

ViolenceMap.prototype.updateVis = function() {
    var vis = this;
    var diff, day, days;

    // -------------------------------------------------------------------------
    // Enter, update, exit sequence for circles
    // -------------------------------------------------------------------------
    vis.events = vis.svg.selectAll(".eventcircle")
        .data(vis.displayData, function(d, index){return d.Event_ID;});

    vis.events
        .enter().append("circle")
        .attr("class", "eventcircle")
        .attr("r", 15)
        .attr("fill", "red")
        .attr("fill", function(d){
            if (vis.datacoloring == "vm_overview_legend"){return "red";}
            else if (vis.datacoloring == "vm_actortypes_legend"){return actorcolors(d.Source_Sector_General);}
            else if (vis.datacoloring == "vm_violencetypes_legend"){return eventcolors(d.Event_Description_General);}
            else {return "red";}})
        .style("opacity", function(d){
            if (vis.datacoloring == "vm_overview_legend"){return 0.5;}
            else if (vis.datacoloring == "vm_actortypes_legend") {return (vis.legendselection[vis.datacoloring][d.Source_Sector_General])*0.6;}
            else {return (vis.legendselection[vis.datacoloring][d.Event_Description_General])*0.6;} ;
        })
        .style("stroke", "white")
        .attr("transform", function(d) {
            return "translate(" + vis.projection([d.Longitude+vis.normaldist()*vis.jitter, d.Latitude+vis.normaldist()*vis.jitter]) + ")";
        });

    vis.events
        .transition()
        .duration(150)
        .attr("fill", function(d){
            if (vis.datacoloring == "vm_overview_legend"){return "red";}
            else if (vis.datacoloring == "vm_actortypes_legend"){return actorcolors(d.Source_Sector_General);}
            else if (vis.datacoloring == "vm_violencetypes_legend"){return eventcolors(d.Event_Description_General);}
            else {return "red";}})
        .attr("r", function(d){
            diff = Math.floor(vis.currentTime.getTime() - d.Date.getTime());
            day = 1000 * 60 * 60 * 24;
            days = Math.floor(diff/day);
            return 20-(15)*(d3.min([0.75^(days+1),1]))
        })
        .style("opacity", function(d){
            if (vis.datacoloring == "vm_overview_legend"){return 0.5;}
            else if (vis.datacoloring == "vm_actortypes_legend") {return (vis.legendselection[vis.datacoloring][d.Source_Sector_General])*0.5;}
            else {return (vis.legendselection[vis.datacoloring][d.Event_Description_General])*0.5;} ;
        })
        .style("stroke-width", 0);

    vis.events.exit().remove();



    // -------------------------------------------------------------------------
    // Update sequence for refugee counter
    // -------------------------------------------------------------------------
    vis.counters
        .data(vis.neighborcountries)
        .text(function(d){
            var value = d3.round(vis.refugeeDisplay[d],0);
            return d3.format(",d")(value);
        });

    vis.rectscale = d3.scale.linear()
        .domain([0,100000])
        .range([0,30]);

    // -------------------------------------------------------------------------
    // Update sequence for people counter
    // -------------------------------------------------------------------------
    vis.neighborcountries.forEach(function(v){
        vis.peoplescale  = (v=="JOR")? vis.peoplescaleJOR : vis.peoplescaleAll;
        vis[v+"people"] = vis.svg.selectAll('.littlepeople'+v).data(vis.peoplecoordinates[v]["array"]);
        vis[v+"people"]
            .style("opacity", 0.65)
            .style("fill", function(d){
                if (vis.refugeeDisplay[v]<=((d-1)*100000)){return "none";}
                else if (vis.refugeeDisplay[v]>=(d*100000)){return "white";}
                else {
                    var fill = Math.floor((vis.refugeeDisplay[v]-(d-1)*100000)/1000)+1;
                    return "url('#pattern"+fill+"')";}
            });
    });

    // -------------------------------------------------------------------------
    // Update sequence for calendar
    // -------------------------------------------------------------------------
    d3.select("#calendar")
        .html("<time datetime="+d3.time.format('%Y-%m-%d')(vis.currentTime)+" class='icon'>"+
            "<em>"+ d3.time.format('%B')(vis.currentTime)+"</em>"+
            "<strong>"+ d3.time.format('%Y')(vis.currentTime)+"</strong>"+
            "<span>"+ d3.time.format('%e')(vis.currentTime)+"</span>"+
            "</time>");
};


