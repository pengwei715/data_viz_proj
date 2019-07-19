
    // --> CREATE SVG DRAWING AREA
    var width = 600;
    height = 570;

    var svg = d3.select("#chart-area").append("svg")
        .attr("width", width)
        .attr("height", height);

    var projection = d3.geo.mercator()
        .scale(300)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var rateById = d3.map();

    var x = d3.scale.linear()
        .range([0, 500]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(13)
        .tickValues(colorScale.domain());


    var g = svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(80,30)");

    var title;

    function createMap(flag){
        queue()
        .defer(d3.json, "data/africa.topo.json")
        .defer(d3.csv, "data/global-malaria-2015.csv",function(d) {

            if(d.WHO_region == "African"){
                //console.log(d);
                if (flag == "case"){rateById.set(d.Code, +d.Malaria_cases);}
                if (flag == "suspcase") {rateById.set(d.Code, +d.Suspected_malaria_cases);}
                if (flag == "risk") {rateById.set(d.Code, +d.At_risk);}
                if (flag == "highrisk") {rateById.set(d.Code, +d.At_high_risk);}
                else{rateById.set(d.Code, +d.UN_population);}
            }
        })
        .await(function(error, mapTopJson, malariaDataCsv){
            if (error) throw error;

            console.log(mapTopJson,malariaDataCsv);
            //------------------------------------------
            var colorScale = d3.scale.threshold();

            formatValue1 = d3.format("s");
            formatValue2 = d3.format(".0%");


            if (flag == "case" || flag == "suspcase") {
                colorScale.domain([200000,10000000, 15000000, 20000000, 25000000, 30000000,65000000])
                    .range(colorbrewer.Greens["8"]);
                x.domain([0,70000000]);
                xAxis.tickValues(colorScale.domain())
                    .tickFormat(function(d) { return formatValue1(d)});
                title = (flag == "case")? "Malaria Cases": "Suspected Malaria Cases";
            }
            if (flag == "risk" || flag == "highrisk"){
                colorScale.domain([20, 40, 60, 80, 100])
                    .range(colorbrewer.Oranges["6"]);
                var list = ([20, 40, 60, 80, 100]);
                for(var i=0;i<list.length;i++){
                    list[i] = 50000000/100*list[i];
                }
                x.domain([0, 50000000]);
                xAxis.tickValues(list)
                    .tickFormat(function(d) { return formatValue(d/50000000)});

                title = (flag == "highrisk")? "At High Risk": "At  Risk";
            }
            else {
                colorScale.domain([2000000, 10000000,  20000000, 30000000, 45000000,60000000,100000000])
                    .range(colorbrewer.Paired["8"]);
                x.domain([800000,100000000]);
                xAxis.tickValues(colorScale.domain())
                    .tickFormat(function(d) {return formatValue1(d)});
                title = "Population";
            }


            // ------------------------------------------
            // --> key
            g.selectAll("rect")
                .data(colorScale.range().map(function(d, i) {
                    return {
                        x0: i ? x(colorScale.domain()[i - 1]) : x.range()[0],
                        x1: i < colorScale.domain().length ? x(colorScale.domain()[i]) : x.range()[1],
                        z: d
                    };
                }))
                .enter().append("rect")
                .transition()
                .duration(800)
                .attr("height", 8)
                .attr("x", function(d) { return d.x0; })
                .attr("width", function(d) { return d.x1 - d.x0; })
                .style("fill", function(d) { return d.z; });

            var title = (flag == "case")? "Malaria Cases in Africa": "Suspected Malaria Cases in Africa";

            g.call(xAxis).append("text")
                .attr("class", "caption")
                .attr("y", -6)
                .text(title);
            g.call(xAxis).append("text")
                .attr("y", 480)
                .text("Source: United Nation. Note: Blank areas indicate data not available.");
            // --> key end

            //------------------------------------
            // --> Process Data
            var africa = topojson.feature(mapTopJson, mapTopJson.objects.collection).features;
            console.log("africa:");
            console.log(africa);
            // Data end

            // --> Map
            var numFormat = d3.format(",d");
            var countries = svg.selectAll("path")
                .data(africa)
                .enter()
                .transition()
                .duration(800)
                .append("path")
                .attr('class', 'mapTopJson')
                .attr("d", path)
                .style("fill",function(d){
                    if (isNaN(rateById.get(d.properties.adm0_a3_is))){return "#FFFFFF"}
                    else { return colorScale(rateById.get(d.properties.adm0_a3_is));}
                })
                .attr( "stroke", "#C0B9B9" )
                .on("mouseover", function(d){
                    /*  console.log("d:");
                     console.log(d.properties.adm0_a3_is);*/

                    var input = rateById.get(d.properties.adm0_a3_is);
                    if(typeof input === "undifuned" ||
                        isNaN(input)
                    ){
                        tooltip.show("<b>"+d.properties.name+ "</b>" + "<br>" + title + ": No Data" );
                        console.log(d.properties.adm0_a3_is);
                    }else{
                        tooltip.show("<b>"+d.properties.name+ "</b>" + "<br>" + title + numFormat(input));
                    }
                })
                .on("mouseout", function(d){
                    d3.select("h2").text("null");
                    //d3.select(this).attr("class","incident");
                })
                .on("mousemove", function (d, i) {
                    tooltip.move();
                })
                .on("mouseout", function (d, i) {
                    //createStuff();
                    tooltip.hide();
                });
            //Map end
        });

}