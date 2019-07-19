/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

StationMap = function(_parentElement, _data, _mapPosition) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.position = _mapPosition;
  this.initVis();
};


StationMap.prototype.initVis = function() {
  var vis = this;

  vis.map = L.map(vis.parentElement).setView(vis.position, 13);
  vis.tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(vis.map);


  $.getJSON("js/MBTA-Lines.json", function(data){
    vis.mbta = data;
    //console.log(data);
    vis.wrangleData();
  });
};


StationMap.prototype.wrangleData = function() {
  var vis = this;

  // Currently no data wrangling/filtering needed
  // vis.displayData = vis.data;

  // Update the visualization
  vis.updateVis();
};


StationMap.prototype.updateVis = function() {
  var vis = this;

  var popupContent = "<strong>Maxwell-Dworkin</strong><br/>";
  popupContent += "Harvard University";

  // Create a marker
  var marker = L.marker([42.378774, -71.117303])
      .bindPopup(popupContent)
      .addTo(vis.map);

  // Add empty layer groups for the markers
  bostonstation = L.layerGroup().addTo(vis.map);
  // Create marker
  vis.data.forEach(function(d){
    var popupContent = "<strong>"+ d.name+"</strong><br/>";
    popupContent += "Available bikes: " + d.nbBikes + "<br/>";
    popupContent += "Available docks: " + d.nbEmptyDocks;
    var newmarker = L.marker([d.lat, d.long]).bindPopup(popupContent);
    bostonstation.addLayer(newmarker);
  });


  // Add GeoJSON Layer
  vis.mbtaline = L.geoJson(vis.mbta, {
    style: newStyle,
    weight: 10,
    fillOpacity: 0.9
  }).addTo(vis.map);


  function newStyle(feature) {
    switch (feature.properties.LINE) {
      case 'RED': return { color: "red" };
      case 'SILVER': return { color: "darkgrey" };
      case 'ORANGE': return { color: "darkorange" };
      case 'GREEN': return { color: "darkgreen" };
      case 'BLUE': return { color: "darkblue" };
    }};

};
