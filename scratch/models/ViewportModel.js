function ViewportModel(){

  //public attributes ----------------------------------------------------------

  //configuration vars
  this.dimensions = {width:null, height:null};
  this.viewportBufferFactor = 1;
  this.initCenter = {x:null, y:null},


  //substantive
  this.center = {x:null, y:null};

  //not sure whether these are substantive or derivative
  this.extent; //map coords, tile coords
  this.bufferedExtent; //map coords, tile coords
}


//------------------------------------------------------------------------------

ViewportModel.prototype = {

  constructor: ViewportModel,

  setDimensions: function(width, height){
    this.dimensions.width = width;
    this.dimensions.height = height;
  },

  setInitCenter: function(lon, lat){
    this.initCenter = WorldModel.calculateWorldCoords({lon:lon, lat:lat});
  },

  setCenter: function(newLocation){
    this.center.x = newLocation.x;
    this.center.y = newLocation.y;
  },


  calculateExtents: function(bufferFactor){

    var heightPx = this.dimensions.height * (bufferFactor + 0.5) - 0.5;
    var widthPx = this.dimensions.width * (bufferFactor + 0.5) - 0.5;

    var extent = {};
    extent.world = {
      top: this.center.y - heightPx * mapProperties.pixelSize ,
      right: this.center.x + widthPx * mapProperties.pixelSize,
      bottom: this.center.y + heightPx * mapProperties.pixelSize,
      left: this.center.x - widthPx * mapProperties.pixelSize,
    };
    extent.world.top = worldModel.rectifyExtentTop(extent.world.top);
    extent.world.bottom = worldModel.rectifyExtentBottom(extent.world.bottom);

    extent.map = {
      top: Math.floor(extent.world.top / worldModel.circumference * mapProperties.numPixels),
      right: Math.floor(extent.world.right / worldModel.circumference * mapProperties.numPixels),
      bottom: Math.floor(extent.world.bottom / worldModel.circumference * mapProperties.numPixels),
      left: Math.floor(extent.world.left / worldModel.circumference * mapProperties.numPixels),
    };

    extent.tile = {
      top: Math.floor(extent.map.top / esriBasemapTileSizePx),
      right: Math.floor(extent.map.right / esriBasemapTileSizePx),
      bottom: Math.floor(extent.map.bottom / esriBasemapTileSizePx),
      left: Math.floor(extent.map.left / esriBasemapTileSizePx),
    }
  },


  calculateViewportExtents: function(){
    var mapProperties = getMapPropertiesRequest.get();
    this.extent = this.calculateExtents(0);
    this.extent.mapSpace = {
      top: this.extent.map.top,
      right: Math.round(mapProperties.numPixels) - this.extent.map.right - 1,
      bottom: Math.round(mapProperties.numPixels) - this.extent.map.bottom - 1,
      left: this.extent.map.left,
    }

    this.bufferedExtent = this.calculateExtents(this.viewportBufferFactor);
    this.buffereExtent.imageBuffer = {
      top: this.extent.map.top - this.buffereExtent.map.top,
      right: this.buffereExtent.map.right -  this.extent.map.right - 1,
      bottom: this.bufferedExtent.map.bottom - this.extent.map.bottom - 1,
      left: this.extent.map.left - this.bufferedExtent.map.left,
    }

  }

};
