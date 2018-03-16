"use strict";


var NewMapGraphicsModel = function(eventDispatcher){

  //public properties and methods ----------------------------------------------

  return {

    graphicsLayerModels: [],

    addGraphicsLayer: function(graphicsLayer){
      this.graphicsLayerModels.push(graphicsLayer);
    },

    position: function(properties){
      if (properties.type == "pan"){
        this.graphicsLayerModels.forEach(function(graphicsLayer){
          graphicsLayer.positionGraphicsPan(properties);
        });
      } else {
        this.graphicsLayerModels.forEach(function(graphicsLayer){
          graphicsLayer.positionGraphicsDefault(properties.webMapStates);
        });
      }
    },
  }

};
