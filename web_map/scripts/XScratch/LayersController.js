"use strict";


var StartLayersController = function(eventDispatcher, basemapDisplay, graphicsDisplay){


  eventDispatcher.listen("currentViewpointInitialized", function(newViewpoint){
    eventDispatcher.broadcast("initialViewpointDrawingStarted");
    basemapDisplay.drawInitial(newViewpoint);
  });

  eventDispatcher.listen("initialViewpointDrawingStarted && basemapImagesLoaded", function(newViewpoint){
  //   basemapDisplay.toggleFramesInitial();
    basemapDisplay.toggleFrames();
  }, true);


  eventDispatcher.listen("mapMoveAnimationStarted && finalAnimationFrameToggled", function(eventData){
    basemapDisplay.drawMoveFinal();
    eventDispatcher.broadcast("finalZoomFrameDrawingStarted");
//    console.log("drawing final map frame");
  }, true);

  eventDispatcher.listen("finalZoomFrameDrawingStarted && basemapImagesLoaded", function(newViewpoint){
  //  basemapDisplay.toggleFramesZoom();
//    console.log("this should fire");
    basemapDisplay.toggleFrames();
  }, true);

  eventDispatcher.listen("panAnimationStarted && finalAnimationFrameToggled", function(eventData){
    basemapDisplay.drawMoveFinal();
    eventDispatcher.broadcast("finalPanFrameDrawingStarted");
  }, true);

  eventDispatcher.listen("finalPanFrameDrawingStarted && basemapImagesLoaded", function(newViewpoint){
    basemapDisplay.toggleFrames();
//    console.log("hereasdf")
  }, true);







  eventDispatcher.listen("viewpointPanned", function(deltaPx){
    eventDispatcher.broadcast("drawingStarted");
    basemapDisplay.drawPan(deltaPx);
    graphicsDisplay.pan(deltaPx);
  });

  eventDispatcher.listen("viewpointZoomed", function(newViewpoint){
    eventDispatcher.broadcast("drawingStarted");
    basemapDisplay.drawZoom(newViewpoint);
    graphicsDisplay.draw(newViewpoint);
  });



};
