"use strict";

var StartSelectMenuPublicController = function(eventDispatcher){

  eventDispatcher.private.listen("initialOptionSelected", function(newOption){
    eventDispatcher.public.broadcast("initialMenuOptionSelected", newOption);
  });

  eventDispatcher.private.listen("newOptionSelected && closingCompleted", function(eventData){
    var newOption = eventData["newOptionSelected"];
    eventDispatcher.public.broadcast("newMenuOptionSelected", newOption);
  }, true);

};
