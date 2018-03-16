"use strict";


var NewGraphicView = function(){

  //private variables ----------------------------------------------------------

  var nodes;


  //private functions ----------------------------------------------------------

  var createNode = function(){
    var node = document.createElement("div");
    node.classList.add("no-highlight");
    return node;
  };

  var setNodeWidthHeight = function(node, radius){
    var str = `${radius * 2}px`;
    node.style.width = str;
    node.style.height = str;
    node.style.lineHeight = str;
  }


  //private code block ---------------------------------------------------------

  nodes = [];
  nodes[0] = createNode();
  nodes[1] = createNode();


  //public properties and methods ----------------------------------------------

  return {

    nodes: nodes,

    draw: function(graphicModel, nodeIndex){
      var graphicNode = this.nodes[nodeIndex];
      if (graphicModel.hidden){
        graphicNode.style.display = "none";
      } else {
        var screenCoordX = graphicModel.screenCoords.x;
        var screenCoordY = graphicModel.screenCoords.y;
        graphicNode.style.display = "block";
        graphicNode.style.transform = `translate(-50%, -50%) translate(${screenCoordX}px, ${screenCoordY}px)`;
      }
    },

    setWidth: function(radius){
      setNodeWidthHeight(this.nodes[0], radius);
      setNodeWidthHeight(this.nodes[1], radius);
    },

    setId: function(id){
      this.nodes[0].dataset.id = id;
      this.nodes[1].dataset.id = id;
    },

    addClass: function(className){
      this.nodes[0].classList.add(className);
      this.nodes[1].classList.add(className);
    },

    removeClass: function(className){
      this.nodes[0].classList.remove(className);
      this.nodes[1].classList.remove(className);
    },

  };

};
