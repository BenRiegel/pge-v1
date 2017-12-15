var WorldModel = (function(){

  //private coordinate system constants ----------------------------------------
  //see https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/

  const extent = {
    min: -2.0037507067161843E7,
    max: 2.0037507067161843E7,
  };

  //public attributes ----------------------------------------------------------

  const circumference = extent.max - extent.min;

  //private functions ----------------------------------------------------------

  var normalizeWorldCoords = function(x, y){
    return {
      x: x - extent.min,
      y: extent.max - y
    };
  };

  //public methods -------------------------------------------------------------

  var calculateWorldCoords = function(geoCoords){
    var x = geoCoords.lon * 20037508.34 / 180;
    var y = Math.log(Math.tan((90 + geoCoords.lat) * Math.PI / 360)) / (Math.PI) * 20037508.34;
    return normalizeWorldCoords(x, y);
  }

  var getCorrectedWorldCoords = function(worldCoords){
    var newX = (worldCoords.x < 0)? worldCoords.x + circumference : worldCoords.x;
    newX = (newX > circumference)? newX - circumference : newX;
    var newY = (worldCoords.y < 0)? 0 : worldCoords.y;
    newY = (newY > circumference)? circumference : newY;
    return ({x:newX, y:newY});
  }

  var rectifyExtentTop = function(yCoord){
    if (yCoord < 0){
      return 0;
    }
    return yCoord;
  }

  var rectifyExtentBottom = function(yCoord){
    if (yCoord > circumference){
      return circumference;
    }
    return yCoord;
  }

  var calculateDeltaX = function(xPoints){
    var halfCircumference = circumference / 2;
    var deltaX = xPoints.x2 - xPoints.x1;
    deltaX = (deltaX < -halfCircumference)? deltaX + circumference : deltaX;
    deltaX = (deltaX > halfCircumference)? deltaX - circumference : deltaX;
    return deltaX;
  }

  //----------------------------------------------------------------------------

  return {
    circumference: circumference,
    calculateWorldCoords: calculateWorldCoords,
    getCorrectedWorldCoords: getCorrectedWorldCoords,
    rectifyExtentTop: rectifyExtentTop,
    rectifyExtentBottom: rectifyExtentBottom,
    calculateDeltaX: calculateDeltaX,
  };

})();


//==============================================================================

var BasemapModel = (function(){

  //private constants
  //see https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/

  const maxScale = 5.91657527591555E8,
        log2MaxScale = Math.log2(maxScale),
        pixelsPerMeter = 3779.52;

  const esriMaxZoomLevel = 12,
        esriBasemapTileSizePx = 256;


  //public methods -------------------------------------------------------------

  var getProperties = function(zoomLevel){
    var mapScale = Math.pow(2, log2MaxScale - zoomLevel);
    var pixelSize = mapScale / pixelsPerMeter;
    var numPixels = WorldModel.circumference / pixelSize;
    return {
      pixelSize: pixelSize,
      numPixels: numPixels,
      numTiles: Math.round(numPixels / esriBasemapTileSizePx)
    };
  }

  var calculateHardMinZoomLevel = function(dimensions){
    var minZoomLevelX = Math.log2(dimensionsPx.width / esriBasemapTileSizePx );
    minZoomLevelX = Math.ceil(minZoomLevelX);
    var minZoomLevelY = Math.log2(dimensionsPx.height / esriBasemapTileSizePx );
    minZoomLevelY = Math.ceil(minZoomLevelY);
    minZoomLevel = Math.max(minZoomLevelX, minZoomLevelY);
  };

  //----------------------------------------------------------------------------

  return {
    getProperties: getProperties,
    esriMaxZoomLevel: esriMaxZoomLevel,
    esriBasemapTileSizePx: esriBasemapTileSizePx,
    calculateHardMinZoomLevel: calculateHardMinZoomLevel,
  };

})();
