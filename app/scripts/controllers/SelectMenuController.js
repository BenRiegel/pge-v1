"use strict";


var StartSelectMenuController = function(eventDispatcher, selectMenu, tagsView){


  //private, configurable constants --------------------------------------------

  const initialSelectedOptionName = "All Sites";


  //repeaters ------------------------------------------------------------------

  selectMenu.addEventListener("initialMenuOptionSelected", function(newOptionName){
    eventDispatcher.broadcast("initialMenuOptionSelected", newOptionName);
  });

  selectMenu.addEventListener("newMenuOptionSelected", function(newOptionName){
    eventDispatcher.broadcast("newMenuOptionSelected", newOptionName);
  });


  //select menu event listeners ------------------------------------------------

  eventDispatcher.listen("menuOptionsHTMLReady", function(){
    selectMenu.loadOptions(tagsView.optionsHTMLStr);
  });

  eventDispatcher.listen("pointGraphicsLoaded", function(){
    selectMenu.selectOption(initialSelectedOptionName);
  });

  eventDispatcher.listen("userPanStarted", function(){
    selectMenu.close();
  });

  eventDispatcher.listen("animationMoveStarted", function(){
    selectMenu.close();
  });

};
