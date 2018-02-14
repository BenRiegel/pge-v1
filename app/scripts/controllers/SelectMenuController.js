"use strict";


var StartSelectMenuController = function(eventDispatcher, selectMenu, tagsView){


  //private, configurable constants --------------------------------------------

  const initialSelectedOptionName = "All Sites";


  //run code -------------------------------------------------------------------

  eventDispatcher.listen("menuOptionsHTMLReady", function(){
    selectMenu.loadContent(tagsView.optionsHTMLStr);
  });

  eventDispatcher.listen("pointGraphicsLoaded", function(){
    selectMenu.selectOption(initialSelectedOptionName);
    eventDispatcher.broadcast("initialMenuSelectionMade");
  });

  selectMenu.addEventListener("newMenuOptionSelected", function(newOptionName){
    eventDispatcher.broadcast("newMenuOptionSelected", newOptionName);
  });

};
