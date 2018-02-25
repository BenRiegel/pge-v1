"use strict";


var StartPopupDisplayController = function(eventDispatcher, popupDisplay){


  NewHttpRequest("../web_map/templates/popup.html", function(htmlStr){
    eventDispatcher.broadcast("popupHTMLReceived", htmlStr);
  });

  eventDispatcher.listen("popupHTMLReceived", function(htmlStr){
    popupDisplay.load(htmlStr);
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
    popupDisplay.close();
  });

};
