"use strict";


var StartZoomControlsDisplayController = function(eventDispatcher, zoomControlsDisplay){


  NewHttpRequest("../web_map/templates/zoom_controls.html", function(htmlStr){
    eventDispatcher.broadcast("zoomControlsHTMLReceived", htmlStr);
  });

  eventDispatcher.listen("zoomControlsHTMLReceived", function(htmlStr){
    zoomControlsDisplay.load(htmlStr);
  });

}
