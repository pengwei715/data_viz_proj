

function createPopMap(){
  // --> CREATE SVG DRAWING AREA
  var width = 600;
      height = 560;

  var svg = d3.select("#chart-area").append("svg")
      .attr("width", width)
      .attr("height", height);

  var projection = d3.geo.mercator()
      .scale(300)
      .translate([width / 2, height / 2]);

  var path = d3.geo.path()
      .projection(projection);

  var rateById = d3.map();

  // Use the Queue.js library to read two files
  queue()
    .defer(d3.json, "data/africa.topo.json")
    .defer(d3.csv, "data/global-malaria-2015.csv",function(d) { 
        console.log(d);
        if(d.WHO_region == "African"){
          rateById.set(d.Code, +d.UN_population);
      }
    })
    .await(function(error, mapTopJson, malariaDataCsv){
        if (error) throw error;

        console.log(mapTopJson,malariaDataCsv);

      //------------------------------------------
      //--> Color
      var colorScale = d3.scale.threshold()
        .domain([2000000, 10000000,  20000000, 30000000, 45000000,60000000,100000000])
        .range(colorbrewer.Paired["8"]);


      formatValue = d3.format("s");
      // A position encoding for the key only.
      var x = d3.scale.linear()
          .domain([800000,100000000])
          .range([0, 500]);
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickSize(13)
          .tickValues(colorScale.domain())
          .tickFormat(function(d) { return formatValue(d)});
      //Color end

      // ------------------------------------------
      // --> key
      var g = svg.append("g")
          .attr("class", "key")
          .attr("transform", "translate(80,30)");

      g.selectAll("rect")
          .data(colorScale.range().map(function(d, i) {
            return {
              x0: i ? x(colorScale.domain()[i - 1]) : x.range()[0],
              x1: i < colorScale.domain().length ? x(colorScale.domain()[i]) : x.range()[1],
              z: d
            };
          }))
        .enter().append("rect")
          .attr("height", 8)
          .attr("x", function(d) { return d.x0; })
          .attr("width", function(d) { return d.x1 - d.x0; })
          .style("fill", function(d) { return d.z; });

      g.call(xAxis).append("text")
          .attr("class", "caption")
          .attr("y", -6)
          .text("African Population");

        g.call(xAxis).append("text")
            .attr("y", 480)
            .text("Source: United Nation. Note: Blank areas indicate data not available.");
      // --> key end

      //------------------------------------    
      // --> Process Data
        var malariaData = malariaDataCsv.filter(function(el, index){
            return (el.WHO_region == "African");
        });

        console.log("malariaData:");
        console.log(malariaData);

        var africa = topojson.feature(mapTopJson, mapTopJson.objects.collection).features;
        console.log("africa:");
        console.log(africa);
      // Data end

      // ------------------------------------
      // --> Map
        var numFormat = d3.format(",d");
        var countries = svg.selectAll("path")
            .data(africa)
            .enter().append("path")
            .attr('class', 'mapTopJson')
            .attr("d", path)
            .style("fill",function(d){
                if (isNaN(rateById.get(d.properties.adm0_a3_is))){return "#FFFFFF"}
                else { return colorScale(rateById.get(d.properties.adm0_a3_is));}
            })

            .attr( "stroke", "#C0B9B9" )
            .on("mouseover", function(d){
                /*console.log("d:");*/
                console.log(rateById.get(d.properties.adm0_a3_is));
                var pop = (typeof rateById.get(d.properties.adm0_a3_is) === "undefined")?   "No Data":rateById.get(d.properties.adm0_a3_is) ;
                tooltip.show("<b>"+d.properties.name+ "</b>" + "<br>" + "Population: " + numFormat(pop));
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
        // Map end

    });

}