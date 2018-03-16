"use strict";


var StartContainerDisplayController = function(eventDispatcher, container){

  NewHttpRequest("../web_map/templates/basemap.html", function(htmlStr){
    container.loadContent(htmlStr, "basemapFrameworkHtmlLoaded");
  });

  NewHttpRequest("../web_map/templates/graphics.html", function(htmlStr){
    container.loadContent(htmlStr, "graphicsFrameworkHtmlLoaded");
  });

  NewHttpRequest("../web_map/templates/popup.html", function(htmlStr){
    container.loadContent(htmlStr, "popupFrameworkHtmlLoaded");
  });

  NewHttpRequest("../web_map/templates/zoom_controls.html", function(htmlStr){
    container.loadContent(htmlStr, "zoomControlsHtmlLoaded");
  });

  eventDispatcher.listen("animationMoveStarted", function(eventProperties){
    if (eventProperties.type != "pan-to"){
      container.showWorkingCursor();
    }
  });

  eventDispatcher.listen("animationMoveEnded", function(eventProperties){
    if (eventProperties.subType != "pan"){
      container.removeWorkingCursor();
    }
  });

};
