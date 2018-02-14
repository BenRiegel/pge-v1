"use strict";


var StartGraphicsController = function(eventDispatcher, graphicsDisplay){


  NewHttpRequest("../web_map/templates/graphics.html", function(htmlStr){
    eventDispatcher.broadcast("graphicsHTMLReceived", htmlStr);
  });

  eventDispatcher.listen("graphicsHTMLReceived", function(htmlStr){
    graphicsDisplay.load(htmlStr);
  });

  eventDispatcher.listen("graphicsLayerRefreshRequest", function(graphicsLayer){
    graphicsDisplay.refreshGraphicsLayer(graphicsLayer);
  });

};
