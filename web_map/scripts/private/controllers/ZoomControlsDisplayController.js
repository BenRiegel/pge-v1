"use strict";


var StartZoomControlsDisplayController = function(eventDispatcher, zoomControlsDisplay){

  eventDispatcher.listen("zoomControlsHtmlLoaded", function(){
    zoomControlsDisplay.recordElementNodes();
  });

};
