var MapModel = function(){

  //data from https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/
  var wmExtent = {
    top: -2.0037507067161843E7,
    right: 2.0037507067161843E7,
    bottom: 2.0037507067161843E7,
    left: -2.0037507067161843E7
  };

  var wmExtentSize = wmExtent.right - wmExtent.left;

  var mapProperties = {
    "0" : {scale:5.91657527591555E8, pixelSize:156543.03392800014, mapSizePx:256},
    "1" : {scale:2.95828763795777E8, pixelSize:78271.51696399994, mapSizePx:512},
    "2" : {scale:1.47914381897889E8, pixelSize:39135.75848200009, mapSizePx:1024},
    "3" : {scale:7.3957190948944E7, pixelSize:19567.87924099992, mapSizePx:2048},
    "4" : {scale:3.6978595474472E7, pixelSize:9783.93962049996, mapSizePx:4096},
    "5" : {scale:1.8489297737236E7, pixelSize:4891.96981024998, mapSizePx:8192},
    "6" : {scale:9244648.868618, pixelSize:2445.98490512499, mapSizePx:16384},
    "7" : {scale:4622324.434309, pixelSize:1222.992452562495, mapSizePx:32768},
    "8" : {scale:2311162.217155, pixelSize:611.4962262813797, mapSizePx:655536},
    "9" : {scale:1155581.108577, pixelSize:305.74811314055756, mapSizePx:131072},
    "10" : {scale:577790.554289, pixelSize:152.87405657041106, mapSizePx:262144},
    "11" : {scale:288895.277144, pixelSize:76.43702828507324, mapSizePx:524288},
    "12" : {scale:144447.638572, pixelSize:38.21851414253662, mapSizePx:1048576}
  };

  var minScaleLevel = 2,
      maxScaleLevel = 12,
      scaleLevelIncrement = 1;

  var viewportDimensionsPx = {
    width: 905,
    height: 515
  };

  var homeViewPoint = {
    geoCoordsArray: [-5, 28],
    geoCoordsObj: {lon:-5, lat:28},
    wmCoords: {x:null, y:null},
    scaleLevel: 2
  };

  var basemapTileSizePx = 256;

  var mapCenterCoords = {x:null, y:null};
  var extent,
      bufferedExtent;
  var currentScaleLevel = homeViewPoint.scaleLevel;
  var currentMapProperties = mapProperties[currentScaleLevel];

  //helper functions -----------------------------------------------------------

  var calculateExtents = function(){

    var extentDimensions = {
      width: currentMapProperties.scale * viewportDimensionsPx.width / 3779.52,
      height: currentMapProperties.scale * viewportDimensionsPx.height / 3779.52
    };

    extent = {
      top: mapCenterCoords.y - extentDimensions.height / 2,
      right: mapCenterCoords.x + extentDimensions.width / 2,
      bottom: mapCenterCoords.y + extentDimensions.height / 2,
      left: mapCenterCoords.x - extentDimensions.width / 2
    };

    var topLeftPtWMLocation = {
      x: extent.left,
      y: extent.top
    }

    viewportOffsetCoords = calculateMapCoords(topLeftPtWMLocation);

    bufferedExtent = {
      top: extent.top - extentDimensions.height,
      right: extent.right + extentDimensions.width,
      bottom: extent.bottom + extentDimensions.height,
      left: extent.left - extentDimensions.width
    };

  }

  //event handlers -------------------------------------------------------------

  var setScaleLevel = function(newScaleLevel){
    currentScaleLevel = newScaleLevel;
    currentMapProperties = mapProperties[currentScaleLevel];
    calculateExtents();
  };

  //----------------------------------------------------------------------------

  var setNewLocation = function(newLocation){
    mapCenterCoords.x = newLocation.x;
    mapCenterCoords.y = newLocation.y;
    calculateExtents();
  }

  //----------------------------------------------------------------------------

  var updateViewportOffset = function(panData){
    viewportOffsetCoords.x -= panData.deltaX;
    viewportOffsetCoords.y -= panData.deltaY;
  }

  //----------------------------------------------------------------------------

  var updateViewportCenter = function(panData){
    mapCenterCoords.x -= panData.totalX * currentMapProperties.pixelSize;
    mapCenterCoords.y -= panData.totalY * currentMapProperties.pixelSize;
    calculateExtents();
  }

  //----------------------------------------------------------------------------

  var init = function(){
    homeViewPoint.wmCoords = calculateWMCoords(homeViewPoint.geoCoordsObj);
    setNewLocation(homeViewPoint.wmCoords);
  };

  //data request handlers ------------------------------------------------------

  var getCurrentMapProperties = function(){
    return currentMapProperties;
  }

  //----------------------------------------------------------------------------

  var calculateWMCoords = function(geoCoords){
    var x = geoCoords.lon * 20037508.34 / 180;
    var y = -Math.log(Math.tan((90 + geoCoords.lat) * Math.PI / 360)) / (Math.PI) * 20037508.34;
    return {x:x, y:y};
  }

  //----------------------------------------------------------------------------

  var calculateMapCoords = function(coords){
    var x = Math.round((coords.x - wmExtent.left) * currentMapProperties.mapSizePx / wmExtentSize);
    var y = Math.round((coords.y - wmExtent.top) * currentMapProperties.mapSizePx / wmExtentSize);
    return {x:x, y:y};
  }

  //----------------------------------------------------------------------------

  var calculateScreenCoords = function(wmCoords){
    var mapCoords = calculateMapCoords(wmCoords);
    var mapSizePx = currentMapProperties.mapSizePx;
    var newY = mapCoords.y - viewportOffsetCoords.y;
    var newX = mapCoords.x - viewportOffsetCoords.x;
    newX = (newX > mapSizePx)? newX - mapSizePx : newX;
    newX = (newX < 0) ? newX + mapSizePx : newX;
    return ({x:newX, y:newY});
  }

  //----------------------------------------------------------------------------

  var createBasemapTilesHTML = function(){
    var htmlStr = "";

    var tilesExtent = {
      left: Math.floor((bufferedExtent.left - wmExtent.left) * currentMapProperties.mapSizePx / (256 * wmExtentSize)),
      right: Math.floor((bufferedExtent.right - wmExtent.left) * currentMapProperties.mapSizePx / (256 * wmExtentSize)),
      top: Math.floor((bufferedExtent.top - wmExtent.top) * currentMapProperties.mapSizePx / (256 * wmExtentSize)),
      bottom: Math.floor((bufferedExtent.bottom - wmExtent.top) * currentMapProperties.mapSizePx / (256 * wmExtentSize))
    };

    var currentPixelSize = currentMapProperties.pixelSize;
    var numTiles = Math.round(currentMapProperties.mapSizePx / basemapTileSizePx);
    var lastTileIndex = numTiles - 1;
    for (var i = tilesExtent.left; i <= tilesExtent.right; i++){
      for (var j = tilesExtent.top; j <= tilesExtent.bottom; j++){
        if ((j < 0) || (j > lastTileIndex)){
          continue;
        }
        var yTile = j;
        var xTile = i % numTiles;
        xTile = (xTile < 0)? xTile + numTiles : xTile;

        var wmCoordsX = wmExtent.left + i * basemapTileSizePx * currentPixelSize;
        var wmCoordsY = wmExtent.top + j * basemapTileSizePx * currentPixelSize;
        var mapCoords = calculateMapCoords({x:wmCoordsX , y:wmCoordsY});
        var screenCoordsX = mapCoords.x - viewportOffsetCoords.x;
        var screenCoordsY = mapCoords.y - viewportOffsetCoords.y;

        var src = `https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/
                   ${currentScaleLevel}/${yTile}/${xTile}`;

        htmlStr += `<image draggable="false" src="${src}" alt="" class='map-image' style="
                    left: ${screenCoordsX}px; top: ${screenCoordsY}px">`
      }
    }
    return htmlStr;
  }

  //----------------------------------------------------------------------------

  var getScaleLevelChangeResults = function(properties){
    var newScaleLevel;
    switch (properties.type){
      case "in":
        newScaleLevel = currentScaleLevel + scaleLevelIncrement;
        newScaleLevel = (newScaleLevel > maxScaleLevel)? maxScaleLevel : newScaleLevel;
        break;
      case "out":
        newScaleLevel = currentScaleLevel - scaleLevelIncrement;
        newScaleLevel = (newScaleLevel < minScaleLevel)? minScaleLevel : newScaleLevel;
        break;
      case "home":
        newScaleLevel = homeViewPoint.scaleLevel;
        break;
      case "to":
        newScaleLevel = currentScaleLevel + 2 * scaleLevelIncrement;
        newScaleLevel = (newScaleLevel > maxScaleLevel)? maxScaleLevel : newScaleLevel;
        break;
    }
    return {old:currentScaleLevel, new:newScaleLevel};
  }

  //----------------------------------------------------------------------------

  var getMapRecenterResults = function(properties){
    var newLocation
    switch (properties.type){
      case "in":
      case "out":
        newLocation = mapCenterCoords;
        break;
      case "home":
      //  newLocation = homeViewPoint.wmCoords;
        newLocation = {x: homeViewPoint.wmCoords.x,
                       y: homeViewPoint.wmCoords.y};
        break;
      case "to":
        newLocation = properties.location;
        break;
    }
    return {old:mapCenterCoords, new:newLocation};
  }

  //public variables -----------------------------------------------------------

  return {
    setScaleLevel: setScaleLevel,
    setNewLocation: setNewLocation,
    updateViewportOffset: updateViewportOffset,
    updateViewportCenter: updateViewportCenter,
    init: init,
    getCurrentMapProperties: getCurrentMapProperties,
    calculateWMCoords: calculateWMCoords,
    calculateMapCoords: calculateMapCoords,
    calculateScreenCoords: calculateScreenCoords,
    createBasemapTilesHTML: createBasemapTilesHTML,
    getScaleLevelChangeResults: getScaleLevelChangeResults,
    getMapRecenterResults: getMapRecenterResults,
  };
}
