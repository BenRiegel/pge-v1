"use strict";


var NewBasemapTile = function(){

  var NewFrameInfo = function(){
    return{
      hidden: false,
      xTileIndex: null,
      yTileIndex: null,
      yIndexValid: false,
      leftScreenCoord: null,
      topScreenCoord: null,
      scaleFactor: 1,
      size: Esri.basemapTileSizePx,
    }
  };

  return {
    framePositions: NewFrameInfo,
  };

};






var NewBasemapDisplay = function(eventDispatcher, webMapRootNode, webMapDimensionsPx){


  //private variables ----------------------------------------------------------

  var tiles;
  var numTiles;
  var frameImageTracker;
  var displayIndex,
      writeIndex;
  var baselineZoomLevel;    //shouldn't need this one
  var buffer;
  var frames;



  //private functions ----------------------------------------------------------

  var NewFrame = function(){
    return {
      node: null,
      images: [],
    }
  };

  var NewImageNode = function(){
    var newImage = new Image();
    newImage.draggable = false;
    newImage.classList.add("map-image");
    newImage.classList.add("no-highlight");
    return newImage;
  };

  var newImageOnLoadFunction = function(i){
    return function(){
      frameImageTracker.report(i);
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

  var createImageTiles = function(frames, numTiles){
    for (let i = 0; i < numTiles; i++){
      var newTile = {
        xIndex: null,
        yIndex: null,
        yIndexValid: false,
        leftScreenCoord: null,
        topScreenCoord: null,
        scaleFactor: 1,
        size: Esri.basemapTileSizePx,
      }
      var newImage = NewImageNode();
      newImage.addEventListener("load", newImageOnLoadFunction(i));
      frames[0].node.appendChild(newImage);
      frames[0].images.push(newImage);
      var newImage = NewImageNode();
      newImage.addEventListener("load", newImageOnLoadFunction(i));
      frames[1].node.appendChild(newImage);
      frames[1].images.push(newImage);
      tiles.push(newTile);
    }
  };

  var drawTiles = function(){

    frameImageTracker.clear();

    for (var j = 0; j < numTiles.height; j++){
      for (var i = 0; i < numTiles.width; i++){
        var tileIndex = i + j * numTiles.width;
        var tile = tiles[tileIndex];

        if (tile.yIndexValid == false){
          frames[writeIndex].images[tileIndex].style.display = "none";
          frameImageTracker.report(tileIndex);
          continue;
        }

        if (tile.leftScreenCoord < -tile.size || tile.leftScreenCoord > webMapDimensionsPx.width){
          frameImageTracker.report(tileIndex);
        }

        if (tile.topScreenCoord < -tile.size || tile.topScreenCoord > webMapDimensionsPx.height){
          frameImageTracker.report(tileIndex);
        }

        var newSrc = `${Esri.basemapURLString}${baselineZoomLevel}/${tile.yIndex}/${tile.xIndex}`;
        if (frames[writeIndex].images[tileIndex].src  == newSrc){
          frameImageTracker.report(tileIndex);
        } else {
          frames[writeIndex].images[tileIndex].src = newSrc;
        }

        var newX = Math.round(tile.leftScreenCoord);
        var newY = Math.round(tile.topScreenCoord);
        frames[writeIndex].images[tileIndex].style.transform = `translate(${newX}px, ${newY}px) scale(${tile.scaleFactor, tile.scaleFactor}`;

        if (frames[writeIndex].images[tileIndex].style.display == "none"){
          frames[writeIndex].images[tileIndex].style.display = "inline";
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
        tile.scaleFactor = 1;
        tile.size = tileSize;
      }
    }
  };

  var positionZoomTiles = function(drawProperties){

    var scaleLevel = drawProperties.scaleLevel;
    var pixelProperties = drawProperties.pixelProperties;
    var viewportProperties = drawProperties.viewportProperties;

    var diff = scaleLevel - baselineZoomLevel;
    if (diff < -1){
      baselineZoomLevel -= 1;
      diff += 1;
    }
    if (diff > 1){
      baselineZoomLevel += 1;
      diff -= 1;
    }
    var tileSize = (Esri.basemapTileSizePx * Math.pow(2, diff));   //redundant
    var scaleFactor = Math.pow(2, scaleLevel - baselineZoomLevel);  //redundant
    var numBasemapTiles = Math.round(pixelProperties.num / tileSize);  //redundant

    var leftTileCoord = Math.floor(viewportProperties.leftMapCoord / tileSize);
    var topTileCoord = Math.floor(viewportProperties.topMapCoord / tileSize);
    var leftMapOffset = viewportProperties.leftMapCoord % tileSize;
    var topMapOffset = viewportProperties.topMapCoord % tileSize;
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
        tile.scaleFactor = scaleFactor;
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
      console.log("redrawing to reset buffer")
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
  displayIndex = 0;
  writeIndex = 1;
  tiles = [];
  frames = [];


  //public attributes and methods ----------------------------------------------

  return {

    rootNode: null,

    toggleFrames: function(){
      frames[writeIndex].node.style.opacity = "1";
      frames[displayIndex].node.style.opacity = "0";
      displayIndex = 1 - displayIndex;
      writeIndex = 1 - writeIndex;
      eventDispatcher.broadcast("basemapFrameTogglingComplete");
    },

    //combine these two
    toggleFramesInitial: function(){
      frames[writeIndex].node.style.opacity = "0";
      frames[writeIndex].node.style.display = "block";
      frames[displayIndex].node.style.opacity = "0";
      frames[displayIndex].node.style.display = "block";
      var animation = NewAnimation();
      animation.addRunFunction(500, function(totalProgress){
        frames[writeIndex].node.style.opacity = `${totalProgress}`;
      });
      animation.setCallbackFunction(function(){
        displayIndex = 1 - displayIndex;
        writeIndex = 1 - writeIndex;
        eventDispatcher.broadcast("intialBasemapFrameTogglingComplete");
      });
      animation.run();
    },

    toggleFramesFinalZoom: function(){
      frames[writeIndex].node.style.opacity = "0";
      frames[writeIndex].node.style.zIndex = "2";
      frames[displayIndex].node.style.zIndex = "1";
      var animation = NewAnimation();
      animation.addRunFunction(500, function(totalProgress){
        frames[writeIndex].node.style.opacity = `${totalProgress}`;
      });
      animation.setCallbackFunction(function(){
        frames[displayIndex].node.style.opacity = "0";
        frames[writeIndex].node.style.zIndex = "1";
        frames[displayIndex].node.style.zIndex = "1";
        displayIndex = 1 - displayIndex;
        writeIndex = 1 - writeIndex;
        eventDispatcher.broadcast("finalBasemapFrameTogglingComplete");
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
      frames[0] = NewFrame();
      frames[1] = NewFrame();
      frames[0].node = document.getElementById("frame-0");
      frames[1].node = document.getElementById("frame-1");
      eventDispatcher.broadcast("basemapReady");
    },

    loadTiles: function(){
      numTiles.width = calculateTilesNeeded("width");
      numTiles.height = calculateTilesNeeded("height");
      var totalTilesNeeded = numTiles.height * numTiles.width;
      frameImageTracker = NewImageTracker(totalTilesNeeded, imageTrackerCallback);
      createImageTiles(frames, totalTilesNeeded);
      eventDispatcher.broadcast("basemapTilesLoaded");
    },

  };

};
