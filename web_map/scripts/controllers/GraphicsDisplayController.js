"use strict";


var StartGraphicsDisplayController = function(eventDispatcher, graphicsDisplay){


  NewHttpRequest("../web_map/templates/graphics.html", function(htmlStr){
    eventDispatcher.broadcast("graphicsHTMLReceived", htmlStr);
  });

  eventDispatcher.listen("graphicsHTMLReceived", function(htmlStr){
    graphicsDisplay.load(htmlStr);
  });

  eventDispatcher.listen("graphicsLayerRefreshRequest", function(graphicsLayer){
    graphicsDisplay.refreshGraphicsLayer(graphicsLayer);
  });

  eventDispatcher.listen("startGraphicsDrawingPan", function(currentDrawingProperties){
    graphicsDisplay.drawPan(currentDrawingProperties);
  });

  eventDispatcher.listen("startGraphicsDrawingZoom", function(currentDrawingProperties){
    graphicsDisplay.drawZoom(currentDrawingProperties);
  });

  eventDispatcher.listen("graphicsToggleFramesRequest", function(){
    graphicsDisplay.toggleFrames();
  });

};
