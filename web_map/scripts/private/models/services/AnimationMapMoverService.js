"use strict";


var NewAnimationMapMoverService = function(eventDispatcher, webMapStates){


  //private, configurable constants ------------------------------------------

  const zoomIncrementFrames = 16;
  const minPanFrames = 6;


  //private variables ----------------------------------------------------------

  var eventProperties;


  //private functions ----------------------------------------------------------

  var initEventProperties = function(eventType){
    eventProperties = {
      type: "animation",
      subType: eventType,
      status: null,
      callbackMessage: "animationMoveEnded",
    };
  };

  var newFramePropertiesZoom = function(i, currentTileLevel, newTileSize, scaleFactor){
    return {
      type: "zoom",
      status: null,
      frameNum: i,
      loadFrameNum: i,
      totalLoadFrames: eventProperties.totalFrames,
      eventFrameNum: i,
      totalEventFrames: eventProperties.totalFrames,
      toggleType: "default",
      tileLevel: currentTileLevel,
      tileSize: newTileSize,
      scaleFactor: scaleFactor,
    };
  };

  var calculateMovementProperties = function(moveRequestProperties){
    var results = webMapStates.calculateAnimationViewpointScaleChange(moveRequestProperties);
    var isZooming = (results.delta.scaleLevel != 0);
    var isPanning = (results.delta.x != 0 || results.delta.y != 0);
    return {
      results: results,
      isMovement: (isZooming || isPanning),
      eventType: (isZooming)? "zoom" : "pan",
    };
  };

  var calculateAnimationDuration = function(deltaXPx, deltaYPx, deltaScaleLevel){
    if (deltaScaleLevel != 0){
      return zoomIncrementFrames * Math.abs(deltaScaleLevel);
    } else {
      var duration = Math.max(Math.abs(deltaXPx), Math.abs(deltaYPx));
      var numFrames = Math.ceil(duration / 1000 * 60);
      return Math.max(numFrames, minPanFrames);
    }
  };

  var calculateTileSizeDiffPerFrame = function(deltaScaleLevel){
    if (deltaScaleLevel > 0) {
      return Esri.basemapTileSizePx / zoomIncrementFrames;
    } else {
      return -0.5 * Esri.basemapTileSizePx / zoomIncrementFrames;
    }
  };

  var createZoomFrames = function(results, currentTileLevel, tileSizeDiffPerFrame){

    var finalScaleLevel = results.new.scaleLevel;
    var newTileSize = Esri.basemapTileSizePx;
    var scaleFactor;

    for (var i = 1; i <= (eventProperties.totalFrames-1); i++){
      newTileSize += tileSizeDiffPerFrame;
      if (newTileSize > (Esri.basemapTileSizePx * 2)){
        newTileSize -= Esri.basemapTileSizePx;
        currentTileLevel++;
      }
      if (newTileSize < (Esri.basemapTileSizePx / 2)){
        newTileSize += Esri.basemapTileSizePx / 2;
        currentTileLevel--;
      }
      scaleFactor = newTileSize / Esri.basemapTileSizePx;
      var newScaleLevel = currentTileLevel + Math.log2(scaleFactor);

      if (Math.abs(newScaleLevel - finalScaleLevel) < 2){
        var newPixelProperties = webMapStates.calculateMapPixelProperties(newScaleLevel);
        var deltaXPx = results.delta.x / newPixelProperties.size;
        var deltaYPx = results.delta.y / newPixelProperties.size;

        if (results.delta.scaleLevel < 0){
          var newDeltaZ = Math.max(-2, results.delta.scaleLevel);
        } else {
          var newDeltaZ = Math.min(2, results.delta.scaleLevel);
        }

        var percentZComplete = 1 - (finalScaleLevel - newScaleLevel) / newDeltaZ;
        var targetDeltaXPx = deltaXPx * (1 - percentZComplete);
        var targetDeltaYPx = deltaYPx * (1 - percentZComplete);
        var newX = results.new.x - targetDeltaXPx * newPixelProperties.size;
        var newY = results.new.y - targetDeltaYPx * newPixelProperties.size;
        webMapStates.updateViewpointScale({x:newX, y:newY}, newScaleLevel);
      } else {
        webMapStates.updateViewpointScale(null, newScaleLevel);
      }
      var frameProperties = newFramePropertiesZoom(i, currentTileLevel, newTileSize, scaleFactor);
      eventDispatcher.broadcast("createNewFrame", frameProperties);
    }
    var frameProperties = newFramePropertiesZoom(eventProperties.totalFrames);
    frameProperties.type = "init";
    frameProperties.toggleType = "zoomEventFinalFrameFadeIn";
    eventDispatcher.broadcast("createNewFrame", frameProperties);
  };

  var createPanFrames = function(currentTileLevel, results){
    var initX = results.current.x;
    var initY = results.current.y;
    var frameDeltaX = results.delta.x / eventProperties.totalFrames
    var frameDeltaY = results.delta.y / eventProperties.totalFrames;
    for (var i = 1; i <= eventProperties.totalFrames; i++){
      var newX = initX + frameDeltaX * i;
      var newY =  initY + frameDeltaY * i;
      webMapStates.updateViewpointScale({x:newX, y:newY}, null);
      var frameProperties = newFramePropertiesZoom(i, currentTileLevel, Esri.basemapTileSizePx, 1);
      if (i == eventProperties.totalFrames){
        frameProperties.type = "init";
      }
      eventDispatcher.broadcast("createNewFrame", frameProperties);
    }
  };

  var createFrames = function(results){
    var deltaXPx = results.delta.x / webMapStates.mapPixelSize;
    var deltaYPx = results.delta.y / webMapStates.mapPixelSize;
    var deltaScaleLevel = results.delta.scaleLevel;
    var currentTileLevel = webMapStates.scaleLevel;
    eventProperties.totalFrames = calculateAnimationDuration(deltaXPx, deltaYPx, deltaScaleLevel);
    eventDispatcher.broadcast("startNewFrameTogglerEvent", eventProperties);
    if (eventProperties.subType == "zoom"){
      eventProperties.totalFrames++;
      var tileSizeDiffPerFrame = calculateTileSizeDiffPerFrame(deltaScaleLevel);
      createZoomFrames(results, currentTileLevel, tileSizeDiffPerFrame);
    } else {
      createPanFrames(currentTileLevel, results);
    }
  };


  //public properties and methods ----------------------------------------------

  return {

    animationMoveRequestHandler: function(moveRequestProperties){
      var movementProperties = calculateMovementProperties(moveRequestProperties);
      if (movementProperties.isMovement){
        initEventProperties(movementProperties.eventType);
        createFrames(movementProperties.results);
        eventDispatcher.broadcast("animationMoveStarted", moveRequestProperties);
      };
    },

  };

};
