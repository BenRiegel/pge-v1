var NewStatesService = function(eventDispatcher, configProperties){


  var rootNode;
  var webMapDimensionsPx;
  var currentMapProperties;


  //private functions ----------------------------------------------------------

  var calculateNodeDimensions = function(node){
    const rect = node.getBoundingClientRect();
    return {width:rect.width, height:rect.height};
  };

  var calculateMinZoomLevel = function(dimensionsPx){
    var minZoomLevelX = Math.log2(dimensionsPx.width / Esri.basemapTileSizePx);
    minZoomLevelX = Math.ceil(minZoomLevelX);
    var minZoomLevelY = Math.log2(dimensionsPx.height / Esri.basemapTileSizePx);
    minZoomLevelY = Math.ceil(minZoomLevelY);
    return Math.max(minZoomLevelX, minZoomLevelY);
  };

  var calculateTopLeftMapCoords = function(currentViewpoint, currentMapProperties){
    var centerMapX = currentViewpoint.x / currentMapProperties.pixelSize;
    var centerMapY = currentViewpoint.y / currentMapProperties.pixelSize;
    leftMapCoord = Math.floor(centerMapX - webMapDimensionsPx.width * 0.5 - 0.5);
    topMapCoord =  Math.floor(centerMapY - webMapDimensionsPx.height * 0.5 - 0.5);
    if (leftMapCoord < 0){
      leftMapCoord += currentMapProperties.numPixels;
    }
    return {left:leftMapCoord, top:topMapCoord};
  };

  var calculatedDeltas = function(viewpoint2, viewpoint1){
    return {
      x: viewpoint2.x - viewpoint1.x,
      y: viewpoint2.y - viewpoint1.y,
      z: viewpoint2.z - viewpoint1.z
    };
  }


  //----------------------------------------------------------------------------

  var rootNode = document.getElementById(configProperties.rootNodeId);
  var webMapDimensionsPx = calculateNodeDimensions(rootNode);
  const initViewpointXY = WebMercator.latLonToWebMercator(configProperties.initViewportCenterLatLon);


  //public attributes and methods ----------------------------------------------

  return {

    rootNode: rootNode,

    dimensionsPx: webMapDimensionsPx,

    minZoomLevel: calculateMinZoomLevel(webMapDimensionsPx),

    maxZoomLevel: Esri.maxZoomLevel,

    initViewpoint: {x:initViewpointXY.x, y:initViewpointXY.y, z:configProperties.initScaleLevel},

    currentViewpoint: null,

    currentMapProperties: null,

    topLeftMapCoords: null,

    updateViewpoint: function(newViewpoint){

      if (this.currentViewpoint === null){
        var deltas = null;
      } else {
        var deltas = calculatedDeltas(newViewpoint, this.currentViewpoint);
      }

      this.currentViewpoint = {
        x: newViewpoint.x,
        y: newViewpoint.y,
        z: newViewpoint.z,
      }

      this.currentMapProperties = MapModel.getMapProperties(newViewpoint.z);
      this.topLeftMapCoords = calculateTopLeftMapCoords(this.currentViewpoint, this.currentMapProperties);

      if (deltas === null){
        eventDispatcher.broadcast("currentViewpointInitialized", this.currentViewpoint);
      } else {
        if (deltas.z == 0){
          var deltaXPx = deltas.x / this.currentMapProperties.pixelSize;
          var deltaYPx = deltas.y / this.currentMapProperties.pixelSize;
          var panProperties = {
            newViewpoint: this.currentViewpoint,
            deltaPx: {x:deltaXPx, y:deltaYPx},
          }
          eventDispatcher.broadcast("viewpointPanned", panProperties);
        } else {
          eventDispatcher.broadcast("viewpointZoomed", this.currentViewpoint);

        }
      }

    },

  };


}
