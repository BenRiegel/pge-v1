"use strict";


var NewBasemapDisplay = function(eventDispatcher, webMapRootNode, webMapDimensionsPx){


  //private variables ----------------------------------------------------------

  var tiles;
  var numTiles;
  var frameNodes;
  var frameImageTrackers;
  var displayIndex,
      writeIndex;
  var baselineZoomLevel;
  var buffer;


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
    var baseTilesNeeded = Math.trunc(webMapDimensionsPx[dimension] / (Esri.basemapTileSizePx / 2));
    var remainder = webMapDimensionsPx[dimension] % (Esri.basemapTileSizePx / 2);
    return (remainder > 1) ? baseTilesNeeded + 2 : baseTilesNeeded + 1;
  };

  var createImageTiles = function(frameNodes, numTiles){
    for (let i = 0; i < numTiles; i++){
      var newTile = {
        xIndex: null,
        yIndex: null,
        yIndexValid: false,
        leftScreenCoord: null,
        topScreenCoord: null,
        resizeFactor: 1,
        size: Esri.basemapTileSizePx,
        nodes: [],
      }
      var newImage = new Image();
      newImage.classList.add("map-image");
      newImage.classList.add("no-highlight");
      newImage.addEventListener("load", newImageOnLoadFunction(i));
      newTile.nodes[0] = newImage;
      frameNodes[0].appendChild(newImage);
      var newImage = new Image();
      newImage.classList.add("map-image");
      newImage.classList.add("no-highlight");
      newImage.addEventListener("load", newImageOnLoadFunction(i));
      newTile.nodes[1] = newImage;
      frameNodes[1].appendChild(newImage);
      tiles.push(newTile);
    }
  };

  var drawTiles = function(){

    var writeImageTracker = frameImageTrackers[writeIndex];
    writeImageTracker.clear();

    for (var j = 0; j < numTiles.height; j++){
      for (var i = 0; i < numTiles.width; i++){
        var tileIndex = i + j * numTiles.width;
        var tile = tiles[tileIndex];

        if (tile.yIndexValid == false){
          tile.nodes[writeIndex].style.display = "none";
          writeImageTracker.report(tileIndex);
          continue;
        }

        if (tile.leftScreenCoord < -tile.size || tile.leftScreenCoord > webMapDimensionsPx.width){
          writeImageTracker.report(tileIndex);
        }

        if (tile.topScreenCoord < -tile.size || tile.topScreenCoord > webMapDimensionsPx.height){
          writeImageTracker.report(tileIndex);
        }

        var newSrc = `${Esri.basemapURLString}${baselineZoomLevel}/${tile.yIndex}/${tile.xIndex}`;
        if (tile.nodes[writeIndex].src == newSrc){
          writeImageTracker.report(tileIndex);
        } else {
          tile.nodes[writeIndex].src = newSrc;
        }

        var newX = Math.round(tile.leftScreenCoord);
        var newY = Math.round(tile.topScreenCoord);
        tile.nodes[writeIndex].style.transform = `translate(${newX}px, ${newY}px) scale(${tile.resizeFactor, tile.resizeFactor}`;

        if (tile.nodes[writeIndex].style.display == "none"){
          tile.nodes[writeIndex].style.display = "inline";
        }
      }
    }
  };

  var positionInitialTiles = function(drawProperties){
    var viewpoint = drawProperties.viewpoint;
    var pixelProperties = drawProperties.pixelProperties;
    var tileSize = Esri.basemapTileSizePx;
    var numBasemapTiles = Math.round(pixelProperties.num / tileSize);
    var centerMapX = viewpoint.x / pixelProperties.size;
    var centerMapY = viewpoint.y / pixelProperties.size;
    var bufferedLeftMapCoord = (centerMapX - webMapDimensionsPx.width);
    var bufferedTopMapCoord =  (centerMapY - webMapDimensionsPx.height);
    var bufferedLeftTileCoord = Math.floor(bufferedLeftMapCoord / tileSize);
    var bufferedTopTileCoord = Math.floor(bufferedTopMapCoord / tileSize);
    var leftScreenOffset = bufferedLeftMapCoord + webMapDimensionsPx.width / 2;
    var topScreenOffset = bufferedTopMapCoord + webMapDimensionsPx.height / 2;

    buffer = {
      left: leftScreenOffset - bufferedLeftTileCoord * tileSize,
      right: (bufferedLeftTileCoord + numTiles.width) * tileSize - leftScreenOffset - webMapDimensionsPx.width,
      top: topScreenOffset - Math.max(bufferedTopTileCoord, 0) * tileSize,
      bottom: Math.max(bufferedTopTileCoord + numTiles.height, numBasemapTiles) * tileSize - topScreenOffset - webMapDimensionsPx.height,
    };

    for (var j = 0; j < numTiles.height; j++){
      for (var i = 0; i < numTiles.width; i++){
        var tileIndex = i + j * numTiles.width;
        var tile = tiles[tileIndex];
        tile.yIndex = j + bufferedTopTileCoord;
        tile.yIndexValid = (tile.yIndex >= 0 && tile.yIndex < numBasemapTiles);
        tile.xIndex = (i + bufferedLeftTileCoord ) % numBasemapTiles;
        tile.xIndex = (tile.xIndex < 0) ? tile.xIndex + numBasemapTiles : tile.xIndex;
        tile.leftScreenCoord = (bufferedLeftTileCoord + i) * tileSize - leftScreenOffset + (tileSize - Esri.basemapTileSizePx) / 2;
        tile.topScreenCoord = (bufferedTopTileCoord + j) * tileSize - topScreenOffset + (tileSize - Esri.basemapTileSizePx) / 2;
        tile.resizeFactor = 1;
        tile.size = tileSize;
      }
    }
  };

  var positionZoomTiles = function(drawProperties){

    var viewpoint = drawProperties.viewpoint;
    var scaleLevel = drawProperties.scaleLevel;
    var pixelProperties = drawProperties.pixelProperties;

    var diff = scaleLevel - baselineZoomLevel;
    if (diff < -1){
      baselineZoomLevel -= 1;
      diff += 1;
    }
    if (diff > 1){
      baselineZoomLevel += 1;
      diff -= 1;
    }
    var tileSize = (Esri.basemapTileSizePx * Math.pow(2, diff));
    var resizeFactor = Math.pow(2, scaleLevel - baselineZoomLevel);
    var numBasemapTiles = Math.round(pixelProperties.num / tileSize);

    var centerMapX = viewpoint.x / pixelProperties.size;
    var centerMapY = viewpoint.y / pixelProperties.size;
    var leftMapCoord = (centerMapX - webMapDimensionsPx.width * 0.5);
    var topMapCoord = (centerMapY - webMapDimensionsPx.height * 0.5);
    var leftTileCoord = Math.floor(leftMapCoord / tileSize);
    var topTileCoord = Math.floor(topMapCoord / tileSize);
    var leftMapOffset = leftMapCoord % tileSize;
    var topMapOffset = topMapCoord % tileSize;
    leftMapOffset = (leftMapOffset < 0) ? leftMapOffset + tileSize : leftMapOffset;
    topMapOffset = (topMapOffset < 0) ? topMapOffset + tileSize : topMapOffset;

    for (var j = 0; j < numTiles.height; j++){
      for (var i = 0; i < numTiles.width; i++){
        var tileIndex = i + j * numTiles.width;
        var tile = tiles[tileIndex];
        tile.yIndex = j + topTileCoord;
        tile.yIndexValid = (tile.yIndex >= 0 && tile.yIndex < numBasemapTiles);
        tile.xIndex = (i + leftTileCoord) % numBasemapTiles;
        tile.xIndex = (tile.xIndex < 0) ? tile.xIndex + numBasemapTiles : tile.xIndex;
        tile.leftScreenCoord = i * tileSize - leftMapOffset + (tileSize - Esri.basemapTileSizePx) / 2;
        tile.topScreenCoord = j * tileSize - topMapOffset + (tileSize - Esri.basemapTileSizePx) / 2;
        tile.resizeFactor = resizeFactor;
        tile.size = tileSize;
      }
    }
  };

  var positionPanTiles = function(drawProperties){
    var deltaPx = drawProperties.deltaPx;
    buffer.left += deltaPx.x;
    buffer.right -= deltaPx.x;
    buffer.top += deltaPx.y;
    buffer.bottom -= deltaPx.y;
    if (buffer.left < 0 || buffer.right < 0 || buffer.top < 0 || buffer.bottom < 0){
      positionInitialTiles(drawProperties);
      return;
    }
    for (var j = 0; j < numTiles.height; j++){
      for (var i = 0; i < numTiles.width; i++){
        var tileIndex = i + j * numTiles.width;
        var tile = tiles[tileIndex];
        tile.leftScreenCoord -= deltaPx.x;
        tile.topScreenCoord -= deltaPx.y;
      }
    }
  };


  //initCode -------------------------------------------------------------------

  numTiles = {width:null, height:null};
  frameNodes = [];
  frameImageTrackers = [];
  displayIndex = 0;
  writeIndex = 1;
  tiles = [];


  //public attributes and methods ----------------------------------------------

  return {

    rootNode: null,

    toggleFrames: function(){
      frameNodes[displayIndex].style.display = "block";
      frameNodes[writeIndex].style.display = "block";
      frameNodes[writeIndex].style.zIndex = "2";
      frameNodes[displayIndex].style.zIndex = "1";
      displayIndex = 1 - displayIndex;
      writeIndex = 1 - writeIndex;
      eventDispatcher.broadcast("basemapFrameTogglingComplete");
    },

    toggleFramesInitial: function(){
      frameNodes[writeIndex].style.display = "block";
      frameNodes[writeIndex].style.opacity = "0";
      frameNodes[writeIndex].style.zIndex = "2";
      frameNodes[displayIndex].style.zIndex = "1";
      var animation = NewAnimation();
      animation.addRunFunction(400, function(totalProgress){
        frameNodes[writeIndex].style.opacity = `${totalProgress}`;
      });
      animation.setCallbackFunction(function(){
        eventDispatcher.broadcast("intialBasemapFrameTogglingComplete");
        displayIndex = 1 - displayIndex;
        writeIndex = 1 - writeIndex;
      });
      animation.run();
    },

    toggleFramesFinalZoom: function(){
      frameNodes[writeIndex].style.opacity = "0";
      frameNodes[writeIndex].style.zIndex = "2";
      frameNodes[displayIndex].style.zIndex = "1";
      var animation = NewAnimation();
      animation.addRunFunction(500, function(totalProgress){
        frameNodes[writeIndex].style.opacity = `${totalProgress}`;
      });
      animation.setCallbackFunction(function(){
        eventDispatcher.broadcast("finalBasemapFrameTogglingComplete");
        displayIndex = 1 - displayIndex;
        writeIndex = 1 - writeIndex;
      });
      animation.run();
    },

    drawInitial: function(drawProperties){
      baselineZoomLevel = drawProperties.scaleLevel;
      positionInitialTiles(drawProperties);
      drawTiles();
    },

    drawZoom: function(drawProperties){
      positionZoomTiles(drawProperties);
      drawTiles();
    },

    drawPan: function(drawProperties){
      positionPanTiles(drawProperties);
      drawTiles();
    },

    load: function(htmlStr){
      Utils.loadHTMLContent(webMapRootNode, htmlStr);
      this.rootNode = document.getElementById("basemap-layer");
      frameNodes[0] = document.getElementById("frame-0");
      frameNodes[1] = document.getElementById("frame-1");
      frameNodes[0].style.display = "none";
      frameNodes[1].style.display = "none";
      eventDispatcher.broadcast("basemapReady");
    },

    loadTiles: function(){
      numTiles.width = calculateTilesNeeded("width");
      numTiles.height = calculateTilesNeeded("height");
      var totalTilesNeeded = numTiles.height * numTiles.width;
      //don't think I need two
      var frame0imageTracker = NewImageTracker(totalTilesNeeded, imageTrackerCallback);
      var frame1imageTracker = NewImageTracker(totalTilesNeeded, imageTrackerCallback);
      frameImageTrackers.push(frame0imageTracker);
      frameImageTrackers.push(frame1imageTracker);
      createImageTiles(frameNodes, totalTilesNeeded);
      eventDispatcher.broadcast("basemapTilesLoaded");
    },

  };

};


/*
draw: function(viewpoint){
  var mapProperties = containerService.currentMapProperties;
  var zoomLevelFloor = Math.floor(viewpoint.z);
  var diff = zoomLevelFloor - viewpoint.z;
  var tileSize = (Esri.basemapTileSizePx / Math.pow(2, diff));
  var resizeFactor = Math.pow(2, viewpoint.z - zoomLevelFloor);
  var numBasemapTiles = Math.round(mapProperties.numPixels / tileSize);

  var centerMapX = viewpoint.x / mapProperties.pixelSize;
  var centerMapY = viewpoint.y / mapProperties.pixelSize;
  var leftMapCoord = Math.floor(centerMapX - containerService.dimensionsPx.width * 0.5);
  var topMapCoord =  Math.floor(centerMapY - containerService.dimensionsPx.height * 0.5);
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


*/
