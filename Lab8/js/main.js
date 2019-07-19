
var allData = [];

// Variable for the visualization instance
var stationmap, station;

// Start application by loading the data
loadData();


function loadData() {

  // Hubway XML station feed
  var url = 'https://www.thehubway.com/data/stations/bikeStations.xml';

  // Build YQL Query
  // Request JSON feed from the url
  var yql = 'http://query.yahooapis.com/v1/public/yql?q='
      + encodeURIComponent('SELECT * FROM xml WHERE url="' + url + '"')
      + '&format=json&callback=?';

  // Send an asynchronous HTTP request with jQuery

  $.getJSON(yql, function(jsonData){
    allData = jsonData;
    console.log(allData);
    station = allData.query.results.stations.station;
    console.log(station);
    createVis();
  });

}

function createVis() {
  //console.log(stations);

  station.forEach(function(d){
    d.id = +d.id;
    d.lat = +d.lat;
    d.long = +d.long;
  });

  $('#station-count').html(function(){return station.length;});

  // TO-DO: INSTANTIATE VISUALIZATION
  stationmap = new StationMap("station-map", station, [42.360082, -71.058880]);


}