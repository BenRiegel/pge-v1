var BasemapView = function(){

  var viewportDimensionsRequest = new Event(),
      viewportCenterRequest = new Event(),
      viewportOffsetRequest = new Event(),
      mapCoordsRequest = new Event,
      mapPropertiesRequest = new Event();

  var viewportBufferFactor = 1,
      basemapTileSizePx = 256;

  var mapImagesContainer = document.getElementById("map-images-container");

  var initViewportCenter,
      initPixelSize;

  //event handlers -------------------------------------------------------------

  var drawBasemap = function(){

    var initViewportOffset = viewportOffsetRequest.fire();
    var viewportDimensionsPx = viewportDimensionsRequest.fire();
    var currentViewportCenter = viewportCenterRequest.fire();
    initViewportCenter = {
      x: currentViewportCenter.worldCoords.x,
      y: currentViewportCenter.worldCoords.y,
    }

    var currentMapProperties = mapPropertiesRequest.fire();
    var pixelSize = currentMapProperties.pixelSize;
    initPixelSize = pixelSize;
    var mapSizePx = currentMapProperties.mapSizePx;
    var currentTileLevel = Math.round(currentMapProperties.scaleLevel);

    var bufferedViewportExtentHeight = (viewportBufferFactor * 2 + 1) * viewportDimensionsPx.height * pixelSize;
    var bufferedViewportExtentWidth = (viewportBufferFactor * 2 + 1) * viewportDimensionsPx.width * pixelSize;

    var bufferedViewportExtent = {
      top: currentViewportCenter.worldCoords.y - bufferedViewportExtentHeight / 2,
      right: currentViewportCenter.worldCoords.x + bufferedViewportExtentWidth / 2,
      bottom: currentViewportCenter.worldCoords.y + bufferedViewportExtentHeight / 2,
      left: currentViewportCenter.worldCoords.x - bufferedViewportExtentWidth / 2
    }

    var numTiles = Math.round(mapSizePx / basemapTileSizePx);

    var tilesExtent = {
      top: Math.floor(bufferedViewportExtent.top / (basemapTileSizePx * pixelSize)),
      right: Math.floor(bufferedViewportExtent.right / (basemapTileSizePx * pixelSize)),
      bottom: Math.floor(bufferedViewportExtent.bottom / (basemapTileSizePx * pixelSize)),
      left: Math.floor(bufferedViewportExtent.left / (basemapTileSizePx * pixelSize))
    }

    var htmlStr = "";
    for (var i = tilesExtent.left; i <= tilesExtent.right; i++){
      for (var j = tilesExtent.top; j <= tilesExtent.bottom; j++){
        if ((j < 0) || (j >= numTiles)){
          continue;
        }
        var yTileIndex = j;
        var xTileIndex = i % numTiles;
        xTileIndex = (xTileIndex < 0)? xTileIndex + numTiles : xTileIndex;

        var worldCoordsX = i * basemapTileSizePx * pixelSize;
        var worldCoordsY = j * basemapTileSizePx * pixelSize;
        var screenCoordsX = Math.round(i * basemapTileSizePx - initViewportOffset.x);
        var screenCoordsY = Math.round(j * basemapTileSizePx - initViewportOffset.y);

        var src = `https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/${currentTileLevel}/${yTileIndex}/${xTileIndex}`;

        htmlStr += `<img draggable="false"
                     src = ${src}
                     class='map-image' style="
                     left: ${screenCoordsX}px; top: ${screenCoordsY}px">`
      }
    }
    mapImagesContainer.style.transform = "";
    mapImagesContainer.innerHTML = htmlStr;
  }

  //----------------------------------------------------------------------------

  var moveBasemap = function(){
    var currentMapProperties = mapPropertiesRequest.fire();
    var currentPixelSize = currentMapProperties.pixelSize;
    var basemapScale = initPixelSize / currentPixelSize;
    var currentViewportCenter = viewportCenterRequest.fire();
    var deltaX = currentViewportCenter.worldCoords.x - initViewportCenter.x;
    var deltaXPx = deltaX / initPixelSize;
    var deltaY = currentViewportCenter.worldCoords.y - initViewportCenter.y;
    var deltaYPx = deltaY / initPixelSize;
    mapImagesContainer.style.transform = `scale(${basemapScale},${basemapScale}) translate(${-deltaXPx}px, ${-deltaYPx}px)`;
  }

  //public variables -----------------------------------------------------------

  return {
    viewportDimensionsRequest: viewportDimensionsRequest,
    viewportCenterRequest: viewportCenterRequest,
    viewportOffsetRequest: viewportOffsetRequest,
    mapCoordsRequest: mapCoordsRequest,
    mapPropertiesRequest: mapPropertiesRequest,
    drawBasemap: drawBasemap,
    moveBasemap: moveBasemap,
  };

};
