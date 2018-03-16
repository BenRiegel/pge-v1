"use strict";

var StartPanEventsReceiverController = function(eventDispatcher, panEventsReceiver){

  eventDispatcher.listen("basemapElementNodesRecorded", function(basemapRootNode){
    panEventsReceiver.configure(basemapRootNode);
  });

  eventDispatcher.listen("initialBasemapDisplayEventComplete", function(){
    panEventsReceiver.enable();
  });

  eventDispatcher.listen ("animationMoveStarted", function(){
    panEventsReceiver.disable();
  });

  eventDispatcher.listen("animationMoveEnded", function(){
    panEventsReceiver.enable();
  });

};
