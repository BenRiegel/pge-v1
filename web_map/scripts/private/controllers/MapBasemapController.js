"use strict";


var StartMapBasemapController = function(eventDispatcher, mapBasemapModel, mapBasemapView, webMapStates, containerDisplay){

  //helper functions -----------------------------------------------------------

  var calculateTilesNeeded = function(dimensionPx){
    var baseTilesNeeded = Math.trunc(dimensionPx / (Esri.basemapTileSizePx / 2));
    var remainder = dimensionPx % (Esri.basemapTileSizePx / 2);
    return (remainder > 1) ? baseTilesNeeded + 2 : baseTilesNeeded + 1;
  };

  var calculateNumTiles = function(webMapDimensionsPx){
    var numTilesWidth = calculateTilesNeeded(webMapDimensionsPx.width);
    var numTilesHeight = calculateTilesNeeded(webMapDimensionsPx.height);
    return {
      width: numTilesWidth,
      height: numTilesHeight,
      total: numTilesHeight * numTilesWidth,
    };
  };

  //----------------------------------------------------------------------------

  eventDispatcher.listen("webMapDimensionsSet", function(dimensionsPx){
    var numTiles = calculateNumTiles(dimensionsPx);
    eventDispatcher.broadcast("numTilesCalculated", numTiles);
  });

  //----------------------------------------------------------------------------

  eventDispatcher.listen("numTilesCalculated", function(numTiles){
    mapBasemapModel.configure(numTiles);
  });

  eventDispatcher.listen("createNewFrame", function(frameProperties){
    mapBasemapModel.createNewFrame(frameProperties, webMapStates, containerDisplay.dimensionsPx);
  });

  //----------------------------------------------------------------------------

  eventDispatcher.listen("basemapFrameworkHtmlLoaded", function(){
    mapBasemapView.recordElementNodes();
  });

  eventDispatcher.listen("basemapElementNodesRecorded && numTilesCalculated", function(eventData){
    var numTiles = eventData["numTilesCalculated"];
    mapBasemapView.loadFrames(numTiles.total);
  });

  eventDispatcher.listen("basemapFramesLoaded", function(){
    mapBasemapView.startBasemapDisplayEvent();
  });

  eventDispatcher.listen("basemapDrawingRequest", function(frameTiles){
    mapBasemapView.draw(frameTiles);
  });

  eventDispatcher.listen("basemapFrameTogglingRequest", function(toggleType){
    mapBasemapView.toggleFrames(toggleType);
  });

};
