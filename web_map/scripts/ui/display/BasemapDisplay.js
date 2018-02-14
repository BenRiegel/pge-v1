"use strict";


var NewBasemapDisplay = function(eventDispatcher, webMapStates){


  //private variables ----------------------------------------------------------

  var numTiles;
  var frameNodes;
  var frameImageTrackers;
  var displayIndex,
      writeIndex;


  //private functions ----------------------------------------------------------

  var newImageOnLoadFunction = function(i){
    return function(){
      frameImageTrackers[writeIndex].report(i);
    }
  }

  var imageTrackerCallback = function(){
    eventDispatcher.broadcast("basemapImagesLoaded");
  };

  var calculateTilesNeeded = function(dimension){
    var baseTilesNeeded = Math.trunc(webMapStates.dimensionsPx[dimension] / Esri.basemapTileSizePx);
    var remainder = webMapStates.dimensionsPx[dimension] % Esri.basemapTileSizePx;
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


  //initCode -------------------------------------------------------------------

  numTiles = {width:null, height:null};
  frameNodes = [];
  frameImageTrackers = [];
  displayIndex = 0;
  writeIndex = 1;


  //public attributes and methods ----------------------------------------------

  return {

    rootNode: null,

    toggleFrames: function(){
      frameNodes[displayIndex].style.display = "none";
      frameNodes[writeIndex].style.display = "block";
      displayIndex = 1 - displayIndex;
      writeIndex = 1 - writeIndex;
    },

    draw: function(viewpoint){
      var mapProperties = webMapStates.currentMapProperties;
      var zoomLevelFloor = Math.floor(viewpoint.z);
      var diff = zoomLevelFloor - viewpoint.z;
      var tileSize = (Esri.basemapTileSizePx / Math.pow(2, diff));
      var resizeFactor = Math.pow(2, viewpoint.z - zoomLevelFloor);
      var numBasemapTiles = Math.round(mapProperties.numPixels / tileSize);

      var centerMapX = viewpoint.x / mapProperties.pixelSize;
      var centerMapY = viewpoint.y / mapProperties.pixelSize;
      var leftMapCoord = (centerMapX - webMapStates.dimensionsPx.width * 0.5 - 0.5);
      var topMapCoord =  (centerMapY - webMapStates.dimensionsPx.height * 0.5 - 0.5);
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

    load: function(htmlStr){
      Utils.loadHTMLContent(webMapStates.rootNode, htmlStr);
      this.rootNode = document.getElementById("basemap-layer");
      frameNodes[0] = document.getElementById("frame-0");
      frameNodes[1] = document.getElementById("frame-1");
      eventDispatcher.broadcast("basemapReady");
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
      eventDispatcher.broadcast("basemapTilesLoaded");
    },

  };

};
