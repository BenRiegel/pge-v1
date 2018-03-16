"use strict";


var StartWebMapStatesController = function(eventDispatcher, webMapStates){

  //helper functions -----------------------------------------------------------

  var calculateMinScaleLevel = function(dimensionsPx){
    var minScaleLevelX = Math.log2(dimensionsPx.width / Esri.basemapTileSizePx);
    minScaleLevelX = Math.ceil(minScaleLevelX);
    var minScaleLevelY = Math.log2(dimensionsPx.height / Esri.basemapTileSizePx);
    minScaleLevelY = Math.ceil(minScaleLevelY);
    return Math.max(minScaleLevelX, minScaleLevelY);
  };

  //----------------------------------------------------------------------------

  eventDispatcher.listen("webMapDimensionsSet", function(dimensionsPx){
    var minScaleLevel = calculateMinScaleLevel(dimensionsPx);
    webMapStates.configure(minScaleLevel, dimensionsPx);
  });

};
