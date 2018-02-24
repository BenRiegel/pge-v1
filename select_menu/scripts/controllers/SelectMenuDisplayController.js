"use strict";


var StartSelectMenuDisplayController = function(eventDispatcher, selectMenuDisplay){


  eventDispatcher.listen("initialOptionSelected", function(option){
    selectMenuDisplay.selectInitialOption(option);
  });

  eventDispatcher.listen("newOptionSelected", function(option){
    selectMenuDisplay.selectNewOption(option);
  });

  eventDispatcher.listen("openRequest", function(){
    selectMenuDisplay.open();
  });

  eventDispatcher.listen("closeRequest", function(){
    selectMenuDisplay.close();
  });

};
