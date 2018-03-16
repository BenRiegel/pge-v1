"use strict";


var NewGraphicsLayerView = function(layerName){


  //private variables ----------------------------------------------------------

  var frameNodes;
  var layerNode;
  var displayIndex;
  var writeIndex;


  //private functions ----------------------------------------------------------

  var createNewFrameNode = function(num){
    var node = document.createElement("div");
    node.id = `${layerName}-frame-${num}`;
    return node;
  }


  //private code block ---------------------------------------------------------

  frameNodes = [];
  frameNodes[0] = createNewFrameNode(0);
  frameNodes[1] = createNewFrameNode(1);

  layerNode = document.createElement("div");
  layerNode.id = layerName;
  layerNode.appendChild(frameNodes[0]);
  layerNode.appendChild(frameNodes[1]);

  displayIndex = 0;
  writeIndex = 1;
  frameNodes[writeIndex].style.opacity = "0";
  frameNodes[displayIndex].style.opacity = "0";


  //public properties and methods ----------------------------------------------

  return {

    node: layerNode,

    graphicViews: [],

    toggleFrames: function(){
      frameNodes[displayIndex].style.opacity = "0";
      frameNodes[writeIndex].style.opacity = "1";
      displayIndex = 1 - displayIndex;
      writeIndex = 1 - writeIndex;
    },

    addEventListener: function(eventType, listener){
      this.node.addEventListener(eventType, function(evt){
        listener(evt);
      });
    },

    addGraphicView: function(graphicView){
      this.graphicViews.push(graphicView);
      frameNodes[0].appendChild(graphicView.nodes[0]);
      frameNodes[1].appendChild(graphicView.nodes[1]);
    },

    draw: function(graphicModels){
      for (var i = 0; i < graphicModels.length; i++){
        var graphicModel = graphicModels[i];
        var graphicView = this.graphicViews[i];
        graphicView.draw(graphicModel, writeIndex);
      }
    },

    hide: function(){
      this.node.style.opacity = "0";   //add css class?
    },

    show: function(){
      this.node.style.opacity = "1";
    },

  };

};
