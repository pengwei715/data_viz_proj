
// The function is called every time when an order comes in or an order gets processed
// The current order queue is stored in the variable 'orders'


// SVG Size
var margin = {top: 10, right:10, bottom: 30, left:30};
var padding = 100;
var w = 600 - margin.left - margin.right;
var h = 200 - margin.top - margin.bottom;

svg = d3.select("#chart-area").append("svg")
	.attr("width",w + margin.left + margin.right )
	.attr("height",h + margin.top + margin.bottom)
	.attr("transform","translate(" + margin.left + "," + margin.top+")");

// ACTIVITY 1
function updateVisualization(orders) {
	console.log(orders);
	console.log(orders.length);

	orders.forEach(function(d){
		d.price = +d.price;
	});

	var circle = svg.selectAll("circle")
		.data(orders);

	//Enter
	circle.enter().append("circle")
		.attr("class", "dot")
		.transition()
		.duration(3000)
		.attr("fill",function(d){
			if(d.product=="coffee"){
				return "red"}
				else return "blue";
			});

	//Update -- that can potentially change
	circle
		.attr("r",function(d){return d.price*5;})
		.attr("cx",function(d,i){return (i*80+padding)})
		.attr("cy",80);

	console.log(circle.exit());
	console.log(circle.enter());

	//Exit
	circle.exit().remove();

	//Text
	svg.selectAll("text").remove();
	var text = svg.append("text")
			.transition()
			.duration(3000)
			.attr("x",0)
			.attr('y',85)
			.text( "Orders: "+ orders.length );
}

