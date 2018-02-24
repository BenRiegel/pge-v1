"use strict";


var NewViewportService = function(webMapDimensionsPx){


  //public attributes and methods ----------------------------------------------

  return {

    getCurrentProperties: function(viewpoint, pixelProperties){
      var centerMapX = viewpoint.x / pixelProperties.size;
      var centerMapY = viewpoint.y / pixelProperties.size;
      var leftMapCoord = (centerMapX - webMapDimensionsPx.width * 0.5);
      var topMapCoord = (centerMapY - webMapDimensionsPx.height * 0.5);
      return {leftMapCoord:leftMapCoord, topMapCoord:topMapCoord};
    },

  };

};
