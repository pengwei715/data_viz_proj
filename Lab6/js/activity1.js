
var width = 400,
    height = 400;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);


// 1) INITIALIZE FORCE-LAYOUT
d3.layout.force();
var force = d3.layout.force()
    .linkDistance(200)
    .size([width,height]);

// Load data
d3.json("data/airports.json", function(data) {
    console.log(data);

  // 2a) DEFINE 'NODES' AND 'EDGES'
    force
        .nodes(data.nodes)
        .links(data.links);

  // 2b) START RUNNING THE SIMULATION
    force.start();

  // 3) DRAW THE LINKS (SVG LINE)
    var edges = svg.selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("class","edges")
        .style("stroke","D7AF70")
        .style("stroke-width",function(d){
        return Math.sqrt(d.value)
    });

  // 4) DRAW THE NODES (SVG CIRCLE)
    var nodes = svg.selectAll(".node")
        .data(data.nodes)
        .enter().append("circle")
        .attr("class","nodes")
        .attr("r",10)
        .attr("fill", function(d){
            if (d.country=="United States") {
                return "#6661C8"
            }
            else {return "#EA526F"}
        });

    nodes.call(force.drag);
    nodes.append("title")
        .text(function(d) { return d.name; });

  // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS
    force.on("tick",function(){
        // Update node coordinate
        nodes
            .attr("cx",function(d){ return d.x; })
            .attr("cy",function(d){ return d.y; });

        // Update lines coordinate
        edges
            .attr("x1", function(d){ return d.source.x;})
            .attr("y1", function(d){ return d.source.y;})
            .attr("x2", function(d){ return d.target.x;})
            .attr("y2", function(d){ return d.target.y;});

    })
});