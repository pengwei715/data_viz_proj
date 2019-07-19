/**
 * Created by lili on 2/11/16.
 */

var padding = 30;

/*Activity 3*/
/*
d3.select("body").append("div").text("Dynamic Content");
*/

/* Activity 2*/

/*
var sandwiches = [
    { name: "Thesis", price: 7.95, size: "large" },
    { name: "Dissertation", price: 8.95, size: "large" },
    { name: "Highlander", price: 6.50, size: "small" },
    { name: "Just Tuna", price: 6.50, size: "small" },
    { name: "So-La", price: 7.95, size: "large" },
    { name: "Special", price: 12.50, size: "small" }
];

svg = d3.select("body").append("svg")
    .attr("width", 600)
    .attr("height", 200);

svg.selectAll("circle")
    .data(sandwiches)
    .enter().append("circle")
    .attr("r", function(d) {
        if(d.size == 'large') {
            return 20
        }
        else {
            return 40
        }
    })
    .attr("fill", function(d){
        if (d.price>7) {
            return "yellow"
        }
        else{
            return "green"
        }
    })
    .attr("cx", function(d, i) {
        return padding+i*100
    })
    .attr("cy", 100)
    .attr("stroke","grey")
    .attr("stroke-width",10);
*/

/* Activity 3*/
d3.csv("cities.csv", function(data) {
    console.log(data);
    var data2 = data;
    var eucountry = data2.filter(function (el, ind) {
        return (el.eu === "true");
    });
    console.log(eucountry);

    d3.select("body").append("p").text("Number of EU cities : " + eucountry.length);
    eucountry.forEach(function(d){
        d.population = +d.population;
        d.x = +d.x;
        d.y = +d.y;
    })

    svg = d3.select("body").append("svg")
        .attr("width", 700)
        .attr("height", 550);

    svg.selectAll("circle")
        .data(eucountry)
        .enter().append("circle")
        .attr("cx", function(d){
            return d.x;
        })
        .attr("cy", function(d){
            return d.y;
        })
        .attr("r", function(d){
            if (d.population<1000000) {
                return 4;
            }
            else {
                return 8;
            }
        })
        .attr("fill", "blue")

    console.log(eucountry);

    svg.selectAll("text")
        .data(eucountry)
        .enter().append("text")
        .attr("class","city-label")
        .attr("x", function(d){
            return d.x;
        })
        .attr("y",function(d){
            return d.y-11;
        })
        .attr("fill","black")
        .text(function(d){
                return d.city;
        })
        .attr("opacity",function(d){
            if (d.population>1000000) {
                return 1;
            }
            else {
                return 0;
            }
        })
});

