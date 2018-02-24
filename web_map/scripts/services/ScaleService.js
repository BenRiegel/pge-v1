"use strict";


var NewScaleService = function(eventDispatcher, initLevel, webMapDimensionsPx){


  //private, configurable constants --------------------------------------------

  const zoomInOutLevelIncrement = 1;
  const zoomToLevelIncrement = 2;


  //private variables ----------------------------------------------------------

  var minLevel;
  var maxLevel;


  //private functions ----------------------------------------------------------

  var calculateMinScaleLevel = function(dimensionsPx){
    var minScaleLevelX = Math.log2(dimensionsPx.width / Esri.basemapTileSizePx);
    minScaleLevelX = Math.ceil(minScaleLevelX);
    var minScaleLevelY = Math.log2(dimensionsPx.height / Esri.basemapTileSizePx);
    minScaleLevelY = Math.ceil(minScaleLevelY);
    return Math.max(minScaleLevelX, minScaleLevelY);
  };


  //private code block ---------------------------------------------------------

  minLevel = calculateMinScaleLevel(webMapDimensionsPx);
  maxLevel = Esri.maxScaleLevel;


  //public attributes and methods ----------------------------------------------

  return {

    currentLevel: initLevel,

    calculateAnimationScaleLevelChange: function(eventProperties){
      switch(eventProperties.type){
        case "zoom-in":
          var requestedLevel = this.currentLevel + zoomInOutLevelIncrement;
          break;
        case "zoom-out":
          var requestedLevel = this.currentLevel - zoomInOutLevelIncrement;
          break;
        case "zoom-home":
          var requestedLevel = initLevel;
          break;
        case "zoom-to":
          var requestedLevel = this.currentLevel + zoomToLevelIncrement;
          break;
        case "pan-to":
          var requestedLevel = this.currentLevel;
          break;
      }
      var newLevel = Math.min(Math.max(requestedLevel, minLevel), maxLevel);
      var deltaLevel = newLevel - this.currentLevel;
      return {
        current: this.currentLevel,
        new: newLevel,
        delta: deltaLevel,
      };
    },

    updateLevel: function(newLevel){
      this.currentLevel = newLevel;
    },

  };

};
