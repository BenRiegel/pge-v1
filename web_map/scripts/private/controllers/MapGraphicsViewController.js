"use strict";


var StartMapGraphicsViewController = function(eventDispatcher, mapGraphicsView){

  eventDispatcher.listen("graphicsFrameworkHtmlLoaded", function(){
    mapGraphicsView.recordElementNodes();
  });

  eventDispatcher.listen("graphicsFrameTogglingRequest", function(){
    mapGraphicsView.toggleFrames();
  });

};
