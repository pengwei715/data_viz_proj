/**
 * Created by lili on 2/7/16.
 */

// Write HTML with JS
document.getElementById("content-3").innerHTML = '<h1>Attractions</h1>...and some';

// Loop through array, build HTML block and finally display it on the page
var fruits = ["Orange", "Banana", "Apple"];
var result = '';
for (var i = 0; i < fruits.length; i++) {
    result += fruits[i] + "<br/>";
}

document.getElementById("content-4").innerHTML = result;