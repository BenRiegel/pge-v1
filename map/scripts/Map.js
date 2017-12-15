function Map(configProperties){

  //private variables ----------------------------------------------------------

  var eventList = ["pan-start", "pan-end", "zoom-start," "zoom-end"];

  //public attributes ----------------------------------------------------------

  this.hardMinZoomLevel;
  this.hardMaxZoomLevel;
  this.minZoomLevel;
  this.maxZoomLevel;
  this.initZoomLevel;
  this.currentZoomLevel;

  this.viewportDimensionsPx = {width:null, height:null};
  this.initViewportCenter = {x:null, y:null};
  this.currentViewportCenter = {x:null, y:null};

  this.eventDispatcher = new EventDispatcher(eventList);


  //private functions ----------------------------------------------------------

  var calculateViewportDimensions = function(mapNodeId){
    var node = document.getElementById(mapNodeId);
    var rect = node.getBoundingClientRect();
    return {width:rect.width, height:rect.height};
  };


  //init code ------------------------------------------------------------------

  this.viewportDimensionsPx = calculateViewportDimensions(configProperties.mapNodeId);
  this.hardMinZoomLevel = BasemapModel.calculateHardMinZoomLevel(this.viewportDimensionsPx);
  this.hardMaxZoomLevel = BasemapModel.esriMaxZoomLevel;


}



Map.prototype = {

  constructor: Map,

  on: function(eventName, callbackFunction){
    this.eventDispatcher[eventName].attach(callbackFunction);
  }

  setMinZoomLevel: function(zoomLevel){
    this.minZoomLevel = (zoomLevel < this.hardMinZoomLevel)? this.hardMinZoomLevel : zoomLevel;
  }

  setMaxZoomLevel: function(zoomLevel){
    this.maxZoomLevel = (zoomLevel > this.hardMaxZoomLevel)? this.hardMaxZoomLevel : zoomLevel;
  }

  setCurrentZoomLevel: function(zoomLevel){
    this.currentZoomLevel = newZoomLevel;
  }


  addGraphicsLayer: function(){
  },



}
