"use strict";


var NewGraphic = function(geoCoords, id, className){

  //private variables ----------------------------------------------------------

  var nodes;


  //init code ------------------------------------------------------------------

  nodes = [];
  nodes[0] = document.createElement("div");
  nodes[0].dataset.id = id;
  nodes[0].classList.add(className);
  nodes[1] = document.createElement("div");
  nodes[1].dataset.id = id;
  nodes[1].classList.add(className);


  //public attributes and methods ----------------------------------------------

  return {
    nodes: nodes,
    worldCoords: WebMercator.latLonToWebMercator(geoCoords),
    screenCoords: {x:null, y:null},
    hidden: false,
    attributes: null,

    setWidth: function(radius){
      this.nodes[0].style.width = `${radius * 2}px`;
      this.nodes[0].style.height = `${radius * 2}px`;
      this.nodes[1].style.width = `${radius * 2}px`;
      this.nodes[1].style.height = `${radius * 2}px`;
      this.nodes[0].style.lineHeight = `${radius * 2}px`;
      this.nodes[1].style.lineHeight = `${radius * 2}px`;
    },

    removeClassName: function(className){
      this.nodes[0].classList.remove(className);
      this.nodes[1].classList.remove(className);
    },

    addClassName: function(className){
      this.nodes[0].classList.add(className);
      this.nodes[1].classList.add(className);
    },

  };

};
