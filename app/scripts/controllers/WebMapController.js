"use strict";


var StartWebMapController = function(eventDispatcher, webMap, locationsView, summaryView){

  webMap.addEventListener("graphicsReady", function(){
    eventDispatcher.broadcast("graphicsReady");
  });

  webMap.addEventListener("popupReady", function(){
    eventDispatcher.broadcast("popupReady");
  });


  //----------------------------------------------------------------------------

  eventDispatcher.listen("pointGraphicsLoaded", function(){
    webMap.graphicsView.addGraphicsLayer(locationsView.sitesGraphicsLayer);
  });

  eventDispatcher.listen("popupReady && popupContentDataReceived", function(eventData){
    var htmlStr = eventData["popupContentDataReceived"];
    webMap.popupView.loadContentHTML(htmlStr);
    eventDispatcher.broadcast("popupContentLoaded");
  });

  eventDispatcher.listen("popupLoaded", function(){
    webMap.popupView.open();
  });

  eventDispatcher.listen("closePopupWindow", function(){
    webMap.popupView.close();
  });


};
