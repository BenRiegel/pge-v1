var StartModelController = function(eventDispatcher, configProperties, model, view){


  //private functions ----------------------------------------------------------

  var calculateMinZoomLevel = function(basemapDimensionsPx){
    var minZoomLevelX = Math.log2(basemapDimensionsPx.width / Esri.basemapTileSizePx);
    minZoomLevelX = Math.ceil(minZoomLevelX);
    var minZoomLevelY = Math.log2(basemapDimensionsPx.height / Esri.basemapTileSizePx);
    minZoomLevelY = Math.ceil(minZoomLevelY);
    return Math.max(minZoomLevelX, minZoomLevelY);
  };

  var calculateInitViewpoint = function(configProperties){
    var initViewpointCenter = WebMercator.latLonToWebMercator(configProperties.initViewportCenterLatLon);
    return {
      x: initViewpointCenter.x,
      y: initViewpointCenter.y,
      z: configProperties.initScaleLevel,
    }
  }


  //init code ------------------------------------------------------------------

  eventDispatcher.private.listen("containerConfigured", function(eventData){
    model.setMaxZoomLevel(Esri.maxZoomLevel);
    var minZoomLevel = calculateMinZoomLevel(view.container.dimensionsPx);
    model.setMinZoomLevel(minZoomLevel);
    var initViewpoint = calculateInitViewpoint(configProperties);
    model.setInitViewpoint(initViewpoint);
    model.setCurrentViewpoint(initViewpoint);
  });

};
