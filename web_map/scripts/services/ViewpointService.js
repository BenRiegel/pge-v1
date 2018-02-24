"use strict";


var NewViewpointService = function(eventDispatcher, initViewpointLatLon){


  //private non-configurable constants -----------------------------------------

  const initCoords = WebMercator.latLonToWebMercator(initViewpointLatLon);


  //public attributes and methods ----------------------------------------------

  return {

    currentCoords: {x:initCoords.x, y:initCoords.y},

    calculateAnimationViewpointChange: function(eventProperties){
      switch(eventProperties.type){
        case "zoom-in":
        case "zoom-out":
          var requestedX = this.currentCoords.x;
          var requestedY = this.currentCoords.y;
          break;
        case "zoom-home":
          var requestedX = initCoords.x;
          var requestedY = initCoords.y;
          break;
        case "zoom-to":
        case "pan-to":
          var requestedX = eventProperties.location.x;
          var requestedY = eventProperties.location.y;
          break;
      }
      var deltaX = WebMercator.calculateDeltaX(requestedX, this.currentCoords.x);
      var deltaY = requestedY - this.currentCoords.y;
      return {
        current: {x:this.currentCoords.x, y:this.currentCoords.y},
        new: {x:requestedX, y:requestedY},
        delta: {x:deltaX, y:deltaY},
      };
    },

    calculatePanViewpointChange: function(deltaX, deltaY){
      var newX = WebMercator.calculateNewX(this.currentCoords.x + deltaX);
      var newY = WebMercator.calculateNewY(this.currentCoords.y + deltaY);
      var resultDeltaY = newY - this.currentCoords.y;
      return {
        current: {x:this.currentCoords.x, y:this.currentCoords.y},
        new: {x:newX, y:newY},
        delta: {x:deltaX, y:resultDeltaY},
      };
    },

    updateViewpoint: function(newCoords){
      this.currentCoords.x = WebMercator.calculateNewX(newCoords.x);
      this.currentCoords.y = WebMercator.calculateNewY(newCoords.y);
    },

  };

};
