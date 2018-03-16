"use strict";


var NewFrameTogglerService = function(eventDispatcher){

  //private variables ----------------------------------------------------------

  var togglerState;
  var currentEventProperties;
  var currentFrame;
  var framesList;


  //private functions ----------------------------------------------------------

  var toggleFrames = function(){
    currentFrame.properties.status = "toggling";
    eventDispatcher.broadcast("basemapFrameTogglingRequest", currentFrame.properties.toggleType);
    eventDispatcher.broadcast("graphicsFrameTogglingRequest");
  };

  var drawNewFrame = function(){
    currentEventProperties.status = "waiting";
    currentFrame.properties.status = "drawing";
    eventDispatcher.broadcast("basemapDrawingRequest", currentFrame.tiles);
    eventDispatcher.broadcast("graphicsDrawingRequest", currentFrame.properties);
  };

  var updateStatus = function(){
    if (currentEventProperties.status == "done"){
      if (currentEventProperties.userReset){
        currentEventProperties.status = "readyForNewFrame";
        currentEventProperties.userReset = false;
      }
    }
    if (currentEventProperties.status == "readyForNewFrame"){
      if (framesList.length > 0){
        currentFrame = framesList.pop();
        currentEventProperties.status = "frameReadyToDraw";
      } else {
        eventDispatcher.broadcast("frameTogglerReadyForNewFrame");
      }
    }
  };

  var endEvent = function(){
    eventDispatcher.broadcast(currentEventProperties.callbackMessage, currentEventProperties);
    currentEventProperties = null;
    currentFrame = null;
  };

  var listen = function(){
    if (currentFrame && currentFrame.properties.status == "drawn"){
      toggleFrames();
    }
    updateStatus();
    if (currentEventProperties.status == "frameReadyToDraw"){
      drawNewFrame();
    }
    if (currentEventProperties.status == "done"){
      endEvent();
      togglerState = null;
    } else {
      requestAnimationFrame(function(){
        listen();
      });
    }
  };


  //private code block ---------------------------------------------------------

  togglerState = null;
  framesList = [];


  //public properties and methods ----------------------------------------------

  return {

    startNewEvent: function(eventProperties){
      currentEventProperties = eventProperties;
      currentFrame = null;
      if (togglerState != "listening"){   //don't know if I need this?
        togglerState = "listening";
        requestAnimationFrame(function(){
          listen();
        });
      }
    },

    recordEventImagesLoading: function(){
      currentEventProperties.status = "frameImagesLoading";
    },

    downloadFrames: function(newFramesList){
      framesList = newFramesList;
      currentFrame = framesList.pop();
      currentEventProperties.status = "frameReadyToDraw";
    },

    recordBasemapImagesDrawn: function(){
      currentFrame.properties.status = "drawn";
    },

    recordBasemapFrameTogglingComplete: function(){
      currentFrame.properties.status = "complete";
      if (currentFrame.properties.eventFrameNum == currentFrame.properties.totalEventFrames){
        currentEventProperties.status = "done";
      } else {
        currentEventProperties.status = "readyForNewFrame";
      }
    },

  };

};
