"use strict";


var StartBasemapDisplayController = function(eventDispatcher, basemapDisplay){


  NewHttpRequest("../web_map/templates/basemap.html", function(htmlStr){
    eventDispatcher.broadcast("basemapHTMLReceived", htmlStr);
  });

  eventDispatcher.listen("basemapHTMLReceived", function(htmlStr){
    basemapDisplay.load(htmlStr);
  });

  eventDispatcher.listen("basemapReady", function(){
    basemapDisplay.loadTiles();
  });

  eventDispatcher.listen("startBasemapDrawingInitial", function(currentDrawingProperties){
    basemapDisplay.drawInitial(currentDrawingProperties);
  });

  eventDispatcher.listen("startBasemapDrawingPan", function(currentDrawingProperties){
    basemapDisplay.drawPan(currentDrawingProperties);
  });

  eventDispatcher.listen("startBasemapDrawingZoom", function(currentDrawingProperties){
    basemapDisplay.drawZoom(currentDrawingProperties);
  });

  eventDispatcher.listen("startBasemapDrawingFinal", function(currentDrawingProperties){
    basemapDisplay.drawInitial(currentDrawingProperties);
  });

  eventDispatcher.listen("basemapToggleFramesRequestInitial", function(){
    basemapDisplay.toggleFramesInitial();
  });

  eventDispatcher.listen("basemapToggleFramesRequest", function(){
    basemapDisplay.toggleFrames();
  });

  eventDispatcher.listen("basemapToggleFramesRequestFinalZoom", function(){
    basemapDisplay.toggleFramesFinalZoom();
  });

};
