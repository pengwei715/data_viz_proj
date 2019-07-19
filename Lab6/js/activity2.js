
var width = 1000,
    height = 600;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geo.orthographic()
    .scale(300)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

// 1) INITIALIZE FORCE-LAYOUT


// Load data
d3.json("data/world-110m.json", function(countries) {
    d3.json("data/airports.json", function(airports) {
        // Convert TopoJSON to GeoJSON (target object = 'countries')
        var world = topojson.feature(countries, countries.objects.countries).features;
        // Render the world map by using the path generator
        svg.selectAll("path")
            .data(world)
            .enter().append("path")
            .attr('class', 'countries')
            .attr("d", path);

        console.log(countries);

        // Append airports
        var node = svg.selectAll(".airports")
            .data(airports.nodes)
            .enter().append("circle")
            .attr('class', 'airports')
            .attr("transform", function(d) {return "translate(" + projection([d.longitude, d.latitude]) + ")";});

        node.append("title")
            .text(function(d) { return d.name; });


        var edge = svg.selectAll(".edge")
            .data(airports.links)
            .enter().append("line")
            .attr("class", "edge")
            .attr("stroke", "blue");

        // Update edge coordinates
        edge
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

    })});
