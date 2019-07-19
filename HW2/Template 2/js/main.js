

// DATASETS

// Global variable with 1198 pizza deliveries
// console.log(deliveryData);

// Global variable with 200 customer feedbacks
// console.log(feedbackData.length);


// FILTER DATA, THEN DISPLAY SUMMARY OF DATA & BAR CHART

createVisualization();

function createVisualization() {
    var deliverydata = deliveryData;
    console.log(deliverydata);
    var feedbackdata = feedbackData;
    console.log(feedbackdata);
    var result = '';

    /*number of pizza delievery*/
    var num_delivery = deliverydata.length;
    console.log("feedback"+num_delivery);
    result += "Number of diliveries: " + num_delivery + "<br/>";
    console.log(result);

    /*number of all delivered pizzas*/
    num_pizza = 0;
    for (var i = 0; i < deliverydata.length; i++) {
        var numPizza = deliverydata[i].count;
        num_pizza = num_pizza + numPizza;
    }
    console.log(num_pizza);
    result += "Number of all delivered pizzas: " + num_pizza + "<br/>";

    /*average delivery time*/
    total_time = 0;
    for (var i = 0; i < deliverydata.length; i++) {
        var numTime = deliverydata[i].delivery_time;
        total_time = total_time + numTime;
    }
    var avg_time = total_time / num_delivery;
    console.log(avg_time);
    result += "Average delivery time: " + avg_time + "<br/>";

    /*total sales in USD*/
    total_sales = 0;
    for (var i = 0; i < deliverydata.length; i++) {
        var sales = deliverydata[i].price;
        total_sales = total_sales + sales;
    }
    console.log(total_sales);
    result += "Total sales in USD: " + total_sales + "<br/>";

    /*number of all feedback entries*/
    var num_feedback = feedbackdata.length;
    console.log("feedback"+num_feedback);
    result += "Number of all feedback entries: " + num_feedback + "<br/>";

    /*number of feedback entries per quality category: low, medium, high*/
    var num_low = dataFiltering1().length;
    console.log("feedback"+num_low);
    var num_med = dataFiltering2().length;
    console.log("feedback"+num_med);
    var num_hig = dataFiltering3().length;
    console.log("feedback"+num_hig);

    result += "Number of feedback entries, low quality: " + num_low + "<br/>";
    result += "Number of feedback entries, medium quality: " + num_med + "<br/>";
    result += "Number of feedback entries, high quality: " + num_hig + "<br/>";

    document.getElementById("content-2").innerHTML = result;
    renderBarChart(deliveryData);
}


function createVisualization2(selectedValue1,selectedValue2) {
    var deliverydata2 = deliveryData;
    console.log(deliverydata2);
    var feedbackdata2 = feedbackData;
    console.log(feedbackdata2);
    var result = '';
    console.log(selectedValue1 + selectedValue2);

    if (selectedValue1 == "all") {
        var deliverydata3 = deliverydata2;
    }
    else {
        var deliverydata3 = deliverydata2.filter(function(el,index){
            return (el.area == selectedValue1);
        });
    }
    console.log("Length of filtered data" + deliverydata3.length);

    if (selectedValue2 == "all") {
        var deliverydata = deliverydata3;
    }
    else {
        var deliverydata = deliverydata3.filter(function(el,index){
            return (el.order_type == selectedValue2);
        });
    }
    console.log("Length of filtered data" + deliverydata.length);

    /*number of pizza delievery*/
    var num_delivery = deliverydata.length;
    console.log("feedback"+num_delivery);
    result += "Number of diliveries: " + num_delivery + "<br/>";
    console.log(result);

    /*number of all delivered pizzas*/
    num_pizza = 0;
    for (var i = 0; i < deliverydata.length; i++) {
        var numPizza = deliverydata[i].count;
        num_pizza = num_pizza + numPizza;
    }
    console.log(num_pizza);
    result += "Number of all delivered pizzas: " + num_pizza + "<br/>";

    /*average delivery time*/
    total_time = 0;
    for (var i = 0; i < deliverydata.length; i++) {
        var numTime = deliverydata[i].delivery_time;
        total_time = total_time + numTime;
    }
    var avg_time = total_time / num_delivery;
    console.log(avg_time);
    result += "Average delivery time: " + avg_time + "<br/>";

    /*total sales in USD*/
    total_sales = 0;
    var allrestaurants = [];
    for (var i = 0; i < deliverydata.length; i++) {
        var sales = deliverydata[i].price;
        total_sales = total_sales + sales;
        allrestaurants.push(deliverydata[i].delivery_id);
    }
    console.log(total_sales);
    result += "Total sales in USD: " + total_sales + "<br/>";

    var feedbackdata = [];
    for (rest in allrestaurants){
        for (element in feedbackdata2){
            if (feedbackdata2[element].delivery_id===allrestaurants[rest]){
                feedbackdata.push(feedbackdata2[element]);
            }
        }
    };

    /*number of all feedback entries*/
    var num_feedback = feedbackdata.length;
    console.log("feedback"+num_feedback);
    result += "Number of all feedback entries: " + num_feedback + "<br/>";

    /*number of feedback entries per quality category: low, medium, high*/
    var num_low = dataFiltering1().length;
    console.log("feedback"+num_low);
    var num_med = dataFiltering2().length;
    console.log("feedback"+num_med);
    var num_hig = dataFiltering3().length;
    console.log("feedback"+num_hig);

    result += "Number of feedback entries if quality is low: " + num_low + "<br/>";
    result += "Number of feedback entries if quality is medium: " + num_med + "<br/>";
    result += "Number of feedback entries if quality is high: " + num_hig + "<br/>";

    document.getElementById("content-2").innerHTML = result;

    renderBarChart(deliverydata);
}

function dataManipulation() {
    var selectBox1 = document.getElementById("attraction-category1");
    var selectedValue1 = selectBox1.options[selectBox1.selectedIndex].value;
    var selectBox2 = document.getElementById("attraction-category2");
    var selectedValue2 = selectBox2.options[selectBox2.selectedIndex].value;
    console.log(selectedValue2);
    createVisualization2(selectedValue1, selectedValue2);
}

function dataFiltering1() {
    var feedbackdata = feedbackData;
    var lowquality = feedbackdata.filter(function (el, index) {
        return (el.quality === "low");
        console.log(lowquality);
    });
    return lowquality;
}
function dataFiltering2() {
    var feedbackdata = feedbackData;
    var medquality = feedbackdata.filter(function (el, index) {
        return (el.quality === "medium");
        console.log(medquality);
    });
    return medquality;
}

function dataFiltering3() {
    var feedbackdata = feedbackData;
    var higquality = feedbackdata.filter(function (el, index) {
        return (el.quality === "high");
        console.log(higquality);
    });
    return higquality;
}
/* ************************************************************
 *
 * ADD YOUR CODE HERE
 * (accordingly to the instructions in the HW2 assignment)
 *
 * 1) Filter data
 * 2) Display key figures
 * 3) Display bar chart
 * 4) React to user input and start with (1)
 *
 * ************************************************************/
