"use strict";


var NewMapBasemapModel = function(eventDispatcher){

  //private variables ----------------------------------------------------------

  var numTiles;
  var imagesLoadedLookup;
  var doneLoadingImages;
  var buffer;
  var eventProperties;
  var eventFrames;
  var baselineFrameTiles;


  //private functions ----------------------------------------------------------

  var copyWebMapStates = function(webMapStates){
    return {
      viewpointCenterWorld: {
        x: webMapStates.viewpointCenterWorld.x,
        y: webMapStates.viewpointCenterWorld.y,
      },
      viewpointCenterMap: {
        x: webMapStates.viewpointCenterMap.x,
        y: webMapStates.viewpointCenterMap.y,
      },
      viewpointTopLeftMap: {
        left: webMapStates.viewpointTopLeftMap.left,
        top: webMapStates.viewpointTopLeftMap.top,
      },
      scaleLevel: webMapStates.scaleLevel,
      mapPixelSize: webMapStates.mapPixelSize,
      mapPixelNum: webMapStates.mapPixelNum,
    };
  };

  var checkAllLoaded= function(){
    var keys = Object.keys(imagesLoadedLookup);
    for (var i = 0; i < keys.length; i++){
      var imageId = keys[i];
      if (imagesLoadedLookup[imageId] == false){
        return;
      }
    }
    eventDispatcher.broadcast("eventImagesLoaded", eventFrames);
  };

  var preloadTileImage = function(tile){
    var tileId = `${tile.imageTileLevel}-${tile.xIndex}-${tile.yIndex}`;
    if (tileId in imagesLoadedLookup == false){
      imagesLoadedLookup[tileId] = false;
      var newImage = new Image();
      newImage.onload = function(){
        imagesLoadedLookup[tileId] = true;
        if (doneLoadingImages){
          checkAllLoaded();
        }
      }
      newImage.src = tile.src;
    }
  };

  var createTiles = function(){
    var tileList = [];
    for (var i = 0; i < numTiles.total; i++){
      var newTile = NewBasemapTileModel();
      tileList.push(newTile);
    }
    return tileList;
  };

  var createTilesInitial = function(frameProperties, webMapStates, webMapDimensionsPx){
    eventDispatcher.broadcast("eventImagesLoading");
    var newTiles = createTiles();
    var tileSize = Esri.basemapTileSizePx;
    var numBasemapTiles = Math.round(webMapStates.mapPixelNum / tileSize);
    var bufferedLeftMapCoord = webMapStates.viewpointCenterMap.x - webMapDimensionsPx.width;
    var bufferedTopMapCoord = webMapStates.viewpointCenterMap.y - webMapDimensionsPx.height;
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
        var tile = newTiles[tileIndex];
        tile.yIndex = j + bufferedTopTileCoord;
        if (tile.yIndex < 0 || tile.yIndex >= numBasemapTiles){
          tile.valid = false;
          continue;
        }
        tile.xIndex = (i + bufferedLeftTileCoord ) % numBasemapTiles;
        tile.xIndex = (tile.xIndex < 0) ? tile.xIndex + numBasemapTiles : tile.xIndex;
        tile.imageTileLevel = webMapStates.scaleLevel;
        tile.leftScreenCoord = (bufferedLeftTileCoord + i) * tileSize - leftScreenOffset;
        tile.topScreenCoord = (bufferedTopTileCoord + j) * tileSize - topScreenOffset;
        tile.scaleFactor = 1;
        tile.src = `${Esri.basemapURLString}/${tile.imageTileLevel}/${tile.yIndex}/${tile.xIndex}`;
        preloadTileImage(tile);
      }
    }
    var newFrame = {tiles:newTiles, properties:frameProperties};
    eventFrames.unshift(newFrame);
    baselineFrameTiles = newTiles;
  };

  var createTilesZoom = function(frameProperties, webMapStates, webMapDimensionsPx){
    var newTiles = createTiles();
    var tileSize = frameProperties.tileSize;
    var numBasemapTiles = Math.round(webMapStates.mapPixelNum / tileSize);
    var leftTileCoord = Math.floor(webMapStates.viewpointTopLeftMap.left / tileSize);
    var topTileCoord = Math.floor(webMapStates.viewpointTopLeftMap.top / tileSize);
    var leftMapOffset = webMapStates.viewpointTopLeftMap.left % tileSize;
    var topMapOffset = webMapStates.viewpointTopLeftMap.top % tileSize;
    leftMapOffset = (leftMapOffset < 0) ? leftMapOffset + tileSize : leftMapOffset;
    topMapOffset = (topMapOffset < 0) ? topMapOffset + tileSize : topMapOffset;

    for (var j = 0; j < numTiles.height; j++){
      for (var i = 0; i < numTiles.width; i++){
        var tileIndex = i + j * numTiles.width;
        var tile = newTiles[tileIndex];

        tile.yIndex = j + topTileCoord;
        if (tile.yIndex < 0 || tile.yIndex >= numBasemapTiles){
          tile.valid = false;
          continue;
        }

        var expansionDistance = (tileSize - Esri.basemapTileSizePx) / 2;
        var rightVisibilityThreshold = webMapDimensionsPx.width + expansionDistance;
        var leftVisibilityThreshold = -tileSize + expansionDistance;
        tile.leftScreenCoord = i * tileSize - leftMapOffset + expansionDistance;
        if (tile.leftScreenCoord < leftVisibilityThreshold || tile.leftScreenCoord > rightVisibilityThreshold){
          tile.visible = false;
          continue;
        }

        var bottomVisibilityThreshold = webMapDimensionsPx.height + expansionDistance;
        var topVisibilityThreshold = -tileSize + expansionDistance;
        tile.topScreenCoord = j * tileSize - topMapOffset + expansionDistance;
        if (tile.topScreenCoord < topVisibilityThreshold || tile.topScreenCoord > bottomVisibilityThreshold){
          tile.visible = false;
          continue;
        }

        tile.xIndex = (i + leftTileCoord) % numBasemapTiles;
        tile.xIndex = (tile.xIndex < 0) ? tile.xIndex + numBasemapTiles : tile.xIndex;
        tile.imageTileLevel = frameProperties.tileLevel;
        tile.scaleFactor = frameProperties.scaleFactor;
        tile.src = `${Esri.basemapURLString}/${tile.imageTileLevel}/${tile.yIndex}/${tile.xIndex}`;
        preloadTileImage(tile);
      }
    }
    var newFrame = {tiles:newTiles, properties:frameProperties};
    eventFrames.unshift(newFrame);
  };

  var positionTilesPan = function(frameProperties, webMapStates, webMapDimensionsPx){
    eventDispatcher.broadcast("eventImagesLoading");
    var deltaPx = frameProperties.deltaPx;
    buffer.left += deltaPx.x;
    buffer.right -= deltaPx.x;
    buffer.top += deltaPx.y;
    buffer.bottom -= deltaPx.y;
    if (buffer.left < 0 || buffer.right < 0 || buffer.top < 0 || buffer.bottom < 0){
      eventFrames = [];
      createTilesInitial(frameProperties, webMapStates, webMapDimensionsPx);
      return;
    }
    baselineFrameTiles.forEach(function(tile){
      tile.leftScreenCoord -= deltaPx.x;
      tile.topScreenCoord -= deltaPx.y;
    });
    var newFrame = {tiles:baselineFrameTiles, properties:frameProperties};
    eventFrames.unshift(newFrame);
  };


  //public properties and methods ----------------------------------------------

  return {

    configure: function(numTilesNeeded){
      numTiles = numTilesNeeded;
      eventDispatcher.broadcast("mapBasemapModelConfigured");
    },

    createNewFrame: function(frameProperties, webMapStates, webMapDimensionsPx){
      if (frameProperties.loadFrameNum == 1){
        eventFrames = [];
        imagesLoadedLookup = {};
        doneLoadingImages = false;
      }
      frameProperties.webMapStates = copyWebMapStates(webMapStates);
      switch(frameProperties.type){
        case "init":
          createTilesInitial(frameProperties, webMapStates, webMapDimensionsPx);
          break;
        case "zoom":
          createTilesZoom(frameProperties, webMapStates, webMapDimensionsPx);
          break;
        case "pan":
          positionTilesPan(frameProperties, webMapStates, webMapDimensionsPx);
          break;
      }
      if (frameProperties.loadFrameNum == frameProperties.totalLoadFrames){
        doneLoadingImages = true;
        checkAllLoaded();
      }
    },

  };

};
