var NewBasemapView = function(eventDispatcher){


  //private variables ----------------------------------------------------------

  var parentNode,
      rootNode;
  var numTiles;
  var basemapDimensionsPx;
  var panData;
  var frameNodes;
  var frameImageTrackers;
  var displayIndex,
      writeIndex;


  //private functions ----------------------------------------------------------

  var mouseDownEventHandler = function(evt){
    evt.preventDefault();
    this.style.cursor = "move";
    panData.lastX = evt.clientX;
    panData.lastY = evt.clientY;
    this.addEventListener("mousemove", mouseMoveEventHandler);
    eventDispatcher.private.broadcast("panStartRequest");
  }

  var mouseUpEventHandler = function(evt){
    this.style.cursor = "default";
    this.removeEventListener("mousemove", mouseMoveEventHandler);
    panData = {lastX:0, lastY:0, deltaX:0, deltaY:0};
    eventDispatcher.private.broadcast("panEndRequest");
  }

  var mouseMoveEventHandler = function(evt){
    evt.preventDefault();
    panData.deltaX = (evt.clientX - panData.lastX);
    panData.deltaY = (evt.clientY - panData.lastY);
    panData.lastX = evt.clientX;
    panData.lastY = evt.clientY;
    eventDispatcher.private.broadcast("panRequest", {x:panData.deltaX, y:panData.deltaY});
  }

  var newImageOnLoadFunction = function(i){
    return function(){
      frameImageTrackers[writeIndex].report(i);
    }
  }

  var imageTrackerCallback = function(){
    requestAnimationFrame( () => {
      toggleFrames();
      eventDispatcher.private.broadcast("basemapRenderingComplete");
    });
  };

  var calculateTilesNeeded = function(dimension){
    var baseTilesNeeded = Math.trunc(basemapDimensionsPx[dimension] / Esri.basemapTileSizePx);
    var remainder = basemapDimensionsPx[dimension] % Esri.basemapTileSizePx;
    return (remainder > 1) ? baseTilesNeeded + 2 : baseTilesNeeded + 1;
  };

  var createImageTiles = function(parentNode, numTiles){
    for (let i = 0; i < numTiles; i++){
      var newImage = new Image();
      newImage.classList.add("map-image");
      newImage.addEventListener("load", newImageOnLoadFunction(i));
      parentNode.appendChild(newImage);
    }
  };

  var toggleFrames = function(){
    frameNodes[displayIndex].style.display = "none";
    frameNodes[writeIndex].style.display = "block";
    displayIndex = 1 - displayIndex;
    writeIndex = 1 - writeIndex;
  };


  //initCode -------------------------------------------------------------------

  numTiles = {width:null, height:null};
  panData = {lastX:0, lastY:0, deltaX:0, deltaY:0};
  frameNodes = [];
  frameImageTrackers = [];
  displayIndex = 0;
  writeIndex = 1;


  //public attributes and methods ----------------------------------------------

  return {

    draw: function(viewpoint){
      var mapProperties = MapModel.getMapProperties(viewpoint.z);
      var zoomLevelFloor = Math.floor(viewpoint.z);
      var diff = zoomLevelFloor - viewpoint.z;
      var tileSize = (Esri.basemapTileSizePx / Math.pow(2, diff));
      var resizeFactor = Math.pow(2, viewpoint.z - zoomLevelFloor);
      var numBasemapTiles = Math.round(mapProperties.numPixels / tileSize);
      var centerMapX = viewpoint.x / mapProperties.pixelSize;
      var centerMapY = viewpoint.y / mapProperties.pixelSize;
      var leftMapCoord = Math.floor(centerMapX - basemapDimensionsPx.width * 0.5 - 0.5);
      var topMapCoord =  Math.floor(centerMapY - basemapDimensionsPx.height * 0.5 - 0.5);
      var leftTileCoord = Math.floor(leftMapCoord / tileSize);
      var topTileCoord = Math.floor(topMapCoord / tileSize);
      var leftMapOffset = leftMapCoord % tileSize;
      var topMapOffset = topMapCoord % tileSize;
      leftMapOffset = (leftMapOffset < 0) ? leftMapOffset + tileSize : leftMapOffset;
      topMapOffset = (topMapOffset < 0) ? topMapOffset + tileSize : topMapOffset;

      var writeFrame = frameNodes[writeIndex];
      var writeImageTracker = frameImageTrackers[writeIndex];
      writeImageTracker.clear();

      var tiles = writeFrame.querySelectorAll(".map-image");

      for (var j = 0; j < numTiles.height; j++){
        for (var i = 0; i < numTiles.width; i++){
          var tileIndex = i + j * numTiles.width;
          var tile = tiles[tileIndex];

          var yTileIndex = j + topTileCoord;
          if (yTileIndex < 0 || yTileIndex >= numBasemapTiles){
            tile.style.display = "none";
            writeImageTracker.report(tileIndex);
            continue;
          }
          if (tile.style.display == "none"){
            tile.style.display = "inline";
          }

          var xTileIndex = (i + leftTileCoord) % numBasemapTiles;
          xTileIndex = (xTileIndex < 0) ? xTileIndex + numBasemapTiles : xTileIndex;
          var newSrc = `${Esri.basemapURLString}${zoomLevelFloor}/${yTileIndex}/${xTileIndex}`
          if (tile.src == newSrc){
            writeImageTracker.report(tileIndex);
          } else {
            tile.src = `${Esri.basemapURLString}${zoomLevelFloor}/${yTileIndex}/${xTileIndex}`;
          }

          var left = (i * tileSize) - leftMapOffset + (tileSize - Esri.basemapTileSizePx) / 2;
          var top = (j * tileSize) - topMapOffset  + (tileSize - Esri.basemapTileSizePx) / 2;
          tile.style.transform = `translate(${left}px, ${top}px) scale(${resizeFactor, resizeFactor}`;
        }
      }
    },

    configure: function(node, webMapDimensionsPx){
      parentNode = node;
      basemapDimensionsPx = webMapDimensionsPx;
    },

    load: function(htmlStr){
      Utils.loadHTMLContent(parentNode, htmlStr);
      rootNode = document.getElementById("basemap-layer");
      frameNodes[0] = document.getElementById("frame-0");
      frameNodes[1] = document.getElementById("frame-1");
      rootNode.addEventListener("mousedown", mouseDownEventHandler);
      rootNode.addEventListener("mouseup", mouseUpEventHandler);
      eventDispatcher.private.broadcast("basemapReady");
    },

    loadTiles: function(){
      numTiles.width = calculateTilesNeeded("width");
      numTiles.height = calculateTilesNeeded("height");
      var totalTilesNeeded = numTiles.height * numTiles.width;
      var frame0imageTracker = NewImageTracker(totalTilesNeeded, imageTrackerCallback);
      var frame1imageTracker = NewImageTracker(totalTilesNeeded, imageTrackerCallback);
      frameImageTrackers.push(frame0imageTracker);
      frameImageTrackers.push(frame1imageTracker);
      createImageTiles(frameNodes[0], totalTilesNeeded);
      createImageTiles(frameNodes[1], totalTilesNeeded);
      eventDispatcher.private.broadcast("basemapTilesLoaded");
    },

  };

};




    /*draw: function(viewpoint){

      console.log("drawing");

      currentDrawProperties.viewpoint = viewpoint;
      currentDrawProperties.translateTop = 0;
      currentDrawProperties.translateLeft = 0;

      currentDrawProperties.tileLevel = Math.floor(viewpoint.z);
      var mapProperties = MapModel.getMapProperties(currentDrawProperties.tileLevel);
      var numBasemapTiles = Math.round(mapProperties.numPixels / Esri.basemapTileSizePx);


//      var zoomLevelFloor = Math.floor(viewpoint.z);
//      var diff = zoomLevelFloor - viewpoint.z;
//      var tileSize = Esri.basemapTileSizePx / Math.pow(2, diff);
//      var resizeFactor = Math.pow(2, viewpoint.z - zoomLevelFloor);
  //    var tileImageLevel = zoomLevelFloor;

      var centerMapX = viewpoint.x / mapProperties.pixelSize;
      var centerMapY = viewpoint.y / mapProperties.pixelSize;
      var leftMapCoord = Math.floor(centerMapX - bufferedBasemapDimensionsPx.width * 0.5 - 0.5);
      var topMapCoord =  Math.floor(centerMapY - bufferedBasemapDimensionsPx.height * 0.5 - 0.5);
      var leftTileCoord = Math.floor(leftMapCoord / Esri.basemapTileSizePx);
      var topTileCoord = Math.floor(topMapCoord / Esri.basemapTileSizePx);
      var leftMapOffset = leftMapCoord % Esri.basemapTileSizePx;
      var topMapOffset = topMapCoord % Esri.basemapTileSizePx;

     if (leftMapOffset < 0){
        leftMapOffset += Esri.basemapTileSizePx;
      }
      if (topMapOffset < 0){
        topMapOffset += Esri.basemapTileSizePx;
      }

      currentDrawProperties.bufferLeft = leftMapOffset + minBasemapBufferPx.width;
      currentDrawProperties.bufferTop = topMapOffset + minBasemapBufferPx.height;
      currentDrawProperties.bufferRight = numTiles.width * 256 - currentDrawProperties.bufferLeft - basemapDimensionsPx.width;
      currentDrawProperties.bufferBottom = numTiles.height * 256 - currentDrawProperties.bufferTop - basemapDimensionsPx.height;
    //  console.log(topBuffer, rightBuffer, bottomBuffer, leftBuffer);


      var newFrame = frameNodes[1 - currentDisplayedFrameIndex];
      newFrame.style.transform = `translate(${0}px, ${0}px)`;
      var currentImageTracker = frameImageTrackers[currentDisplayedFrameIndex];
      currentImageTracker.clear();

      var tiles = newFrame.querySelectorAll(".map-image");

      for (var j = 0; j < numTiles.height; j++){
        for (var i = 0; i < numTiles.width; i++){
          var tileIndex = i + j * numTiles.width;
          var tile = tiles[tileIndex];

          var yTileIndex = j + topTileCoord;
          if (yTileIndex < 0 || yTileIndex >= numBasemapTiles){
            tile.style.display = "none";
            currentImageTracker.report(tileIndex);
            continue;
          }

          tile.style.display = "inline";
          var xTileIndex = (i + leftTileCoord) % numBasemapTiles;
          xTileIndex = (xTileIndex < 0)? xTileIndex + numBasemapTiles : xTileIndex;
          tile.src = `${Esri.basemapURLString}${currentDrawProperties.tileLevel}/${yTileIndex}/${xTileIndex}`;

          var left = (i * Esri.basemapTileSizePx) - leftMapOffset - minBasemapBufferPx.width;
          var top = (j * Esri.basemapTileSizePx) - topMapOffset - minBasemapBufferPx.height;
    //      tile.style.width = "256.5px";
          tile.style.transform = `translate(${left}px, ${top}px)`;
        }
      }
    },*/

    /*pan: function(x, y, scale){

      requestAnimationFrame(function(){
        frameNodes[currentDisplayedFrameIndex].style.transform = `translate(${x}px, ${y}px) scale(${scale},${scale})`;
        eventDispatcher.private.broadcast("renderingComplete");
      });

    },*/


  /*  drawHandler: function(viewpoint){

      var newTileLevel = Math.floor(viewpoint.z);

      console.log(newTileLevel, currentDrawProperties.tileLevel);
      if (newTileLevel != currentDrawProperties.tileLevel){

        this.draw(viewpoint);
      } else {

        var diff = viewpoint.z - Math.floor(viewpoint.z);
        var resizeFactor =  Math.pow(2, diff);
        var mapProperties = MapModel.getMapProperties(currentDrawProperties.tileLevel);

        var deltaX = WebMercator.calculateDeltaX(viewpoint.x, currentDrawProperties.viewpoint.x);
        var deltaXPx = Math.round(deltaX / mapProperties.pixelSize);
        var deltaY = viewpoint.y - currentDrawProperties.viewpoint.y;
        var deltaYPx = Math.round(deltaY / mapProperties.pixelSize);

    //    console.log(currentDrawProperties.bufferBottom);

        currentDrawProperties.translateLeft -= deltaXPx;
        currentDrawProperties.bufferLeft += deltaXPx;
        currentDrawProperties.bufferRight -= deltaXPx;
        currentDrawProperties.translateTop -= (deltaYPx);
        currentDrawProperties.bufferTop += deltaYPx;
        currentDrawProperties.bufferBottom -= deltaYPx;

        console.log(currentDrawProperties.bufferTop, currentDrawProperties.bufferBottom)

        if ((currentDrawProperties.bufferLeft < 0) || (currentDrawProperties.bufferRight < 0) ||
            (currentDrawProperties.bufferTop < 0) || (currentDrawProperties.bufferBottom < 0)){
    //      this.draw(viewpoint);

        } else {
          this.pan(currentDrawProperties.translateLeft, currentDrawProperties.translateTop, resizeFactor);
          currentDrawProperties.viewpoint = viewpoint;
        }
      }
    },*/


    /*  currentDrawProperties = {
        viewpoint: null,
        bufferRight: null,
        bufferLeft: null,
        bufferTop: null,
        bufferBottom: null,
        tileLevel: null,
        translateLeft: null,
        translateTop: null,
      }*/
