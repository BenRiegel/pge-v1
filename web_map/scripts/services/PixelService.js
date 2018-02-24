"use strict";


var NewPixelService = function(){

  //private non-configurable constants -----------------------------------------
  //see https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/

  const maxScale = 5.91657527591555E8,
        log2MaxScale = Math.log2(maxScale),
        pixelsPerMeter = 3779.52;


  //public attributes and methods ----------------------------------------------

  return {

    getCurrentProperties: function(scaleLevel){
      var mapScale = Math.pow(2, log2MaxScale - scaleLevel);
      var pixelSize = mapScale / pixelsPerMeter;
      var pixelNum = Math.round(WebMercator.circumference / pixelSize);
      return {size:pixelSize, num:pixelNum}
    },

  };

};
