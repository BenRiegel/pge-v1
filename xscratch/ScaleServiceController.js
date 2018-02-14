"use strict";


var StartScaleServiceController = function(eventDispatcher, scaleService){


  eventDispatcher.listen("basemapTilesLoaded && graphicsReady", function(){
    scaleService.start();
  });

};
