"use strict";


var StartLayerTogglerController = function(eventDispatcher, layerToggler){


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

  eventDispatcher.listen("panStarted", function(){
    layerToggler.start("user");
  });

  eventDispatcher.listen("panEnded", function(){
    layerToggler.stop();
  });

};
