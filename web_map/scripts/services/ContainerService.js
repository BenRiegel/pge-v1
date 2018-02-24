"use strict";


var NewContainerService = function(eventDispatcher, mapRootNodeId){


  //private variables ----------------------------------------------------------

  var node;


  //private functions ----------------------------------------------------------

  var calculateNodeDimensions = function(node){
    const rect = node.getBoundingClientRect();
    return {width:rect.width, height:rect.height};
  };


  //private code block ---------------------------------------------------------

  node = document.getElementById(mapRootNodeId);


  //public attributes and methods ----------------------------------------------

  return {
    node: node,
    dimensionsPx: calculateNodeDimensions(node),
  };

};
