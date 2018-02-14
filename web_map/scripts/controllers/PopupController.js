"use strict";


var StartPopupController = function(eventDispatcher, popupDisplay){


  //init code ------------------------------------------------------------------

  NewHttpRequest("../web_map/templates/popup.html", function(htmlStr){
    eventDispatcher.broadcast("popupHTMLReceived", htmlStr);
  });

  eventDispatcher.listen("popupHTMLReceived", function(htmlStr){
    popupDisplay.load(htmlStr);
  });

  

}
