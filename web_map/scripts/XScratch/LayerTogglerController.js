"use strict";


var StartLayerTogglerController = function(eventDispatcher, layerToggler){


  //this needs to be changed
  eventDispatcher.listen("basemapImagesLoaded && graphicsLayersDrawingCompleted", function(){
    layerToggler.notifyDrawingCompleted();
  }, true);

  eventDispatcher.listen("drawingStarted", function(){
    layerToggler.notifyDrawingStarted();
  });

  eventDispatcher.listen("mapMoveAnimationStarted", function(){
    layerToggler.start("animator");
  });

  eventDispatcher.listen("mapMoveAnimationEnded", function(){
    layerToggler.stop();
  });

  eventDispatcher.listen("panAnimationStarted", function(){
    layerToggler.start("user");
  });

  eventDispatcher.listen("panAnimationEnded", function(){
    layerToggler.stop();
  });

};
