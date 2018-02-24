"use strict";


var StartLocationsViewController = function(eventDispatcher, webMap, projectsModel, locationsView){

  eventDispatcher.listen("graphicsReady", function(){
    var graphicsLayer = webMap.graphicsDisplay.createGraphicsLayer("sites-graphics-layer");
    locationsView.initSitesGraphicsLayer(graphicsLayer);
  });

  eventDispatcher.listen("graphicsLayerInitialized && projectsModelLoaded", function(){
    locationsView.loadProjectsGraphics(projectsModel.list);
  });

  eventDispatcher.listen("initialMenuOptionSelected", function(newOptionName){
    locationsView.sitesGraphicsLayer.show();
    locationsView.sitesGraphicsLayer.filter(newOptionName);
  }, true);

  eventDispatcher.listen("newMenuOptionSelected", function(newOptionName){
    locationsView.sitesGraphicsLayer.filter(newOptionName);
  });

};
