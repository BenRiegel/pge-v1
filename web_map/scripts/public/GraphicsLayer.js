"use strict";


//change this to a constructor

var NewGraphicsLayer = function(layerName){


  //public attributes and methods ----------------------------------------------

  return {

    graphics: [],

    model: NewGraphicsLayerModel(layerName),

    view: NewGraphicsLayerView(layerName),

    addEventListener: function(eventType, listener){
      this.view.addEventListener(eventType, listener);
    },

    addGraphics: function(graphicsList){
      graphicsList.forEach( (graphic) => {
        this.graphics.push(graphic);
        this.model.addGraphicModel(graphic.model);
        this.view.addGraphicView(graphic.view);
      });
    },

    hide: function(){
      this.view.hide();
    },

    show: function(){
      this.view.show();
    },

  };
}


/*  position: function(mapPixelSize, mapPixelNum, leftMapCoord, topMapCoord){
    this.graphics.forEach(function(graphic){
      var screenCoordX = graphic.worldCoords.x / mapPixelSize - leftMapCoord;
      screenCoordX = (screenCoordX < 0) ? screenCoordX + mapPixelNum : screenCoordX;
      var screenCoordY = graphic.worldCoords.y / mapPixelSize - topMapCoord;
      graphic.screenCoords.x = screenCoordX;
      graphic.screenCoords.y = screenCoordY;
    });
  },

  positionPan: function(mapPixelNum, deltaPx){
    this.graphics.forEach(function(graphic){
      var screenCoordX = graphic.screenCoords.x - deltaPx.x;
      screenCoordX = screenCoordX % mapPixelNum;
      screenCoordX = (screenCoordX < 0) ? screenCoordX + mapPixelNum : screenCoordX;
      graphic.screenCoords.x = screenCoordX;
      graphic.screenCoords.y -= deltaPx.y;
    });
  },*/

  /*  refresh: function(){
      eventDispatcher.broadcast("graphicsLayerRefreshRequest", this)
    },*/

    /*      graphicsModels.forEach( (graphicModel, i) => {
            var graphicsView = this.graphicNodes[writeIndex][i];

            if (graphic.hidden){
              graphicNode.style.opacity = "0";
            } else {
              var screenCoordX = graphic.screenCoords.x;
              var screenCoordY = graphic.screenCoords.y;
              graphicNode.style.opacity = "1";
              graphicNode.style.transform = `translate(-50%, -50%) translate(${screenCoordX}px, ${screenCoordY}px)`;
            }
          });*/
