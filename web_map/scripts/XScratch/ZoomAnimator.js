"use strict";


var NewZoomAnimator = function(eventDispatcher, webMapStates, viewpointService){


  //private, configurable constants --------------------------------------------

  const zoomIncrementTime = 1300;
  const minPanTime = 100;


  //private variables ----------------------------------------------------------

  var animateFunction;
  var numFramesDuration;
  var numFramesComplete;


  //private functions ----------------------------------------------------------

  var calculateAnimationDuration = function(delta){
    if (delta.z == 0){
      var mapProperties = webMapStates.currentMapProperties;
      var deltaXPx = Math.abs(delta.x) / mapProperties.pixelSize;
      var deltaYPx = Math.abs(delta.y) / mapProperties.pixelSize;
      var duration = Math.max(deltaXPx, deltaYPx, minPanTime);
      var numFrames = duration / 1000 * 60;
      return Math.ceil(numFrames);
    } else {
      return 16 * Math.abs(delta.z);
    }
  };


  //public attributes and methods ----------------------------------------------

  return {

    cycle: function(){
      numFramesComplete += 1;
      var totalProgress = numFramesComplete / numFramesDuration;
      animateFunction(totalProgress);
      if (numFramesComplete == numFramesDuration){
        eventDispatcher.broadcast("mapMoveAnimationEnded");
      }
    },

    animateMove: function(mapMoveProperties){

      var deltaResults = viewpointService.calculateAnimationViewpointChange(mapMoveProperties);

      var zoomLevelDiff = deltaResults.new.z - deltaResults.init.z;
      var tileSizeDiff = (Esri.basemapTileSizePx * Math.pow(2, zoomLevelDiff)) - Esri.basemapTileSizePx;

      if (deltaResults.new.z > deltaResults.init.z){
        var tileSizeIncrement = 256/16;
        var levelIncrement = 1;
      } else {
        var tileSizeIncrement = -128/16;
        var levelIncrement = -1;
      }

      numFramesDuration = calculateAnimationDuration(deltaResults.delta);
      var tileSizeDiffPerFrame = tileSizeDiff / numFramesDuration;
      var currentMapProperties = MapModel.getMapProperties(deltaResults.init.z);
      var deltaXPx = deltaResults.delta.x / currentMapProperties.pixelSize;
      var deltaYPx = deltaResults.delta.y /currentMapProperties.pixelSize;

    //  var deltaXPxInit = deltaResults.delta.x / currentMapProperties.pixelSize;
    //  var deltaYPxInit = deltaResults.delta.y /currentMapProperties.pixelSize;
    //  console.log("new");

    //  console.log(deltaXPxInit, deltaYPxInit);

      animateFunction = function(totalProgress){
        var numFrame = totalProgress * numFramesDuration;

      //  var newZ = calculateZ(numFrame, deltaResults.init.z, deltaResults.delta.z, numFramesDuration);
      //  console.log(newZ);

    /*    var newLevelIncrement = Math.trunc(numFrame / 16) * levelIncrement;
        var newTileSize = Esri.basemapTileSizePx + (numFrame % 16) * tileSizeIncrement;
        var resizeFactor = newTileSize / Esri.basemapTileSizePx;
        var newZ = deltaResults.init.z + Math.log2(resizeFactor) + newLevelIncrement;*/

        var newTileSize = Esri.basemapTileSizePx + tileSizeDiffPerFrame * numFrame;
        var resizeFactor = newTileSize / Esri.basemapTileSizePx;
        var newZ = deltaResults.init.z + Math.log2(resizeFactor);
    //    console.log(newZ);

        //new code start
/*        var currentMapProperties = MapModel.getMapProperties(newZ);
        var deltaXPxCurrent = deltaResults.delta.x / currentMapProperties.pixelSize;
        var deltaYPxCurrent = deltaResults.delta.y /currentMapProperties.pixelSize;
        var percentZComplete = (newZ - deltaResults.init.z) / deltaResults.delta.z;
        var targetDeltaXPx1 = deltaXPxCurrent * percentZComplete;
        var targetDeltaYPx1 = deltaYPxCurrent * percentZComplete;
        var newX = deltaResults.init.x + targetDeltaXPx1 * currentMapProperties.pixelSize;
        var newY = deltaResults.init.y + targetDeltaYPx1 * currentMapProperties.pixelSize;*/

        //new code end

        var currentMapProperties = MapModel.getMapProperties(newZ);
        var targetDeltaXPx = deltaXPx * (1 - totalProgress);
        var targetDeltaYPx = deltaYPx * (1 - totalProgress);
        var newX = deltaResults.new.x - targetDeltaXPx * currentMapProperties.pixelSize;
        var newY = deltaResults.new.y - targetDeltaYPx * currentMapProperties.pixelSize;
        viewpointService.updateViewpoint({x:newX, y:newY, z:newZ});
      }
      numFramesComplete = 0;

      if (deltaResults.delta.x != 0 || deltaResults.delta.y != 0 || deltaResults.delta.z != 0){
        var type = "pan";
        if (deltaResults.delta.z != 0){
          type = "zoom";
        }
        eventDispatcher.broadcast("mapMoveAnimationStarted", type);
      }
    },
  };

};
