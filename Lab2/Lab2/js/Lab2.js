/**
 * Created by lili on 2/4/16.
 */

//---------Activity 1----------------------
var attractions = [
    {
        id:1,
        name:"Pendulum Ride",
        price:20 ,
        openingdays: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        children: "no"
    },
    {
        id:2,
        name:"Train Ride",
        price:10 ,
        openingdays:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        children: "yes"
    },
    {
        id:3,
        name:"Water Ride",
        price:15 ,
        openingdays:["Tuesday","Wednesday","Thursday","Friday","Saturday", "Sunday"],
        children: "yes"
    }

];

console.log(attractions[0].name);
console.log(attractions[1].openingdays);
console.log(attractions[1].openingdays[0]);
console.log(attractions[2].price*0.5);
console.log(attractions[0].name+" is $"+attractions[0].price)

//---------Activity 2----------------------

//Method 1:
//Function doublePrices()
var doublePrices = function(amusementRides) {
    return amusementRides*2
}

for (var i=0; i<attractions.length; i++) {
    var amusementRidesDouble=doublePrices(attractions[i].price);
    console.log(amusementRidesDouble);
}

for (var j=0; j<attractions.length; j++) {
    if (j==0 || j==2) {
        var amusementRidesDouble2=doublePrices(attractions[j].price);
        console.log(amusementRidesDouble2);
    }
    else {
        console.log(attractions[j].price);
    }
}

/*
for (var property in attractions[0]) {
    console.log(property + ":" + attractions[0][property])
}
*/

//Function debugAmusementRides()
debugAmusementRides();
function debugAmusementRides() {
    for (var k = 0; k < attractions.length; k++) {
        if (k == 0 || k == 2) {
            var amusementRidesDouble3 = doublePrices(attractions[k].price);
            console.log(attractions[k].name + "'s new price is $" + amusementRidesDouble3);
        }
        else {
            console.log(attractions[k].name + "'s new price is $" + attractions[k].price);
        }
    }
};

//Method 2 to replace function debugAmusementRides
var result = '';
for (var k = 0; k < attractions.length; k++) {
    if (k == 0 || k == 2) {
        var amusementRidesDouble3 = doublePrices(attractions[k].price);
        console.log("New test:"  +amusementRidesDouble3);
        result += attractions[k].name + "'s new price is $" + amusementRidesDouble3 + "<br/>";
    }
    else {
        result += attractions[k].name + "'s new price is $" + attractions[k].price + "<br/>";
    }
};

/*Alternatives ways
function printResults(attractions) {
    console.log(attractions);
    var result = '';
    for (var k = 0; k < attractions.length; k++) {
        if (k == 0 || k == 2) {
            var amusementRidesDouble3 = doublePrices(attractions[k].price);
            console.log("New test:"  +amusementRidesDouble3);
            result += attractions[k].name + "'s new price is $" + amusementRidesDouble3 + "<br/>";
        }
        else {
            result += attractions[k].name + "'s new price is $" + attractions[k].price + "<br/>";
        }
    };
    console.log(result);
    document.getElementById("content-2").innerHTML = result;
};


// Method 3: Use forEach function later
    var prices = [attractions[0].price, attractions[1].price, attractions[2].price];
    prices.forEach(doublePrices);
}

attractions.forEach(function(attractions)){
    console.log(attractions.name+"is $"+attractions.price)
}
*/




