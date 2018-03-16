"use strict";


var StartMapGraphicsModelController = function(eventDispatcher, mapGraphicsModel, mapGraphicsView, webMapStates){

  eventDispatcher.listen("addGraphicsLayerRequest", function(graphicsLayer){
    mapGraphicsModel.addGraphicsLayer(graphicsLayer.model);
    mapGraphicsView.addGraphicsLayer(graphicsLayer.view);
    graphicsLayer.model.positionGraphicsDefault(webMapStates);
    graphicsLayer.view.draw(graphicsLayer.model.graphicModels);
  });

  eventDispatcher.listen("refreshGraphicsLayerRequest", function(graphicsLayer){
    mapGraphicsModel.positionLayerGraphics(graphicsLayer.model, webMapStates);
    graphicsLayer.view.draw(graphicsLayer.model.graphicModels);
    requestAnimationFrame(function(){
      graphicsLayer.view.toggleFrames();
    });
  });

  eventDispatcher.listen("graphicsDrawingRequest", function(frameProperties){
    mapGraphicsModel.position(frameProperties);
    mapGraphicsView.draw(mapGraphicsModel.graphicsLayerModels);
  });

};
