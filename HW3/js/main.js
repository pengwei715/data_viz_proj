/**
 * Created by lili on 2/13/16.
 */
var padding = 5;


d3.csv("data/buildings.csv", function(data) {
    var data2 = data;

    data2.forEach(function(d) {
        d.floors = +d.floors;
        d.height_ft = +d.height_ft;
        d.height_m = +d.height_m;
        d.height_px = +d.height_px;
        d.completed = +d.completed
    });

    data2.sort(function (a, b) {
        return b.height_px - a.height_px;
    });
    console.log(data2);

    var svg = d3.select("div.col-xs-6").append("svg")
        .attr("width", 550)
        .attr("height", 500);

    var group = svg.selectAll("g")
        .data(data2)
        .enter().append("g")
        .attr("transform","translate(0,0)");

    var result = "";
    group.append("rect")
        .attr("x", 260)
        .attr("y", function(d,i){
            return padding+i*50;
        })
        .attr("height",40)
        .attr("width", function(d,i){
            return d.height_px;
        })
        .attr("fill","crimson")
        .attr("class", "bar-chat")
        .on("click",function(d,i){
            document.getElementById("content-0").innerHTML = d.building;
            document.getElementById("content-1").innerHTML = d.height_ft+" feet";
            document.getElementById("content-2").innerHTML = d.city;
            document.getElementById("content-3").innerHTML = d.country;
            document.getElementById("content-4").innerHTML = d.floors;
            document.getElementById("content-5").innerHTML = d.completed;
            document.getElementById("imageClick").src = "data/img/"+ d.image;
        });


    group.append("text")
        .attr("class", "buildingname")
        .attr("x",250)
        .attr("y",function(d,i){
            return padding+26+i*50;
        })
        .text(function(d){
            return d.building;
        })
        .attr("text-anchor","end")
        .on("click",function(d,i) {
            document.getElementById("content-0").innerHTML = d.building;
            document.getElementById("content-1").innerHTML = d.height_ft + " feet";
            document.getElementById("content-2").innerHTML = d.city;
            document.getElementById("content-3").innerHTML = d.country;
            document.getElementById("content-4").innerHTML = d.floors;
            document.getElementById("content-5").innerHTML = d.completed;
        });

    group.append("text")
        .attr("class", "buildingheight")
        .attr("x",function(d,i){
            return 250+d.height_px;
        })
        .attr("y",function(d,i){
            return padding+26+i*50;
        })
        .text(function(d){
            return d.height_ft;
        })
        .attr("text-anchor","end");

});
