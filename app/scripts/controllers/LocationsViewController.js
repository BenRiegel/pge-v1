"use strict";


var StartLocationsViewController = function(eventDispatcher, webMap, projectsModel, locationsView){


  //run code -------------------------------------------------------------------

  eventDispatcher.listen("graphicsReady", function(){
    var graphicsLayer = webMap.graphicsView.createGraphicsLayer("sites-graphics-layer");
    locationsView.initSitesGraphicsLayer(graphicsLayer);
  });

  eventDispatcher.listen("graphicsLayerInitialized && projectsModelLoaded", function(){
    locationsView.loadProjectsGraphics(projectsModel.list);
  });

  eventDispatcher.listen("initialMenuSelectionMade && newMenuOptionSelected", function(){
    locationsView.sitesGraphicsLayer.show();
  }, true);

  eventDispatcher.listen("newMenuOptionSelected", function(newOptionName){
    locationsView.sitesGraphicsLayer.filter(newOptionName);
  });

};
