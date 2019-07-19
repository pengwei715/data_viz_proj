//------------------------------------------
// --> Tooltip
var tooltip = {
    element: null,
    init: function() {
        this.element = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
    },
    show: function(t) {
        this.element.html(t).transition().duration(200).style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY - 10 + "px").style("opacity", .9);
    },
    move: function() {
        this.element.transition().duration(30).ease("linear").style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY - 10 + "px").style("opacity", .9);
    },
    hide: function() {
        this.element.transition().duration(500).style("opacity", 0)
    }};

tooltip.init();
// Tooltip end

//------------------------------------------
// --> Combobox

/*var flag = 0;
$("button").on("click", function(){
    switch($(this).attr("id")){
        case "case":
            if(flag != 4){
                $("#chart-area").empty();
                createMap("case");
                flag = 4;
            }
            break;
        case "suspcase":
            if(flag != 3){
                $("#chart-area").empty();
                createMap("suspcase");
                flag = 3;
            }
            break;

        case "highrisk":
            if(flag != 2){
                $("#chart-area").empty();
                createMap("highrisk");
                flag = 2;
            }
            break;
        case "risk":
            if(flag != 1){
                $("#chart-area").empty();
                createMap("risk");
                flag = 1;
            }
            break;
        case "popu":
            if(flag != 0){
                $("#chart-area").empty();
                createMap();
                flag = 0;
            }
            break;
    }
});*/


var flag = 0;
$("button").on("click", function(){
    switch($(this).attr("id")){
        case "case":
            if(flag != 4){
                $("#chart-area").empty();
                createCaseMap("case");
                flag = 4;
            }
            break;
        case "suspcase":
            if(flag != 3){
                $("#chart-area").empty();
                createCaseMap();
                flag = 3;
            }
            break;

        case "highrisk":
            if(flag != 2){
                $("#chart-area").empty();
                createRiskMap("highrisk");
                flag = 2;
            }
            break;
        case "risk":
            if(flag != 1){
                $("#chart-area").empty();
                createRiskMap();
                flag = 1;
            }
            break;
        case "popu":
            if(flag != 0){
                $("#chart-area").empty();
                createPopMap();
                flag = 0;
            }
            break;
    }
});
// Combobox end

createTree();
createPopMap();
