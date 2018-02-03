function Model = function(configProperties){


  //private variables ----------------------------------------------------------

  var viewportDimensionsPx = {width:null, height:null};

  var hardMinZoomLevel,
      hardMaxZoomLevel,
      minZoomLevel,
      maxZoomLevel;
  var initZoomLevel,
      currentZoomLevel;


  var initViewportCenterWorld = {x:null, y:null};

  var currentViewportCenter = {x:null, y:null},
      currentZoomLevel,
      currentBasemapProperties;

  var currentViewportExtent,
      currentBufferedViewportExtent;

  var totalPan;
  var imageTracker;


  var eventList = ["pan-start", "pan-end", "zoom-start," "zoom-end"];
  var eventDispatcher = EventDispatcher();





  //private functions ----------------------------------------------------------

  var calculateViewportDimensions = function(mapNodeId){
    var node = document.getElementById(mapNodeId);
    var rect = node.getBoundingClientRect();
    viewportDimensionsPx = {width:rect.width, height:rect.height};
  };

  var setInitZoomLevel = function(zoomLevel){
    initZoomLevel = zoomLevel;
    if (initZoomLevel < minZoomLevel){
      initZoomLevel = minZoomLevel;
    }
  }

  var setMaxZoomLevel = function(zoomLevel){
    maxZoomLevel = zoomLevel;
    if (maxZoomLevel > BasemapModel.esriMaxZoomLevel){
      maxZoomLevel = BasemapModel.esriMaxZoomLevel;
    }
  }

  var calculateInitViewportCenterWorld = function(geoCoords){
    initViewportCenterWorld = WorldModel.calculateWorldCoords(geoCoords);
  }

  var panViewportCenter = function(deltaX, deltaY){
    currentViewportCenter.x += deltaX * currentBasemapProperties.pixelSize;
    currentViewportCenter.y += deltaY * currentBasemapProperties.pixelSize;
  //  currentViewportCenter = WorldModel.getCorrectedWorldCoords(currentViewportCenter);
  }


  var calculateExtents = function(bufferFactor){
    var heightPx = viewportDimensionsPx.height * (bufferFactor + 0.5) - 0.5;
    var widthPx = viewportDimensionsPx.width * (bufferFactor + 0.5) - 0.5;
    var extent = {};
    extent.world = {
      top: currentViewportCenter.y - heightPx * currentBasemapProperties.pixelSize ,
      right: currentViewportCenter.x + widthPx * currentBasemapProperties.pixelSize,
      bottom: currentViewportCenter.y + heightPx * currentBasemapProperties.pixelSize,
      left: currentViewportCenter.x - widthPx * currentBasemapProperties.pixelSize,
    };
    extent.world.top = WorldModel.rectifyExtentTop(extent.world.top);
    extent.world.bottom = WorldModel.rectifyExtentBottom(extent.world.bottom);
    extent.map = {
      top: Math.floor(extent.world.top / currentBasemapProperties.pixelSize),
      right: Math.floor(extent.world.right / currentBasemapProperties.pixelSize),
      bottom: Math.floor(extent.world.bottom / currentBasemapProperties.pixelSize),
      left: Math.floor(extent.world.left / currentBasemapProperties.pixelSize),
    };
    extent.tile = {
      top: Math.floor(extent.map.top / BasemapModel.esriBasemapTileSizePx),
      right: Math.floor(extent.map.right / BasemapModel.esriBasemapTileSizePx),
      bottom: Math.floor(extent.map.bottom / BasemapModel.esriBasemapTileSizePx),
      left: Math.floor(extent.map.left / BasemapModel.esriBasemapTileSizePx),
    };
    return extent;
  };


  var refreshViewportExtents = function(){
    currentViewportExtent = calculateExtents(0);
    currentBufferedViewportExtent = calculateExtents(1);
    currentBufferedViewportExtent.imageBuffer = {
      top: currentViewportExtent.map.top - currentBufferedViewportExtent.map.top,
      right: currentBufferedViewportExtent.map.right - currentViewportExtent.map.right - 1,
      bottom: currentBufferedViewportExtent.map.bottom - currentViewportExtent.map.bottom - 1,
      left: currentViewportExtent.map.left - currentBufferedViewportExtent.map.left,
    }
  }


  var createTile = function(x, y){
    var zoomLevel = currentZoomLevel;
    var size = BasemapModel.esriBasemapTileSizePx;
    var numTiles = currentBasemapProperties.numTiles;
    var yTileIndex = y;
    var xTileIndex = x % numTiles;
    xTileIndex = (xTileIndex < 0)? xTileIndex + numTiles : xTileIndex;
    var screenCoordsX = x * BasemapModel.esriBasemapTileSizePx - currentViewportExtent.map.left;
    var screenCoordsY = y * BasemapModel.esriBasemapTileSizePx - currentViewportExtent.map.top;
    var src = `https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/${zoomLevel}/${yTileIndex}/${xTileIndex}`;
    var img = document.createElement("img");
    img.setAttribute("draggable", "false");
    img.className = "map-image";
    img.style.left = `${screenCoordsX}px`;
    img.style.top = `${screenCoordsY}px`;
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    imageTracker.register(x, y);
    img.onload = imageTracker.report(x, y);
    img.src = src;
    return img;
  }


  var loadNewBufferedViewportTiles = function(){
    var tileList = [];
    for (let x = currentBufferedViewportExtent.tile.left; x <= currentBufferedViewportExtent.tile.right; x++){
      for (let y = currentBufferedViewportExtent.tile.top; y <= currentBufferedViewportExtent.tile.bottom; y++){
        if (imageTracker.isRegistered(x, y) == false){
          var newTile = createTile(x, y);
          tileList.push(newTile);
        }
      }
    }
    loadTileImageEvent.notify(tileList);
  }


  var trackViewportTiles = function(){
    for (let x = currentViewportExtent.tile.left; x <= currentViewportExtent.tile.right; x++){
      for (let y = currentViewportExtent.tile.top; y <= currentViewportExtent.tile.bottom; y++){
        imageTracker.track(x, y);
      }
    }
  }


  var loadNewBasemapTiles = function(){
    loadNewBufferedViewportTiles();
    trackViewportTiles();
    imageTracker.callbackFunction = function(){
      showBasemapEvent.notify();
    }
    imageTracker.finishTracking();
  }


  var updateBasemapTiles = function(){
    loadNewBufferedViewportTiles();
    trackViewportTiles();
    imageTracker.callbackFunction = function(){
      successfulPanEvent.notify(totalPan);
    }
    imageTracker.finishTracking();
  }


  var attemptedPanEventHandler = function(attemptedPanProperties){
    var deltaY = attemptedPanProperties.deltaY;
    if (deltaY > 0){
      var panY = Math.min(deltaY, currentViewportExtent.mapSpace.top);
    } else {
      var panY = Math.max(deltaY, -currentViewportExtent.mapSpace.bottom);
    }
    var deltaY = panY;
    var deltaX = attemptedPanProperties.deltaX;

    totalPan.x += deltaX;
    totalPan.y += deltaY;

    panViewportCenter(deltaX, deltaY);
    updateBasemapTiles();
  }


  var refreshBasemap = function(){
    totalPan = {x:0, y:0};
    imageTracker = new ImageTracker();
    refreshViewportExtents();
    loadNewBasemapTiles();
  }




  var setViewportCenter = function(newLocation){
    currentViewportCenter.x = newLocation.x;
    currentViewportCenter.y = newLocation.y;
  }

  var setZoomLevel = function(newZoomLevel){
    currentZoomLevel = newZoomLevel;
    currentBasemapProperties = BasemapModel.getProperties(newZoomLevel);
  }

  //public methods -------------------------------------------------------------

  var on = function(eventName, callbackFunction){
    eventDispatcher[eventName].attach(callbackFunction);
  }


  //init code ------------------------------------------------------------------

  calculateViewportDimensions(configProperties.mapNodeId);
  calculateMinZoomLevel();
  setInitZoomLevel(configProperties.initZoomLevel);
  setZoomLevel(initZoomLevel);
  calculateInitViewportCenterWorld(configProperties.initViewportCenterLatLon);
  setViewportCenter(initViewportCenterWorld);
  refreshBasemap();

  return {
    on: on,

  }
}
