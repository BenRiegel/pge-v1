"use strict";


var StartZoomControlsController = function(eventDispatcher, zoomControlsDisplay){


  //init code ------------------------------------------------------------------

  NewHttpRequest("../web_map/templates/zoom_controls.html", function(htmlStr){
    eventDispatcher.broadcast("zoomControlsHTMLReceived", htmlStr);
  });

  eventDispatcher.listen("zoomControlsHTMLReceived", function(htmlStr){
    zoomControlsDisplay.load(htmlStr);
  });

}
