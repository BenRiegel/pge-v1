"use strict";


var NewGraphicModel = function(geoCoords){

  //public properties and methods ----------------------------------------------

  return {
    worldCoords: WebMercator.latLonToWebMercator(geoCoords),
    mapCoords: {x:null, y:null},
    screenCoords: {x:null, y:null},
    hidden: false,
    attributes: null,
  };

}
