
function ZoomModel() {

  //public attributes ----------------------------------------------------------

  //config
  this.initScaleLevel,
  this.minScaleLevel,
  this.maxScaleLevel = esriMaxScaleLevel;

  //substantive
  this.scaleLevel,

  //derivative
//  this.pixelSize,
//  this.numPixels,
//  this.numTiles;
}


//------------------------------------------------------------------------------

MapModel.prototype = {

  constructor: MapModel,

  setInitScaleLevel: function(scaleLevel){
    this.initScaleLevel = scaleLevel;
    if (this.initScaleLevel < this.minScaleLevel){
      this.initScaleLevel = this.minScaleLevel;
    }
  },

  setMaxScaleLevel: function(scaleLevel){
    this.maxScaleLevel = scaleLevel;
    if (this.maxScaleLevel > esriMaxScaleLevel){
      this.maxScaleLevel = esriMaxScaleLevel;
    }
  },

  calculateMinScaleLevel: function(mapDimensions){
    var minScaleLevelX = Math.log2(mapDimensions.width) - 8;
    minScaleLevelX = (minScaleLevelX % 1 > 0)? minScaleLevelX + 1 : minScaleLevelX;
    minScaleLevelX = Math.trunc(minScaleLevelX);
    var minScaleLevelY = Math.log2(mapDimensions.height) - 8;
    minScaleLevelY = (minScaleLevelY % 1 > 0)? minScaleLevelY + 1 : minScaleLevelY;
    minScaleLevelY = Math.trunc(minScaleLevelY);
    this.minScaleLevel = Math.max(minScaleLevelX, minScaleLevelY);
  },

  setScaleLevel: function(newScaleLevel){
    this.scaleLevel = newScaleLevel;

    var mapScale = Math.pow(2, log2MaxScale - newScaleLevel);
    this.pixelSize = mapScale / pixelsPerMeter;
    this.numPixels = WorldModel.circumference / this.pixelSize;
    this.numTiles = Math.round(this.numPixels / esriBasemapTileSizePx);
  }

};
