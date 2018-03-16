"use strict";


var NewGraphicsLayerModel = function(layerName){

  //public properties and methods ----------------------------------------------

  return {

    graphicModels: [],

    addGraphicModel: function(graphicModel){
      this.graphicModels.push(graphicModel);
    },

    positionGraphicsDefault: function(webMapStates){
      var mapPixelSize = webMapStates.mapPixelSize;
      var mapPixelNum = webMapStates.mapPixelNum;
      var leftMapCoord = webMapStates.viewpointTopLeftMap.left;
      var topMapCoord = webMapStates.viewpointTopLeftMap.top;
      this.graphicModels.forEach(function(graphicModel){
        var screenCoordX = graphicModel.worldCoords.x / mapPixelSize - leftMapCoord;
        screenCoordX = (screenCoordX < 0) ? screenCoordX + mapPixelNum : screenCoordX;
        screenCoordX = (screenCoordX > mapPixelNum) ? screenCoordX - mapPixelNum : screenCoordX;
        var screenCoordY = graphicModel.worldCoords.y / mapPixelSize - topMapCoord;
        graphicModel.screenCoords.x = screenCoordX;
        graphicModel.screenCoords.y = screenCoordY;
      });
    },

    positionGraphicsPan: function(properties){
      var deltaPx = properties.deltaPx;
      var mapPixelNum = properties.webMapStates.mapPixelNum;
      this.graphicModels.forEach(function(graphicModel){
        var screenCoordX = graphicModel.screenCoords.x - deltaPx.x;
        screenCoordX = (screenCoordX < 0) ? screenCoordX + mapPixelNum : screenCoordX;
        screenCoordX = (screenCoordX > mapPixelNum) ? screenCoordX - mapPixelNum : screenCoordX;
        var screenCoordY = graphicModel.screenCoords.y - deltaPx.y;
        graphicModel.screenCoords.x = screenCoordX;
        graphicModel.screenCoords.y = screenCoordY;
      });
    },

  };

};
