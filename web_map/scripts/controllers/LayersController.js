"use strict";


var StartLayersController = function(eventDispatcher, basemapDisplay, graphicsDisplay){

  eventDispatcher.listen("currentViewpointInitialized", function(newViewpoint){
    eventDispatcher.broadcast("drawingStarted");
    basemapDisplay.draw(newViewpoint);
    graphicsDisplay.draw(newViewpoint);
  });

  eventDispatcher.listen("viewpointPanned", function(panProperties){
    eventDispatcher.broadcast("drawingStarted");
    basemapDisplay.draw(panProperties.newViewpoint);
    graphicsDisplay.pan(panProperties.deltaPx);
  });

  eventDispatcher.listen("viewpointZoomed", function(newViewpoint){
    eventDispatcher.broadcast("drawingStarted");
    basemapDisplay.draw(newViewpoint);
    graphicsDisplay.draw(newViewpoint);
  });


};
