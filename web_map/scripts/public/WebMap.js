"use strict";


var NewWebMap = function(configProperties){


  //private variables ----------------------------------------------------------

  var rootNode;
  var webMapDimensionsPx;
  var minZoomLevel;
  var eventDispatcher;
  var viewpointModel;
  var graphicsView
  var basemapView;
  var popupView;
  var zoomControlsView;


  //private functions ----------------------------------------------------------

  /*var calculateNodeDimensions = function(node){
    const rect = node.getBoundingClientRect();
    return {width:rect.width, height:rect.height};
  };


  var calculateMinZoomLevel = function(dimensionsPx){
    var minZoomLevelX = Math.log2(dimensionsPx.width / Esri.basemapTileSizePx);
    minZoomLevelX = Math.ceil(minZoomLevelX);
    var minZoomLevelY = Math.log2(dimensionsPx.height / Esri.basemapTileSizePx);
    minZoomLevelY = Math.ceil(minZoomLevelY);
    return Math.max(minZoomLevelX, minZoomLevelY);
  };*/


  //init code ------------------------------------------------------------------

//  rootNode = document.getElementById(configProperties.rootNodeId);
//  webMapDimensionsPx = calculateNodeDimensions(rootNode);
//  minZoomLevel = calculateMinZoomLevel(webMapDimensionsPx);

//  const initViewpoint = WebMercator.latLonToWebMercator(configProperties.initViewportCenterLatLon);
//  var scaleService = NewScaleService(privateEventDispatcher, configProperties.initScaleLevel, minZoomLevel, Esri.maxZoomLevel);


  var privateEventDispatcher = NewEventDispatcher();
  var publicEventDispatcher = NewEventDispatcher();

  var webMapStates = NewStatesService(privateEventDispatcher, configProperties);
  var viewpointService = NewViewpointService(privateEventDispatcher, webMapStates);
  var panAnimator = NewPanAnimator(privateEventDispatcher, webMapStates, viewpointService);
  var zoomAnimator = NewZoomAnimator(privateEventDispatcher, webMapStates, viewpointService);

  var basemapDisplay = NewBasemapDisplay(privateEventDispatcher, webMapStates);
  var graphicsDisplay = NewGraphicsDisplay(privateEventDispatcher, webMapStates);
  var popupDisplay = NewPopupDisplay(privateEventDispatcher, webMapStates);
  var zoomControlsDisplay = NewZoomControlsDisplay(privateEventDispatcher, webMapStates);

  var layerToggler = NewLayerToggler(privateEventDispatcher, basemapDisplay, graphicsDisplay, panAnimator, zoomAnimator)
  var panEventsReceiver = NewPanEventsReceiver(privateEventDispatcher, basemapDisplay);
  var zoomEventsReceiver = NewZoomEventsReceiver(privateEventDispatcher, zoomControlsDisplay);

  StartAppController(privateEventDispatcher, publicEventDispatcher);
  //this needs to go up high
  StartStatesController(privateEventDispatcher, webMapStates);
  StartViewpointServiceController(privateEventDispatcher, viewpointService);
//  StartScaleServiceController(privateEventDispatcher, scaleService);
  StartPanAnimatorController(privateEventDispatcher, panAnimator);
  StartZoomAnimatorController(privateEventDispatcher, zoomAnimator);
  StartLayerTogglerController(privateEventDispatcher, layerToggler);
  StartBasemapController(privateEventDispatcher, basemapDisplay);
  StartGraphicsController(privateEventDispatcher, graphicsDisplay);
  StartPopupController(privateEventDispatcher, popupDisplay);
  StartZoomControlsController(privateEventDispatcher, zoomControlsDisplay);
  StartPanEventsReceiverController(privateEventDispatcher, panEventsReceiver);
  StartZoomEventsReceiverController(privateEventDispatcher, zoomEventsReceiver);
  StartLayersController(privateEventDispatcher, basemapDisplay, graphicsDisplay);





  //public attributes and methods ----------------------------------------------

  return {

    //not happy about this
    graphicsView: graphicsDisplay,

    popupView: popupDisplay,

    addEventListener: function(eventName, listener){
      publicEventDispatcher.listen(eventName, listener);
    },

  };

};
