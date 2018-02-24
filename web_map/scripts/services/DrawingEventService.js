"use strict";


var NewDrawingEventService = function(eventDispatcher, viewpoint, scale, pixel, viewport){

  //private variables ----------------------------------------------------------

  var currentDrawingEvent;


  //private functions ----------------------------------------------------------

  var getCurrentDrawingProperties = function(){
    var currentPixelProperties = pixel.getCurrentProperties(scale.currentLevel);
    var viewportProperties = viewport.getCurrentProperties(viewpoint.currentCoords, currentPixelProperties);
    return {
      viewpoint: viewpoint.currentCoords,
      scaleLevel: scale.currentLevel,
      pixelProperties: currentPixelProperties,
      viewportProperties: viewportProperties,
    };
  };

  var listen = function(){
    currentDrawingEvent.toggleFrames();
    currentDrawingEvent.updateStatus();
    currentDrawingEvent.newAnimationFrame();
    currentDrawingEvent.updateStatus();
    if (currentDrawingEvent.animationStatus == "done"){
      currentDrawingEvent.callback();
    } else {
      requestAnimationFrame(function(){
        listen();
      });
    }
  };

  var NewInitViewpointEvent = function(){

    //public attributes and methods ----------------------------------------------

    return {
      notifyBasemapDrawingComplete: function(){
        eventDispatcher.broadcast("basemapToggleFramesRequestInitial");
      },
      notifyBasemapFrameTogglingComplete: function(){
        eventDispatcher.broadcast("initBasemapDrawingComplete");
        currentDrawingEvent = null;
      },
    };
  };

  var NewAnimationEvent = function(animationMoveProperties){

    //private, configurable constants ------------------------------------------

    const zoomIncrementFrames = 16;
    const minPanFrames = 6;


    //private variables --------------------------------------------------------

    var completed = false;
    var currentFrameNum = 0;
    var numFramesCompleted = 0;
    var currentFrameStatus = null;


    //private code block -------------------------------------------------------

    var deltaScaleLevelResults = scale.calculateAnimationScaleLevelChange(animationMoveProperties);
    var initScaleLevel = deltaScaleLevelResults.current;
    var deltaScaleLevel = deltaScaleLevelResults.delta;
    var animationType = (deltaScaleLevel != 0) ? "zoom" : "pan";
    var deltaViewpointResults = viewpoint.calculateAnimationViewpointChange(animationMoveProperties);
    var deltaViewpoint = deltaViewpointResults.delta;
    if (deltaViewpoint.x == 0 && deltaViewpoint.y == 0 && deltaScaleLevel == 0){
      return null;
    };

    var currentPixelProperties = pixel.getCurrentProperties(scale.currentLevel);
    var deltaXPx = deltaViewpoint.x / currentPixelProperties.size;
    var deltaYPx = deltaViewpoint.y / currentPixelProperties.size;

    if (deltaScaleLevel != 0){
      var numFramesDuration = zoomIncrementFrames * Math.abs(deltaScaleLevel);
      var tileSizeDiff = Esri.basemapTileSizePx * (Math.pow(2, deltaScaleLevel) - 1);
      var tileSizeDiffPerFrame = tileSizeDiff / numFramesDuration;
    } else {
      var duration = Math.max(Math.abs(deltaXPx), Math.abs(deltaYPx));
      var numFrames = Math.ceil(duration / 1000 * 60);
      var numFramesDuration = Math.max(numFrames, minPanFrames);
    }

    //public attributes and methods --------------------------------------------

    return {
      animationStatus: null,

      toggleFrames: function(){
        if (currentFrameStatus == "drawn"){
          eventDispatcher.broadcast("basemapToggleFramesRequest");
          eventDispatcher.broadcast("graphicsToggleFramesRequest");
          numFramesCompleted++;
    //      console.log("toggling frame " + numFramesCompleted);
        }
      },

      updateStatus: function(){
        if (numFramesCompleted == numFramesDuration){
          this.animationStatus = "done";
        } else {
          this.animationStatus == "animating";
        }
      },

      newAnimationFrame: function(){
        currentFrameNum += 1;
        if (currentFrameNum > numFramesDuration){
          return;
        }
        var totalProgress = currentFrameNum / numFramesDuration;
        if (animationType == "zoom"){
          var newTileSize = Esri.basemapTileSizePx + tileSizeDiffPerFrame * currentFrameNum;
          var resizeFactor = newTileSize / Esri.basemapTileSizePx;
          var newScaleLevel = initScaleLevel + Math.log2(resizeFactor);
          var newPixelProperties = pixel.getCurrentProperties(newScaleLevel);
          var targetDeltaXPx = deltaXPx * (1 - totalProgress);
          var targetDeltaYPx = deltaYPx * (1 - totalProgress);
          var newX = deltaViewpointResults.new.x - targetDeltaXPx * newPixelProperties.size;
          var newY = deltaViewpointResults.new.y - targetDeltaYPx * newPixelProperties.size;
          viewpoint.updateViewpoint({x:newX, y:newY});
          scale.updateLevel(newScaleLevel);
          var currentDrawingProperties = getCurrentDrawingProperties();
          eventDispatcher.broadcast("startBasemapDrawingZoom", currentDrawingProperties);
          eventDispatcher.broadcast("startGraphicsDrawingZoom", currentDrawingProperties);
        } else {
          var frameDeltaX = deltaViewpoint.x / numFramesDuration;
          var frameDeltaY = deltaViewpoint.y / numFramesDuration;
          var panResults = viewpoint.calculatePanViewpointChange(frameDeltaX, frameDeltaY);
          viewpoint.updateViewpoint({x:panResults.new.x, y:panResults.new.y});
          var currentDrawingProperties = getCurrentDrawingProperties();
          var currentPixelProperties = currentDrawingProperties.pixelProperties;
          var frameDeltaXPx = panResults.delta.x / currentPixelProperties.size;
          var frameDeltaYPx = panResults.delta.y / currentPixelProperties.size;
          currentDrawingProperties.deltaPx = {x:frameDeltaXPx, y:frameDeltaYPx};
          eventDispatcher.broadcast("startBasemapDrawingPan", currentDrawingProperties);
          eventDispatcher.broadcast("startGraphicsDrawingPan", currentDrawingProperties);
        }
        currentFrameStatus == "drawing";
    //      console.log("drawing frame " + currentFrameNum);
      },

      notifyLayersDrawingComplete: function(){
        currentFrameStatus = "drawn";
      },

      notifyBasemapDrawingComplete: function(){     //rename this
        if (completed){
          if (animationType == "zoom"){
            eventDispatcher.broadcast("basemapToggleFramesRequestFinalZoom");
          } else {
            eventDispatcher.broadcast("basemapToggleFramesRequest");
          }
        }
      },

      notifyBasemapFrameTogglingComplete: function(){
      //  eventDispatcher.broadcast("drawingEventComplete");
        if (completed){
          eventDispatcher.broadcast("animationMoveEnded");
          currentDrawingEvent = null;
          //console.log("all done");
        }
      },

      callback: function(){
        completed = true;
    //    console.log("completed");
        var currentDrawingProperties = getCurrentDrawingProperties();
        eventDispatcher.broadcast("startBasemapDrawingFinal", currentDrawingProperties);
    //    console.log("drawing final frame");
      },

    };

  };

  var NewPanEvent = function(){

    //private configurable constants -------------------------------------------

    const numStopFramesDuration = 30;
    const panResetThresholdTime = 1000/60;
    const maxVelocity = 50;

    //private variables --------------------------------------------------------

    var panArray;
    var endVelocity;
    var prevCycleTimeStamp = new Date().getTime();
    var currentStopFrameNum;
    var numStopFramesCompleted;
    var userEngaged = false;
    var currentFrameStatus = null;


    //private functions --------------------------------------------------------

    var panFunction = function(deltaXPx, deltaYPx){
      if (deltaXPx == 0 && deltaYPx == 0){
        return false;
      }
      else {
        var pixelProperties = pixel.getCurrentProperties(scale.currentLevel);
        var deltaX = deltaXPx * pixelProperties.size;
        var deltaY = deltaYPx * pixelProperties.size;
        var panResults = viewpoint.calculatePanViewpointChange(deltaX, deltaY);
        var deltaXPxResult = panResults.delta.x / pixelProperties.size;
        var deltaYPxResult = panResults.delta.y / pixelProperties.size;
        viewpoint.updateViewpoint({x:panResults.new.x, y:panResults.new.y});
        var currentDrawingProperties = getCurrentDrawingProperties();
        currentDrawingProperties.deltaPx = {x:deltaXPxResult, y:deltaYPxResult};
        eventDispatcher.broadcast("startBasemapDrawingPan", currentDrawingProperties);
        eventDispatcher.broadcast("startGraphicsDrawingPan", currentDrawingProperties);
        return true;
      }
    };

    var getPanSums = function(startTime, endTime){
      var sums = {x:0, y:0};
      for (var i = 0; i < panArray.length; i++){
        var currentPan = panArray[i];
        if (currentPan.timeStamp > endTime){
            sums.x += currentPan.x;
            sums.y += currentPan.y;
        } else {
          break;
        }
      }
      sums.x = Math.min(Math.max(sums.x, -maxVelocity), maxVelocity);
      sums.y = Math.min(Math.max(sums.y, -maxVelocity), maxVelocity);
      return sums;
    };



    //public attributes and methods --------------------------------------------

    return {

      animationStatus: null,

      startRequest: function(){
        userEngaged = true;
        panArray = [];
      },

      pan: function(deltaPx){
        var timeStamp = new Date().getTime();
        panArray.unshift({x:deltaPx.x, y:deltaPx.y, timeStamp:timeStamp});
      },

      endRequest: function(){
        userEngaged = false;
        currentStopFrameNum = 0;
        numStopFramesCompleted = 0;
        var stopTime = new Date().getTime();
        endVelocity = getPanSums(stopTime, stopTime - panResetThresholdTime);
      },

      toggleFrames: function(){
        if (currentFrameStatus == "drawn"){
          eventDispatcher.broadcast("basemapToggleFramesRequest");
          eventDispatcher.broadcast("graphicsToggleFramesRequest");
          currentFrameStatus = "toggled";
          if (this.animationStatus == "animationPanning"){
            numStopFramesCompleted++;
    //          console.log("toggling stop frame " + numStopFramesCompleted);
          }
        }
      },

      updateStatus: function(){
        if (userEngaged){
          this.animationStatus = "userPanning";
        } else {
          if (endVelocity.x == 0 && endVelocity.y == 0){
            this.animationStatus = "done";
          } else {
            if (numStopFramesCompleted == numStopFramesDuration && currentFrameStatus == "toggled"){
              this.animationStatus = "done";
            } else {
              this.animationStatus = "animationPanning";
            }
          }
        }
      },

      newAnimationFrame: function(){
        if (this.animationStatus == "done" || currentFrameStatus == "drawn"){
          return;
        }
        if (this.animationStatus == "userPanning"){
          var timeStamp = new Date().getTime();
          var velocity = getPanSums(timeStamp, prevCycleTimeStamp);
          prevCycleTimeStamp = timeStamp;
          var newFrameDrawn = panFunction(velocity.x, velocity.y);
        } else {
          currentStopFrameNum++;
          if (currentStopFrameNum < numStopFramesDuration){
    //          console.log("drawing frame " + currentStopFrameNum);
            var newVelocityX = endVelocity.x * (1 - currentStopFrameNum / numStopFramesDuration);
            var newVelocityY = endVelocity.y * (1 - currentStopFrameNum / numStopFramesDuration);
            var newFrameDrawn = panFunction(newVelocityX, newVelocityY);
          }
          if (currentStopFrameNum == numStopFramesDuration){
            var currentDrawingProperties = getCurrentDrawingProperties();
    //            console.log("drawing frame 30");
            eventDispatcher.broadcast("startBasemapDrawingFinal", currentDrawingProperties);
          }
        }
      },

      notifyLayersDrawingComplete: function(){
        currentFrameStatus = "drawn";
      },

      notifyBasemapDrawingComplete: function(){
        currentFrameStatus = "drawn";                //don't know why this is needed
      },

      notifyBasemapFrameTogglingComplete: function(){
      },

      callback: function(){
        //        console.log("setting to null");
        currentDrawingEvent = null;
        eventDispatcher.broadcast("userPanEnded");
              //  console.log("all done");
      },
    };
  };

  //public attributes and methods ----------------------------------------------

  return {

    handleBasemapDrawingComplete: function(){
      currentDrawingEvent.notifyBasemapDrawingComplete();
    },

    handleBasemapFrameTogglingComplete: function(){
      currentDrawingEvent.notifyBasemapFrameTogglingComplete();
    },

    handleLayersDrawingComplete: function(){
      currentDrawingEvent.notifyLayersDrawingComplete();
    },

    initViewpointEvent: function(){
      currentDrawingEvent = NewInitViewpointEvent();
      var currentDrawingProperties = getCurrentDrawingProperties();
      eventDispatcher.broadcast("startBasemapDrawingInitial", currentDrawingProperties);
    },

    animationMoveRequestHandler: function(animationMoveProperties){
      currentDrawingEvent = NewAnimationEvent(animationMoveProperties);
      if (currentDrawingEvent){
        eventDispatcher.broadcast("animationMoveStarted");
        requestAnimationFrame(function(){
          listen();
        });
      }
    },

    userPanStartRequestHandler: function(){
      if (currentDrawingEvent === null){
        currentDrawingEvent = NewPanEvent();
        eventDispatcher.broadcast("userPanStarted");
        requestAnimationFrame(function(){
          listen();
        });
      }
      currentDrawingEvent.startRequest();
    },

    userPanRequestHandler: function(deltaPx){
      if (currentDrawingEvent){
        currentDrawingEvent.pan(deltaPx);
      }
    },

    userPanEndRequestHandler: function(){
      if (currentDrawingEvent){
        currentDrawingEvent.endRequest();
      }
    },

  };

};
