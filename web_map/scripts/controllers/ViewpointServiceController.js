"use strict";


var StartViewpointServiceController = function(eventDispatcher, viewpointService){


  eventDispatcher.listen("basemapTilesLoaded && graphicsReady", function(){
    viewpointService.start();
  });


};
