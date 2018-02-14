"use strict";


var NewZoomAnimator = function(eventDispatcher, webMapStates, viewpointService){


  //private, configurable constants --------------------------------------------

  const zoomIncrementTime = 400;


  //private variables ----------------------------------------------------------

  var animateFunction;
  var startTime;
  var duration;


  //private functions ----------------------------------------------------------

  var start = function(){
    eventDispatcher.broadcast("mapMoveAnimationStarted");
  };

  var stop = function(){
    eventDispatcher.broadcast("mapMoveAnimationEnded");
  };

  var calculateAnimationDuration = function(delta){
    if (delta.z == 0){
       var percentDeltaX = Math.abs(delta.x / WebMercator.circumference);   //put this elsewhere
       var percentDeltaY = Math.abs(delta.y / WebMercator.circumference);
       var largerPercentage = Math.max(percentDeltaX, percentDeltaY);
       return 1000 * largerPercentage;
    } else {
      return zoomIncrementTime * Math.abs(delta.z);
    }
  };

  var animatePan = function(deltaResult){
    if (deltaResult.changeViewpoint){
      var mapProperties = MapModel.getMapProperties(scaleService.currentScaleLevel);
      var deltaXPx = deltaResult.delta.x / mapProperties.pixelSize;
      var deltaYPx = deltaResult.delta.y / mapProperties.pixelSize;
      var initX = viewpointService.currentViewpoint.x;
      var initY = viewpointService.currentViewpoint.y;
      animateFunction = function(totalProgress){
        var newX = initX + deltaResult.delta.x * totalProgress;
        var newY = initY + deltaResult.delta.y * totalProgress;
        var deltaXPxIncrement = deltaXPx * (totalProgress - prevTotalProgress)
        var deltaYPxIncrement = deltaYPx * (totalProgress - prevTotalProgress);
        viewpointService.updateViewpoint(newX, newY);
        var viewpointChangeProperties = {
          changeType: "pan",
          scaleLevel: scaleService.currentScaleLevel,
          newViewpoint: {x:newX, y:newY},
          deltaPx: {x:deltaXPxIncrement, y:deltaYPxIncrement},
        }
        eventDispatcher.broadcast("viewpointPanned", viewpointChangeProperties);
      };
      prevTotalProgress = 0;
      duration = calculateAnimationDuration("pan", deltaResult.delta);
      startTime = new Date().getTime();
      start();
    }

  };



  //public attributes and methods ----------------------------------------------

  return {

    cycle: function(){
      var timeStamp = new Date().getTime();
      var runTime = timeStamp - startTime;
      var totalProgress = runTime / duration;
      totalProgress = Math.min(totalProgress, 1);
      animateFunction(totalProgress);
      if (totalProgress == 1){
        stop();
      }
    },

    animateMove: function(mapMoveProperties){
      var deltaResults = viewpointService.calculateAnimationViewpointChange(mapMoveProperties);
      animateFunction = function(totalProgress){
        var newX = deltaResults.init.x + deltaResults.delta.x * totalProgress;
        var newY = deltaResults.init.y + deltaResults.delta.y * totalProgress;
        var newZ = deltaResults.init.z + deltaResults.delta.z * totalProgress;
        viewpointService.updateViewpoint({x:newX, y:newY, z:newZ});
      }
      duration = calculateAnimationDuration(deltaResults.delta);
      startTime = new Date().getTime();
      start();
    },
  };

};
