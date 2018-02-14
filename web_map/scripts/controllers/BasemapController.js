"use strict";


var StartBasemapController = function(eventDispatcher, basemapDisplay){


  NewHttpRequest("../web_map/templates/basemap.html", function(htmlStr){
    eventDispatcher.broadcast("basemapHTMLReceived", htmlStr);
  });

  eventDispatcher.listen("basemapHTMLReceived", function(htmlStr){
    basemapDisplay.load(htmlStr);
  });

  eventDispatcher.listen("basemapReady", function(){
    basemapDisplay.loadTiles();
  });

};
