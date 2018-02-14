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


  /*  calculateMapMoveViewpointChange: function(eventProperties){
      switch(eventProperties.type){
        case "zoom-in":
        case "zoom-out":
          var requestedX = this.currentViewpoint.x;
          var requestedY = this.currentViewpoint.y;
          break;
        case "zoom-home":
          var requestedX = webMapStates.initViewpoint.x;
          var requestedY = initViewpoint.y;
          break;
        case "zoom-to":
        case "pan-to":
          var requestedX = eventProperties.location.x;
          var requestedY = eventProperties.location.y;
          break;
      }
      var deltaX = WebMercator.calculateDeltaX(requestedX, this.currentViewpoint.x);
      var deltaY = requestedY - this.currentViewpoint.y;
      return {
        changeViewpoint: (deltaX != 0 || deltaY != 0),
        new: {x:requestedX, y:requestedY},
        delta: {x:deltaX, y:deltaY},
      };
    },

    calculatePanViewpointChange: function(requestedDeltaX, requestedDeltaY){
      var newX = this.currentViewpoint.x + requestedDeltaX;
      var deltaX = requestedDeltaX;
      var newY = WebMercator.calculateNewY(this.currentViewpoint.y + requestedDeltaY);
      var deltaY = newY - this.currentViewpoint.y;
      return{
        changeViewpoint: (deltaX != 0 || deltaY != 0),
        new: {x:newX, y:newY},
        delta: {x:deltaX, y:deltaY},
      }
    },*/

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







//private functions ----------------------------------------------------------


/*  var shiftViewpointX = function(requestedDeltaX){
  currentViewpoint.x = WebMercator.calculateNewX(currentViewpoint.x - requestedDeltaX);
  return requestedDeltaX;
};

var shiftViewpointY = function(requestedDeltaY, trusted){
  if (trusted){
    var newY = currentViewpoint.y - requestedDeltaY;
    var deltaY = requestedDeltaY;
  } else {
    var newY = WebMercator.calculateNewY(currentViewpoint.y - requestedDeltaY);
    var deltaY = newY - currentViewpoint.y;
  }
  currentViewpoint.y = newY;
  return deltaY;
};*/


  /*  panCurrentViewpointWorld: function(requestedDeltaXWorld, requestedDeltaYWorld){
      var xShift = shiftViewpointX(requestedDeltaXWorld);
      var yShift = shiftViewpointY(requestedDeltaYWorld, true);
      if (xShift != 0 || yShift != 0){
        var mapProperties = MapModel.getMapProperties(currentViewpoint.z);
        var deltaXPx = Math.round(requestedDeltaXWorld / mapProperties.pixelSize);
        var deltaYPx =  Math.round(yShift/ mapProperties.pixelSize);
        var panProperties = {
          newViewpoint: currentViewpoint,
          deltaPx: {x:deltaXPx, y:deltaYPx},
        };
        eventDispatcher.private.broadcast("viewpointPanned", panProperties);
      }
    },

    panCurrentViewpointPx: function(requestedDeltaXPx, requestedDeltaYPx){
      var mapProperties = MapModel.getMapProperties(currentViewpoint.z);
      var requestedDeltaXWorld = requestedDeltaXPx * mapProperties.pixelSize;
      var requestedDeltaYWorld = requestedDeltaYPx * mapProperties.pixelSize;
      var xShift = shiftViewpointX(requestedDeltaXWorld);
      var yShift = shiftViewpointY(requestedDeltaYWorld, false);
      var deltaYPx = Math.round(yShift / mapProperties.pixelSize);
      var panProperties = {
        newViewpoint: currentViewpoint,
        deltaPx: {x:requestedDeltaXPx, y:deltaYPx},
      };
      eventDispatcher.private.broadcast("viewpointPanned", panProperties);
    },

    zoomCurrentViewpoint: function(deltaXWorld, deltaYWorld, deltaZ){
      var xShift = shiftViewpointX(deltaXWorld);
      var yShift = shiftViewpointY(deltaYWorld, true);
      shiftViewpointZ(deltaZ);
      var zoomProperties = {
        newViewpoint: currentViewpoint,
        xyShift: (xShift != 0 || yShift != 0),
      };
      eventDispatcher.private.broadcast("viewpointZoomed", zoomProperties);
    },*/
