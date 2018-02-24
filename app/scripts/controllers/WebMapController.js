"use strict";


var StartWebMapController = function(eventDispatcher, webMap, locationsView, summaryView){

  webMap.addEventListener("graphicsReady", function(){
    eventDispatcher.broadcast("graphicsReady");
  });

  webMap.addEventListener("popupReady", function(){
    eventDispatcher.broadcast("popupReady");
  });

  webMap.addEventListener("panToAnimationComplete", function(){
    eventDispatcher.broadcast("panToAnimationComplete");
  });

  webMap.addEventListener("zoomToAnimationComplete", function(){
    eventDispatcher.broadcast("zoomToAnimationComplete");
  });

  webMap.addEventListener("popupCloseComplete", function(){
    eventDispatcher.broadcast("popupCloseComplete");
  });

  webMap.addEventListener("userPanStarted", function(){
    eventDispatcher.broadcast("userPanStarted");
  });

  webMap.addEventListener("animationMoveStarted", function(){
    eventDispatcher.broadcast("animationMoveStarted");
  });


  //----------------------------------------------------------------------------

  eventDispatcher.listen("pointGraphicsLoaded", function(){
    webMap.graphicsDisplay.addGraphicsLayer(locationsView.sitesGraphicsLayer);
  });

  eventDispatcher.listen("popupReady && popupContentDataReceived", function(eventData){
    var htmlStr = eventData["popupContentDataReceived"];
    webMap.popupDisplay.loadContentHTML(htmlStr);
    eventDispatcher.broadcast("popupContentLoaded");
  });

  eventDispatcher.listen("popupLoaded", function(){
    webMap.popupDisplay.open();
  });

  eventDispatcher.listen("popupReadyToClose", function(){
    webMap.popupDisplay.close();
  });

  eventDispatcher.listen("siteClicked", function(graphic){
    webMap.panTo(graphic.worldCoords);
  });

  eventDispatcher.listen("clusterClicked", function(graphic){
    webMap.zoomTo(graphic.newWorldCoords);
  });

  eventDispatcher.listen("zoomTo", function(){
    webMap.popupDisplay.close();
  });

  eventDispatcher.listen("popupCloseComplete", function(){
    var projectId = locationsView.currentSelectedSiteId;
    if (projectId !== null){
      var graphic = locationsView.sitesGraphicsLayer.graphics[projectId];
      var projectWorldCoords = graphic.worldCoords;
      webMap.zoomTo(projectWorldCoords);
    }
  });

  eventDispatcher.listen("zoomToAnimationComplete", function(){
    var projectId = locationsView.currentSelectedSiteId;
    if (projectId !== null){
      webMap.popupDisplay.open();
    }
  });

};
