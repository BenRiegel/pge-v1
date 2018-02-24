"use strict";


var StartPopupDisplayController = function(eventDispatcher, popupDisplay){


  NewHttpRequest("../web_map/templates/popup.html", function(htmlStr){
    eventDispatcher.broadcast("popupHTMLReceived", htmlStr);
  });

  eventDispatcher.listen("popupHTMLReceived", function(htmlStr){
    popupDisplay.load(htmlStr);
  });

  /*eventDispatcher.listen("animationMoveStarted", function(){
    popupDisplay.close();
  });*/

  eventDispatcher.listen("userPanStarted", function(){
    popupDisplay.close();
  });

};
