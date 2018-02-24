"use strict";


var StartSelectMenuEventsReceiverController = function(eventDispatcher, selectMenuEventsReceiver){


  eventDispatcher.listen("disable", function(){
    selectMenuEventsReceiver.disable();
  });

  eventDispatcher.listen("enable", function(){
    selectMenuEventsReceiver.enable();
  });

};
