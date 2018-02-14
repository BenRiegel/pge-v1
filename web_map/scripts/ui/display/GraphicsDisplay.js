"use strict";


var NewGraphicsDisplay = function(eventDispatcher, webMapStates){


  //private variables ----------------------------------------------------------

  var graphicsLayers;


  //init code -----------------------------------------------------------------

  graphicsLayers = [];


  //public attributes and methods ----------------------------------------------

  return {

    rootNode: null,

    toggleFrames: function(){
      graphicsLayers.forEach(function(graphicsLayer){
        graphicsLayer.toggleFrames();
      });
      eventDispatcher.broadcast("framesToggled");
    },

    addGraphicsLayer: function(graphicsLayer){
      graphicsLayers.push(graphicsLayer);
      this.rootNode.appendChild(graphicsLayer.node);
    },

    createGraphicsLayer: function(layerName){
      return NewGraphicsLayer(eventDispatcher, layerName);
    },

    load: function(htmlStr){
      Utils.loadHTMLContent(webMapStates.rootNode, htmlStr);
      this.rootNode = document.getElementById("graphics-layers-container");
      eventDispatcher.broadcast("graphicsReady");
    },

    draw: function(viewpoint){
      var mapProperties = webMapStates.currentMapProperties;
      var topLeftCoords = webMapStates.topLeftMapCoords;

      graphicsLayers.forEach(function(graphicsLayer){
        graphicsLayer.position(mapProperties, topLeftCoords.left, topLeftCoords.top);
        graphicsLayer.draw();
      });
      eventDispatcher.broadcast("graphicsLayersDrawingCompleted");
    },

    pan: function(deltaPx){
      var mapProperties = webMapStates.currentMapProperties;
      graphicsLayers.forEach(function(graphicsLayer){
        graphicsLayer.positionPan(mapProperties, deltaPx);
        graphicsLayer.draw();
      });
      eventDispatcher.broadcast("graphicsLayersDrawingCompleted");
    },

    refreshGraphicsLayer: function(graphicsLayer){
      var mapProperties = webMapStates.currentMapProperties;
      var topLeftCoords = webMapStates.topLeftMapCoords;
      graphicsLayer.position(mapProperties, topLeftCoords.left, topLeftCoords.top);
      graphicsLayer.draw();
      requestAnimationFrame(function(){
        graphicsLayer.toggleFrames();
      });
    },

  };

};
