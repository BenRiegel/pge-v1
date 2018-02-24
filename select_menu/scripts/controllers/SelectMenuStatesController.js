"use strict";


var StartSelectMenuStatesController = function(eventDispatcher, selectMenuStates){


  eventDispatcher.listen("openingStarted", function(){
    selectMenuStates.disable();
  });

  eventDispatcher.listen("openingCompleted", function(){
    selectMenuStates.enable();
  });

  eventDispatcher.listen("closingStarted", function(){
    selectMenuStates.disable();
  });

  eventDispatcher.listen("closingCompleted", function(){
    selectMenuStates.enable();
  });

  eventDispatcher.listen("clickedOption", function(option){
    selectMenuStates.clickedOptionHandler(option);
  });

};
