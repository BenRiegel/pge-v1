"use strict";


var StartStatesController = function(eventDispatcher, statesService){


  eventDispatcher.listen("currentViewpointUpdated", function(newViewpoint){
    statesService.updateViewpoint(newViewpoint);
  });

};
