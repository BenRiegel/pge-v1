var WebMercator = (function(){


  //private, non-configurable constants ----------------------------------------
  //see https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/

  const extent = {
    min: -2.0037507067161843E7,
    max: 2.0037507067161843E7,
  };


  //private functions ----------------------------------------------------------

  var normalizeWorldCoords = function(x, y){
    return {
      x: x - extent.min,
      y: extent.max - y
    };
  };


  //public attributes and methods ----------------------------------------------

  return {

    circumference: extent.max - extent.min,

    latLonToWebMercator: function(geoCoords){
      var x = geoCoords.lon * 20037508.34 / 180;
      var y = Math.log(Math.tan((90 + geoCoords.lat) * Math.PI / 360)) / (Math.PI) * 20037508.34;
      return normalizeWorldCoords(x, y);
    },

    calculateNewX: function(x){
      newX = x % this.circumference;
      return (newX < 0) ? (newX + this.circumference): newX;
    },

    calculateDeltaX: function(x2, x1){
      var halfCircumference = this.circumference / 2;
      var deltaX = x2 - x1;
      deltaX = (deltaX < -halfCircumference)? (deltaX + this.circumference) : deltaX;
      return (deltaX > halfCircumference)? (deltaX - this.circumference) : deltaX;
    },

    calculateNewY: function(y){
      return Math.min(Math.max(y, 0), this.circumference);
    },

  };

})();
