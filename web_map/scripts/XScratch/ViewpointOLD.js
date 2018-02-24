"use strict";


var NewViewpointService = function(eventDispatcher, webMapStates){


  //private, configurable constants --------------------------------------------

  const zoomInOutScaleIncrement = 1;
  const zoomToScaleIncrement = 2;


  //private variables ----------------------------------------------------------

  var currentViewpoint = {x:null, y:null, z:null};


  //public attributes and methods ----------------------------------------------

  return {

    calculateAnimationViewpointChange: function(eventProperties){
      switch(eventProperties.type){
        case "zoom-in":
          var requestedX = currentViewpoint.x;
          var requestedY = currentViewpoint.y;
          var requestedZ = currentViewpoint.z + zoomInOutScaleIncrement;
          break;
        case "zoom-out":
          var requestedX = currentViewpoint.x;
          var requestedY = currentViewpoint.y;
          var requestedZ = currentViewpoint.z - zoomInOutScaleIncrement;
          break;
        case "zoom-home":
          var requestedX = webMapStates.initViewpoint.x;
          var requestedY = webMapStates.initViewpoint.y;
          var requestedZ = webMapStates.initViewpoint.z;
          break;
        case "zoom-to":
          var requestedX = eventProperties.location.x;
          var requestedY = eventProperties.location.y;
          var requestedZ = currentViewpoint.z + zoomToScaleIncrement;
          break;
        case "pan-to":
          var requestedX = eventProperties.location.x;
          var requestedY = eventProperties.location.y;
          var requestedZ = currentViewpoint.z;
          break;
      }
      var newX = requestedX;
      var newY = requestedY;
      var newZ = Math.min(Math.max(requestedZ, webMapStates.minZoomLevel), webMapStates.maxZoomLevel);

      var deltaX = WebMercator.calculateDeltaX(requestedX, currentViewpoint.x);
      var deltaY = requestedY - currentViewpoint.y;
      var deltaZ = newZ - currentViewpoint.z;

      return {
        init: {x:currentViewpoint.x, y:currentViewpoint.y, z:currentViewpoint.z},
        new: {x:newX, y:newY, z:newZ},
        delta: {x:deltaX, y:deltaY, z:deltaZ},
      };
    },

    updateViewpoint: function(newViewpoint){
      currentViewpoint.x = WebMercator.calculateNewX(newViewpoint.x);
      currentViewpoint.y = WebMercator.calculateNewY(newViewpoint.y);
      currentViewpoint.z = newViewpoint.z;
      eventDispatcher.broadcast("currentViewpointUpdated", currentViewpoint);
    },

    start: function(){
      this.updateViewpoint(webMapStates.initViewpoint);
    },

  };

};
