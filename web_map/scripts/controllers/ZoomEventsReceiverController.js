"use strict";

var StartZoomEventsReceiverController = function(eventDispatcher, zoomEventsReceiver){

  eventDispatcher.listen("zoomControlsLoaded", function(){
    zoomEventsReceiver.enable();
  });

  eventDispatcher.listen("zoomAnimationStarted", function(){
    zoomEventsReceiver.disable();
  });

  eventDispatcher.listen("zoomAnimationEnded", function(){
    zoomEventsReceiver.enable();
  });

};
