"use strict";


var NewGraphicsDisplay = function(eventDispatcher, webMapRootNode, viewpoint, scale, pixel, viewport){


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
    },

    addGraphicsLayer: function(graphicsLayer){
      graphicsLayers.push(graphicsLayer);
      this.rootNode.appendChild(graphicsLayer.node);
    },

    createGraphicsLayer: function(layerName){
      return NewGraphicsLayer(eventDispatcher, layerName);
    },

    load: function(htmlStr){
      Utils.loadHTMLContent(webMapRootNode, htmlStr);
      this.rootNode = document.getElementById("graphics-layers-container");
      eventDispatcher.broadcast("graphicsReady");
    },

    drawZoom: function(currentDrawingProperties){
      var currentPixelProperties = pixel.getCurrentProperties(scale.currentLevel);
      var viewportProperties = viewport.getCurrentProperties(viewpoint.currentCoords, currentPixelProperties);
      graphicsLayers.forEach(function(graphicsLayer){
        graphicsLayer.position(currentPixelProperties, viewportProperties.leftMapCoord, viewportProperties.topMapCoord);
        graphicsLayer.draw();
      });
      eventDispatcher.broadcast("graphicsLayersDrawingCompleted");
    },

    drawPan: function(currentDrawingProperties){
      var deltaPx = currentDrawingProperties.deltaPx;
      var currentPixelProperties = pixel.getCurrentProperties(scale.currentLevel);
      graphicsLayers.forEach(function(graphicsLayer){
        graphicsLayer.positionPan(currentPixelProperties, deltaPx);
        graphicsLayer.draw();
      });
      eventDispatcher.broadcast("graphicsLayersDrawingCompleted");
    },

    refreshGraphicsLayer: function(graphicsLayer){
      var currentPixelProperties = pixel.getCurrentProperties(scale.currentLevel);
      var viewportProperties = viewport.getCurrentProperties(viewpoint.currentCoords, currentPixelProperties);
      graphicsLayer.position(currentPixelProperties, viewportProperties.leftMapCoord, viewportProperties.topMapCoord);
      graphicsLayer.draw();
      requestAnimationFrame(function(){
        graphicsLayer.toggleFrames();
      });
    },

  };

};
