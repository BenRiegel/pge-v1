"use strict";


var NewContainerDisplay = function(eventDispatcher, mapRootNodeId){

  //private variables ----------------------------------------------------------

  var node;
  var dimensionsPx;


  //private functions ----------------------------------------------------------

  var calculateNodeDimensions = function(node){
    const rect = node.getBoundingClientRect();
    return {width:rect.width, height:rect.height};
  };


  //private code block ---------------------------------------------------------

  node = document.getElementById(mapRootNodeId);
  dimensionsPx = calculateNodeDimensions(node);
  eventDispatcher.broadcast("webMapDimensionsSet", dimensionsPx);


  //public properties and methods ----------------------------------------------

  return {

    node: node,

    dimensionsPx: dimensionsPx,

    loadContent: function(htmlStr, broadcastMessage){
      var tempNode = document.createElement("div");
      tempNode.innerHTML = htmlStr;
      while (tempNode.firstChild) {
        node.appendChild(tempNode.firstChild);
      }
      eventDispatcher.broadcast(broadcastMessage);
    },

    showWorkingCursor: function(){
      node.classList.add("waiting");
    },

    removeWorkingCursor: function(){
      node.classList.remove("waiting");
    },
  };

};
