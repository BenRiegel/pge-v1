"use strict";


var NewGraphicsLayer = function(eventDispatcher, layerName){


  //private variables ---------------------------------------------------------

  var layerNode;
  var frameNodes;
  var writeIndex;
  var displayIndex;
  var frameDrawn;
  var hidden;


  //init code ------------------------------------------------------------------

  layerNode = document.createElement("div");
  layerNode.id = layerName;
  frameNodes = [];
  frameNodes[0] = document.createElement("div");
  frameNodes[0].id = `${layerName}-frame-0`;
  frameNodes[0].style.display = "none";
  frameNodes[1] = document.createElement("div");
  frameNodes[1].id = `${layerName}-frame-1`;
  frameNodes[1].style.display = "none";
  layerNode.appendChild(frameNodes[0]);
  layerNode.appendChild(frameNodes[1]);
  displayIndex = 0;
  writeIndex = 1;
  frameNodes[writeIndex].style.display = "none";
  frameDrawn = false;
  hidden = false;


  //public attribute and methods -----------------------------------------------

  return {

    node: layerNode,

    graphics: [],

    toggleFrames: function(){
      frameNodes[displayIndex].style.display = "none";
      frameNodes[writeIndex].style.display = "block";
      displayIndex = 1 - displayIndex;
      writeIndex = 1 - writeIndex;
    },

    addEventListener: function(eventType, listener){
      this.node.addEventListener(eventType, function(evt){
        listener(evt);
      });
    },

    addGraphics: function(graphicsList){
      graphicsList.forEach((graphic) => {
        this.graphics.push(graphic);
        frameNodes[0].appendChild(graphic.nodes[0]);
        frameNodes[1].appendChild(graphic.nodes[1]);
      });
    },

    position: function(pixelProperties, leftMapCoord, topMapCoord){
      this.graphics.forEach(function(graphic){
        var screenCoordX = graphic.worldCoords.x / pixelProperties.size - leftMapCoord;
        screenCoordX = (screenCoordX < 0) ? screenCoordX + pixelProperties.num : screenCoordX;
        var screenCoordY = graphic.worldCoords.y / pixelProperties.size - topMapCoord;
        graphic.screenCoords.x = screenCoordX;
        graphic.screenCoords.y = screenCoordY;
      });
    },

    positionPan: function(pixelProperties, deltaPx){
      this.graphics.forEach(function(graphic){
        var screenCoordX = graphic.screenCoords.x - deltaPx.x;
        screenCoordX = screenCoordX % pixelProperties.num;
        screenCoordX = (screenCoordX < 0) ? screenCoordX + pixelProperties.num : screenCoordX;
        graphic.screenCoords.x = screenCoordX;
        graphic.screenCoords.y -= deltaPx.y;
      });
    },

    draw: function(){
      this.graphics.forEach(function(graphic, i){
        if (graphic.hidden){
          graphic.nodes[writeIndex].style.display = "none";
        } else {
          graphic.nodes[writeIndex].style.transform = `translate(-50%, -50%) translate(${graphic.screenCoords.x}px, ${graphic.screenCoords.y}px)`;
          graphic.nodes[writeIndex].style.display = "block";
        }
      });
    },

    refresh: function(){
      eventDispatcher.broadcast("graphicsLayerRefreshRequest", this)
    },

    hide: function(){
      hidden = true;
      this.node.style.display = "none";   //add css class?
    },

    show: function(){
      hidden = false;
      this.node.style.display = "block";
    }

  };

};
