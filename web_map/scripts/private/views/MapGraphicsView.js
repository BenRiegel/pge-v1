"use strict";


var NewMapGraphicsView = function(eventDispatcher){


  //private variables ----------------------------------------------------------

  var graphicsLayerViews;


  //private code block ---------------------------------------------------------

  graphicsLayerViews = [];


  //public properties and methods ----------------------------------------------

  return {

    rootNode: null,

    toggleFrames: function(){
      graphicsLayerViews.forEach(function(graphicsLayerView){
        graphicsLayerView.toggleFrames();
      });
    },

    addGraphicsLayer: function(graphicsLayerView){
      graphicsLayerViews.push(graphicsLayerView);
      this.rootNode.appendChild(graphicsLayerView.node);
    },

    recordElementNodes: function(){
      this.rootNode = document.getElementById("graphics-layers-container");
      eventDispatcher.broadcast("graphicsFrameworkReady");
    },

    draw: function(graphicsLayerModels){
      for (var i = 0; i < graphicsLayerViews.length; i++){
        var graphicsLayerModel = graphicsLayerModels[i];
        var graphicsLayerView = graphicsLayerViews[i];
        graphicsLayerView.draw(graphicsLayerModel.graphicModels);
      }
    },

  };

};
