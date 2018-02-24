"use strict";


var StartDrawingEventServiceController = function(eventDispatcher, drawingEventService){


  eventDispatcher.listen("basemapTilesLoaded", function(){
    drawingEventService.initViewpointEvent();
  });

  eventDispatcher.listen("basemapImagesLoaded", function(){
    drawingEventService.handleBasemapDrawingComplete();
  });

  eventDispatcher.listen("basemapImagesLoaded && graphicsLayersDrawingCompleted", function(){
    drawingEventService.handleLayersDrawingComplete();
  }, true);

  eventDispatcher.listen("intialBasemapFrameTogglingComplete", function(){
    drawingEventService.handleBasemapFrameTogglingComplete();
  });

  eventDispatcher.listen("basemapFrameTogglingComplete", function(){
    drawingEventService.handleBasemapFrameTogglingComplete();
  });

  eventDispatcher.listen("finalBasemapFrameTogglingComplete", function(){
    drawingEventService.handleBasemapFrameTogglingComplete();
  });

  eventDispatcher.listen("animationMoveRequest", function(animationMoveRequestProperties){
    drawingEventService.animationMoveRequestHandler(animationMoveRequestProperties);
  });

  eventDispatcher.listen("userPanStartRequest", function(){
    drawingEventService.userPanStartRequestHandler();
  });

  eventDispatcher.listen("userPanRequest", function(userPanRequestProperties){
    drawingEventService.userPanRequestHandler(userPanRequestProperties);
  });

  eventDispatcher.listen("userPanEndRequest", function(){
    drawingEventService.userPanEndRequestHandler();
  });

};
