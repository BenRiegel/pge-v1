"use strict";


var StartZoomEventsReceiverController = function(eventDispatcher, zoomEventsReceiver){

  eventDispatcher.listen("zoomElementNodesRecorded", function(zoomControlButtons){
    zoomEventsReceiver.configure(zoomControlButtons);
  });

  eventDispatcher.listen("initialBasemapDisplayEventComplete", function(){
    zoomEventsReceiver.enable();
  });

  eventDispatcher.listen("animationMoveStarted", function(){
    zoomEventsReceiver.disable();
  });

  eventDispatcher.listen("animationMoveEnded", function(){
    zoomEventsReceiver.enable();
  });

  eventDispatcher.listen("userPanStarted", function(){
    zoomEventsReceiver.disable();
  });

  eventDispatcher.listen("userPanEnded", function(){
    zoomEventsReceiver.enable();
  });

};
