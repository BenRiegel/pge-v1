"use strict";


var StartPopupDisplayController = function(eventDispatcher, popupDisplay){

  eventDispatcher.listen("popupFrameworkHtmlLoaded", function(){
    popupDisplay.readyFramework();
  });

  eventDispatcher.listen("webMapDimensionsSet", function(dimensionsPx){
    popupDisplay.configure(dimensionsPx);
  });

  eventDispatcher.listen("animationMoveRequest && animationMoveStarted", function(eventData){
    var moveType = eventData["animationMoveRequest"].type;
    if (moveType != "pan-to"){
      popupDisplay.hide();
    } else {
      if (popupDisplay.isOpen){
        popupDisplay.hide();
      }
    }
  }, true);

  eventDispatcher.listen("userPanStarted", function(){
    popupDisplay.hide();
  });

};
