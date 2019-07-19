
// Global variable with 60 attractions (JSON format)
// console.log(attractionData);

dataFiltering();

function dataFiltering() {
	var attractions = attractionData;
	attractions.sort(function (a, b) {
		return b.Visitors - a.Visitors;
	});
	console.log(attractions);

	var topattractions = attractions.filter(function (el) {
		return (el["Location"] === attractions[0]["Location"]) || (el["Location"] === attractions[1]["Location"])
			||(el["Location"] === attractions[2]["Location"])||(el["Location"] === attractions[3]["Location"])
			||(el["Location"] === attractions[4]["Location"]);
	});
	console.log(topattractions);
	renderBarChart(topattractions);
}


/*write a second datafiltering function with an alternative method*/
function dataFiltering2(selectedValue) {
    var attractions=attractionData;
    if (selectedValue === "all"){
        var attractions2 = attractions;
    }
    else {
        var attractions2 = attractions.filter(function(el,index) {
            return (el.Category === selectedValue);
        });
    }
        attractions2.sort(function (a, b) {
            return b.Visitors - a.Visitors;
        });
    console.log(attractions2);
    var data = attractions2.filter(function(el,index) {
        return (index<5);
    });
    console.log(attractions2);
    renderBarChart(data);
}

dataManipulation();

function dataManipulation() {
    var selectBox = document.getElementById("attraction-category");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    console.log(selectedValue);
    dataFiltering2(selectedValue);
    }



/*
 for (var i=0; i<5; i++) {
 var topattractions = attractions.filter(function (el) {
 return (el["Location"] === attractions[i]["Location"]);
 topattractions.push(topattractions)
 });
 console.log(topattractions);
 }
 */

	/* **************************************************
	 *
	 * ADD YOUR CODE HERE (ARRAY/DATA MANIPULATION)
	 *
	 * CALL THE FOLLOWING FUNCTION TO RENDER THE BAR-CHART:
	 *
	 * renderBarChart(data)
	 *
	 * - 'data' must be an array of JSON objects
	 * - the max. length of 'data' is 5
	 *
	 * **************************************************/

