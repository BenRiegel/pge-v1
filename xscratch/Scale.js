"use strict";


var NewScaleService = function(eventDispatcher, initScaleLevel, minScaleLevel, maxScaleLevel){


  //private, configurable constants --------------------------------------------

  const zoomInOutScaleIncrement = 1;
  const zoomToScaleIncrement = 2;


  //public attributes and methods ----------------------------------------------

  return {

    currentScaleLevel: null,

    calculateMapMoveScaleChange: function(eventProperties){
      switch(eventProperties.type){
        case "zoom-in":
          var requestedScaleLevel = this.currentScaleLevel + zoomInOutScaleIncrement;
          break;
        case "zoom-out":
          var requestedScaleLevel = this.currentScaleLevel - zoomInOutScaleIncrement;
          break;
        case "zoom-home":
          var requestedScaleLevel = initScaleLevel;
          break;
        case "zoom-to":
          var requestedScaleLevel = this.currentScaleLevel + zoomToScaleIncrement
          break;
        case "pan-to":
          var requestedScaleLevel = this.currentScaleLevel;
          break;
      }
      var newScaleLevel = Math.min(Math.max(requestedScaleLevel, minScaleLevel), maxScaleLevel);
      var deltaScaleLevel = newScaleLevel - this.currentScaleLevel;
      return {
        changeScaleLevel: (deltaScaleLevel != 0),
        new: newScaleLevel,
        delta: deltaScaleLevel,
      };
    },

    updateScaleLevel: function(newScaleLevel){
      this.currentScaleLevel = newScaleLevel;
    },

    start: function(){
      this.updateScaleLevel(initScaleLevel);
      eventDispatcher.broadcast("currentScaleLevelInitialized", this.currentScaleLevel);
    },
  };

};
