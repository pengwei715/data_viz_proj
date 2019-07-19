
function createRiskMap(flag){
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

  queue()
    .defer(d3.json, "data/africa.topo.json")
    .defer(d3.csv, "data/global-malaria-2015.csv",function(d) { 
        
        if(d.WHO_region == "African"){
          //console.log(d);
          if(flag != "highrisk"){
            rateById.set(d.Code, +d.At_risk); 
          }else{
            rateById.set(d.Code, +d.At_high_risk);
          }
      }
    })
    .await(function(error, mapTopJson, malariaDataCsv){
        if (error) throw error;

        console.log(mapTopJson,malariaDataCsv);
       
      //------------------------------------------

      var colorRange = (flag == "highrisk")? colorbrewer.Oranges["6"]: colorbrewer.Oranges["6"];
      var colorScale = d3.scale.threshold()
        .domain([20, 40, 60, 80, 100])
        .range(colorRange);

      formatValue = d3.format(".0%");
      // A position encoding for the key only.
      var list = ([20, 40, 60, 80, 100]);
      for(var i=0;i<list.length;i++){
        list[i] = 50000000/100*list[i];
      }
      var x = d3.scale.linear()
          .domain([0, 50000000])
          .range([0, 500]);
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickSize(13)
          .tickValues(list)
          .tickFormat(function(d) { return formatValue(d/50000000)});

      // key
      var g = svg.append("g")
          .attr("class", "key")
          .attr("transform", "translate(80,30)");

      g.selectAll("rect")
          .data(colorScale.range().map(function(d, i) {
              console.log(x(i*10000000));
            return {
              x0: x(i*10000000), //colorScale.domain()[i] - 100 ,
              x1: x((i+1)*10000000), //colorScale.domain()[i] ,
              z: d
            };
          }))
        .enter().append("rect")
          .attr("height", 8)
          .attr("x", function(d) { return d.x0; })
          .attr("width", function(d) { return d.x1 - d.x0; })
          .style("fill", function(d) { return d.z; });

        var title = (flag == "highrisk")? "Malaria in Africa: At High Risk": "Malaria in Africa: At  Risk";

      g.call(xAxis).append("text")
          .attr("class", "caption")
          .attr("y", -6)
          .text(title);
      g.call(xAxis).append("text")
          .attr("y", 480)
          .text("Source: United Nation. Note: Blank areas indicate data not available.");
      // key end

      //------------------------------------    
      // --> Process Data
        var africa = topojson.feature(mapTopJson, mapTopJson.objects.collection).features;
        console.log("africa:");
        console.log(africa);
      // Data end

       //------------------------------------
       // --> Map
        var numFormat = d3.format(".0%");
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
            /*  console.log("d:");
                console.log(d.properties.adm0_a3_is);*/

                var risk = rateById.get(d.properties.adm0_a3_is);
                if(typeof risk === "undifuned" || 
                    isNaN(risk)
                  ){
                  tooltip.show("<b>"+d.properties.name+ "</b>" + "<br>" + "Risk: No Data" );
                console.log(d.properties.adm0_a3_is);
                }else{
                  tooltip.show("<b>"+d.properties.name+ "</b>" + "<br>" + "Risk: " + numFormat(risk/100)); 
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