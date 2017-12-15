var BasemapView = function(mapServices, viewportServices){

  var viewportBufferFactor = 1,
      basemapTileSizePx = 256;

  var mapImagesContainer = document.getElementById("map-images-container");

  var initViewportCenter,
      initPixelSize;

  //event handlers -------------------------------------------------------------

  var drawBasemap = function(){

    var initViewportOffset = viewportServices.sendViewportOffset();
    var viewportDimensionsPx = viewportServices.sendViewportDimensions();
    var currentViewportCenter = viewportServices.sendCurrentViewportCenter();
    initViewportCenter = {
      x: currentViewportCenter.x,
      y: currentViewportCenter.y,
    }

    var pixelSize = mapServices.getCurrentPixelSize();
    initPixelSize = pixelSize;
    var mapSizePx = mapServices.getCurrentMapSizePx();
    var currentScaleLevel = mapServices.getCurrentScaleLevel();
    var currentTileLevel = Math.round(currentScaleLevel);

    var bufferedViewportExtentHeight = (viewportBufferFactor * 2 + 1) * viewportDimensionsPx.height * pixelSize;
    var bufferedViewportExtentWidth = (viewportBufferFactor * 2 + 1) * viewportDimensionsPx.width * pixelSize;

    var bufferedViewportExtent = {
      top: currentViewportCenter.y - bufferedViewportExtentHeight / 2,
      right: currentViewportCenter.x + bufferedViewportExtentWidth / 2,
      bottom: currentViewportCenter.y + bufferedViewportExtentHeight / 2,
      left: currentViewportCenter.x - bufferedViewportExtentWidth / 2
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
    var currentPixelSize =  mapServices.getCurrentPixelSize();
    var basemapScale = initPixelSize / currentPixelSize;
    var currentViewportCenter = viewportServices.sendCurrentViewportCenter();
    var deltaX = currentViewportCenter.x - initViewportCenter.x;
    var deltaXPx = deltaX / initPixelSize;
    var deltaY = currentViewportCenter.y - initViewportCenter.y;
    var deltaYPx = deltaY / initPixelSize;
    mapImagesContainer.style.transform = `scale(${basemapScale},${basemapScale}) translate(${-deltaXPx}px, ${-deltaYPx}px)`;
  }

  //public variables -----------------------------------------------------------

  return {
    drawBasemap: drawBasemap,
    moveBasemap: moveBasemap,
  };

};
