"use strict";


var NewUserPanMapMoverService = function(eventDispatcher, webMapStates){

  //private configurable constants -------------------------------------------

  const numStopFramesDuration = 30;
  const panResetThresholdTime = 1000/60;
  const panResetThresholdTimeEnd = 100;
  const maxVelocity = 50;


  //private variables ----------------------------------------------------------

  var eventProperties;
  var panStatus;
  var panArray;
  var endVelocity;
  var prevCycleTimeStamp;
  var currentStopFrameNum;
  var numStopFramesCompleted;


  //private functions ----------------------------------------------------------

  var newEventProperties = function(){
    return {
      type: "pan",
      subType: null,
      status: "readyForNewFrame",
      callbackMessage: "userPanEnded",
      userReset: false,
    };
  };

  var newFrameProperties = function(type, num, totalEventNum){
    return {
      type: type,
      status: null,
      loadFrameNum: 1,
      totalLoadFrames: 1,
      eventFrameNum: num,
      totalEventFrames: totalEventNum,
      toggleType: "default",
    };
  };

  var panFunction = function(frameNum, totalFrames, deltaXPx, deltaYPx){
    if (deltaXPx == 0 && deltaYPx == 0){
      return;
    }
    var deltaX = deltaXPx * webMapStates.mapPixelSize;
    var deltaY = deltaYPx * webMapStates.mapPixelSize;
    var panResults = webMapStates.calculatePanViewpointChange(deltaX, deltaY);
    var deltaXPxResult = panResults.delta.x / webMapStates.mapPixelSize;
    var deltaYPxResult = panResults.delta.y / webMapStates.mapPixelSize;
    webMapStates.updateViewpointScale({x:panResults.new.x, y:panResults.new.y}, null);
    var frameProperties = newFrameProperties("pan", frameNum, totalFrames);
    frameProperties.deltaPx = {x:deltaXPxResult, y:deltaYPxResult};
    eventDispatcher.broadcast("createNewFrame", frameProperties);
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

  //get rid of this
  var getPanSumsEnd = function(startTime, endTime){
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
    sums.x = sums.x * (1000/60) / panResetThresholdTimeEnd;
    sums.y = sums.y * (1000/60) / panResetThresholdTimeEnd;
    sums.x = Math.min(Math.max(sums.x, -maxVelocity), maxVelocity);
    sums.y = Math.min(Math.max(sums.y, -maxVelocity), maxVelocity);
    return sums;
  };


  //private code block ---------------------------------------------------------

  eventProperties = null;
  prevCycleTimeStamp = new Date().getTime();
  panArray = [];


  //public properties and methods ----------------------------------------------

  return {

    startRequestHandler: function(){
      panStatus = "userPanning";
      panArray = [];
      if (eventProperties === null){
        eventProperties = newEventProperties();
        eventDispatcher.broadcast("startNewFrameTogglerEvent", eventProperties);
        eventDispatcher.broadcast("userPanStarted");
      } else {
        eventProperties.userReset = true;
      }
    },

    end: function(){
      eventProperties = null;
    },

    panRequestHandler: function(deltaPx){
      var timeStamp = new Date().getTime();
      panArray.unshift({x:deltaPx.x, y:deltaPx.y, timeStamp:timeStamp});
    },

    endRequestHandler: function(){
      currentStopFrameNum = 0;
      numStopFramesCompleted = 0;
      var stopTime = new Date().getTime();
      endVelocity = getPanSumsEnd(stopTime, stopTime - panResetThresholdTimeEnd);
      if (endVelocity.x == 0 && endVelocity.y == 0){
        panStatus = "ended";
      } else {
        panStatus = "ending";
      }
      if (eventProperties){
        eventProperties.userReset = false;
      }
    },

    newFrame: function(){
      if (panStatus == "userPanning"){
        var timeStamp = new Date().getTime();
        var velocity = getPanSums(timeStamp, prevCycleTimeStamp);
        prevCycleTimeStamp = timeStamp;
        panFunction(1, -1, velocity.x, velocity.y);
        return;
      }
      if (panStatus == "ended"){
        var frameProperties = newFrameProperties("init", 1, 1);
        eventDispatcher.broadcast("createNewFrame", frameProperties);
        panStatus = null;
        return;
      };
      if (panStatus == "ending"){
        currentStopFrameNum++;
        if (currentStopFrameNum < numStopFramesDuration){
          var newVelocityX = endVelocity.x * (1 - currentStopFrameNum / numStopFramesDuration);
          var newVelocityY = endVelocity.y * (1 - currentStopFrameNum / numStopFramesDuration);
          panFunction(currentStopFrameNum, numStopFramesDuration, newVelocityX, newVelocityY);
        } else {
          var frameProperties = newFrameProperties("init", numStopFramesDuration, numStopFramesDuration);
          eventDispatcher.broadcast("createNewFrame", frameProperties);
          panStatus = null;
        }
      };
    },

  };
};
