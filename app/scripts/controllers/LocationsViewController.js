"use strict";


var StartLocationsViewController = function(eventDispatcher, projectsModel, locationsView){

  eventDispatcher.listen("graphicsReady", function(){
    locationsView.initSitesGraphicsLayer();
  });

  eventDispatcher.listen("graphicsLayerInitialized && projectsModelLoaded", function(){
    locationsView.loadProjectsGraphics(projectsModel.list);
  });

  eventDispatcher.listen("pointGraphicsLoaded && initialMenuOptionSelected", function(eventData){
    var newOptionName = eventData["initialMenuOptionSelected"];
    locationsView.sitesGraphicsLayer.filter(newOptionName);
    eventDispatcher.broadcast("addGraphicsLayerRequest", locationsView.sitesGraphicsLayer);
  });

  eventDispatcher.listen("newMenuOptionSelected", function(newOptionName){
    locationsView.sitesGraphicsLayer.filter(newOptionName);
    eventDispatcher.broadcast("graphicsLayerRefreshRequest", locationsView.sitesGraphicsLayer);
  });

  eventDispatcher.listen("zoomToAnimationComplete", function(){
    locationsView.clearPrevClusters();
  });

};
