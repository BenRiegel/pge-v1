var MapModel = function(){

  // coordinate system and map properties data from
  // https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/
  var worldExtent = {
    top: 2.0037507067161843E7,
    right: 2.0037507067161843E7,
    bottom: -2.0037507067161843E7,
    left: -2.0037507067161843E7
  };

  var worldCircumference = worldExtent.right - worldExtent.left;

  var mapProperties = {  //get rid of this
    "0" : {scaleLevel:0, pixelSize:156543.03392800014, mapSizePx:256},
    "1" : {scaleLevel:1, pixelSize:78271.51696399994, mapSizePx:512},
    "2" : {scaleLevel:2, pixelSize:39135.75848200009, mapSizePx:1024},
    "3" : {scaleLevel:3, pixelSize:19567.87924099992, mapSizePx:2048},
    "4" : {scaleLevel:4, pixelSize:9783.93962049996, mapSizePx:4096},
    "5" : {scaleLevel:5, pixelSize:4891.96981024998, mapSizePx:8192},
    "6" : {scaleLevel:6, pixelSize:2445.98490512499, mapSizePx:16384},
    "7" : {scaleLevel:7, pixelSize:1222.992452562495, mapSizePx:32768},
    "8" : {scaleLevel:8, pixelSize:611.4962262813797, mapSizePx:655536},
    "9" : {scaleLevel:9, pixelSize:305.74811314055756, mapSizePx:131072},
    "10" : {scaleLevel:10, pixelSize:152.87405657041106, mapSizePx:262144},
    "11" : {scaleLevel:11, pixelSize:76.43702828507324, mapSizePx:524288},
    "12" : {scaleLevel:12, pixelSize:38.21851414253662, mapSizePx:1048576}
  };

  var minScaleLevel = 2,
      maxScaleLevel = 12,
      scaleLevelIncrement = 1;

  var initScaleLevel = 2;

  var currentScaleLevel;
  var currentMapProperties = {
    scaleLevel: null,
    pixelSize: null,
    mapSizePx: null
  };

  //local functions ------------------------------------------------------------

  var normalizeWorldCoords = function(x, y){
    return {
      x: x - worldExtent.left,
      y: worldExtent.top - y
    }
  }

  //event handlers -------------------------------------------------------------

  var setScaleLevel = function(newScaleLevel){
    var mapScale = Math.pow(2, 29.1401870933751 - newScaleLevel);
    var pixelSize = mapScale / 3779.52;
    currentMapProperties.scaleLevel = newScaleLevel;
    currentMapProperties.pixelSize = pixelSize;
    currentMapProperties.mapSizePx = worldCircumference / pixelSize;
  }

  var init = function(){
    setScaleLevel(initScaleLevel);
  }

  //data request handlers ------------------------------------------------------

  var calculateMoveZResults = function(properties){
    var currentScaleLevel = currentMapProperties.scaleLevel;
    var newScaleLevel;
    switch (properties.type){
      case "in":
        newScaleLevel = currentScaleLevel + scaleLevelIncrement;
        break;
      case "out":
        newScaleLevel = currentScaleLevel - scaleLevelIncrement;
        break;
      case "home":
        newScaleLevel = initScaleLevel;
        break;
      case "to":
        newScaleLevel = currentScaleLevel + scaleLevelIncrement;
        break;
    }
    newScaleLevel = (newScaleLevel > maxScaleLevel)? maxScaleLevel : newScaleLevel;
    newScaleLevel = (newScaleLevel < minScaleLevel)? minScaleLevel : newScaleLevel;
    var deltaZ = newScaleLevel - currentScaleLevel;
    return ({old:currentScaleLevel, new:newScaleLevel, deltaZ:deltaZ});
  }

  var calculateWorldCoords = function(geoCoords){
    var x = geoCoords.lon * 20037508.34 / 180;
    var y = Math.log(Math.tan((90 + geoCoords.lat) * Math.PI / 360)) / (Math.PI) * 20037508.34;
    return normalizeWorldCoords(x, y);
  }

  var rectifyWorldCoords = function(worldCoords){
    var newX = (worldCoords.x < 0)? worldCoords.x + worldCircumference : worldCoords.x;
    newX = (newX > worldCircumference)? newX - worldCircumference : newX;
    var newY = (worldCoords.y < 0)? 0 : worldCoords.y;
    newY = (newY > worldCircumference)? worldCircumference : newY;
    return ({x:newX, y:newY});
  }

  var calculateDeltaX = function(xPoints){
    var halfCircumference = worldCircumference / 2;
    var deltaX = xPoints.x2 - xPoints.x1;
    deltaX = (deltaX < -halfCircumference)? deltaX + worldCircumference : deltaX;
    deltaX = (deltaX > halfCircumference)? deltaX - worldCircumference : deltaX;
    return deltaX;
  }

  var calculateMapCoords = function(worldCoords){
    var x = (worldCoords.x / worldCircumference * currentMapProperties.mapSizePx);
    var y = (worldCoords.y / worldCircumference * currentMapProperties.mapSizePx);
    return {x:x, y:y};
  }

  var getCurrentMapProperties = function(){
    return currentMapProperties;
  }

  //public variables -----------------------------------------------------------

  return {
    setScaleLevel: setScaleLevel,
    init: init,
    calculateMoveZResults: calculateMoveZResults,
    calculateWorldCoords: calculateWorldCoords,
    rectifyWorldCoords: rectifyWorldCoords,
    calculateDeltaX: calculateDeltaX,
    calculateMapCoords: calculateMapCoords,
    getCurrentMapProperties: getCurrentMapProperties
  };
}
