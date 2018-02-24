"use strict";

var StartPanEventsReceiverController = function(eventDispatcher, panEventsReceiver){

  eventDispatcher.listen("initBasemapDrawingComplete", function(){
    panEventsReceiver.enable();
  });

  eventDispatcher.listen("animationMoveStarted", function(){
    panEventsReceiver.disable();
  });

  eventDispatcher.listen("animationMoveEnded", function(){
    panEventsReceiver.enable();
  });

};
