"use strict";


var NewPanAnimator = function(eventDispatcher, webMapStates, viewpointService){


  //private, configurable constants --------------------------------------------

  const totalStopDuration = 500;
  const panResetThreshold = 1000/60;
  const maxVelocity = 50;


  //private variables ----------------------------------------------------------

  var userControlling;
  var panStarted;
  var panArray;
  var prevCycleTimeStamp;
  var endVelocity;
  var stopTime;


  //private functions ----------------------------------------------------------

  var start = function(){
    panStarted = true;
    eventDispatcher.broadcast("panStarted");
  };

  var stop = function(){
    panStarted = false;
    eventDispatcher.broadcast("panEnded");
  };

  var getPanSums = function(startTime, endTime){
    var sums = {x:0, y:0};
    for (var i = 0; i < panArray.length; i++){
      var currentPan = panArray[i];
      if (currentPan.timeStamp > endTime){
          sums.x += currentPan.x;
          sums.y += currentPan.y;
          currentPan.recorded = true;
      } else {
        break;
      }
    }
    sums.x = Math.min(Math.max(sums.x, -maxVelocity), maxVelocity);
    sums.y = Math.min(Math.max(sums.y, -maxVelocity), maxVelocity);
    return sums;
  };

  var panFunction = function(deltaXPx, deltaYPx){
    var mapProperties = webMapStates.currentMapProperties;
    var newX = webMapStates.currentViewpoint.x + deltaXPx * mapProperties.pixelSize;
    var newY = webMapStates.currentViewpoint.y + deltaYPx * mapProperties.pixelSize;
    viewpointService.updateViewpoint({x:newX, y:newY, z:webMapStates.currentViewpoint.z});
  };


  //init code ------------------------------------------------------------------

  userControlling = false;
  panStarted = false;

  panArray = [];
  prevCycleTimeStamp = 0;
  endVelocity = {x:0, y:0};


  //public attributes and functions --------------------------------------------

  return {

    cycle: function(){

      var timeStamp = new Date().getTime();

      if (userControlling){
        var velocity = getPanSums(timeStamp, prevCycleTimeStamp);
        prevCycleTimeStamp = timeStamp;
        panFunction(velocity.x, velocity.y);
      } else {
        var currentStopDuration = timeStamp - stopTime;
        if (currentStopDuration <= totalStopDuration){
          var newVelocityX = endVelocity.x * (1 - currentStopDuration / totalStopDuration);
          var newVelocityY = endVelocity.y * (1 - currentStopDuration / totalStopDuration);
          panFunction(newVelocityX, newVelocityY);
        } else {
          stop();
        }
      }

    },

    pan: function(distance){
      panArray.unshift({
        x: distance.x,
        y: distance.y,
        timeStamp: new Date().getTime(),
      });
    },

    start: function(){
      userControlling = true;
      panArray = [];
      if (panStarted == false){
        start();
      }
    },

    end: function(){
      userControlling = false;
      stopTime = new Date().getTime();
      endVelocity = getPanSums(stopTime, stopTime - panResetThreshold);
      if (endVelocity.x == 0 && endVelocity.y == 0){
        stop();
      }
    },

  };

};
