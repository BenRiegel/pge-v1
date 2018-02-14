"use strict";

var StartPanEventsReceiverController = function(eventDispatcher, panEventsReceiver){

  eventDispatcher.listen("basemapReady", function(){
    panEventsReceiver.enable();
  });

};
