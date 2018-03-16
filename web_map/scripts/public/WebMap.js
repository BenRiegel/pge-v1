"use strict";


var NewWebMap = function(configProperties){


  //private variables ----------------------------------------------------------

  var eventDispatcher;

  var webMapStates;
  var mapGraphicsModel;
  var mapBasemapModel;
  var animationMapMover;
  var userPanMapMover;
  var frameToggler;
  var mapBasemapView;
  var containerDisplay;
  var mapGraphicsView;
  var popupDisplay;
  var zoomControlsDisplay;
  var panEventsReceiver;
  var zoomEventsReceiver;


  //private code block ----------------------------------------------------------

  eventDispatcher = {
    private: NewEventDispatcher(),
    public: NewEventDispatcher(),
  }

  webMapStates = NewWebMapStatesService(eventDispatcher.private,
                                        configProperties.initViewpointLatLon,
                                        configProperties.initScaleLevel);
  mapBasemapModel = NewMapBasemapModel(eventDispatcher.private);
  mapGraphicsModel = NewMapGraphicsModel(eventDispatcher.private);

  animationMapMover = NewAnimationMapMoverService(eventDispatcher.private, webMapStates);
  userPanMapMover = NewUserPanMapMoverService(eventDispatcher.private, webMapStates);
  frameToggler = NewFrameTogglerService(eventDispatcher.private);
  mapBasemapView = NewMapBasemapView(eventDispatcher.private);
  mapGraphicsView = NewMapGraphicsView(eventDispatcher.private);
  containerDisplay = NewContainerDisplay(eventDispatcher.private, configProperties.rootNodeId);
  popupDisplay = NewPopupDisplay(eventDispatcher.private);
  zoomControlsDisplay = NewZoomControlsDisplay(eventDispatcher.private);
  panEventsReceiver = NewPanEventsReceiver(eventDispatcher.private);
  zoomEventsReceiver = NewZoomEventsReceiver(eventDispatcher.private);

  StartAppController(eventDispatcher);
  StartWebMapStatesController(eventDispatcher.private, webMapStates);
  StartContainerDisplayController(eventDispatcher.private, containerDisplay);
  StartAnimationMapMoverServiceController(eventDispatcher.private, animationMapMover);
  StartUserPanMapMoverServiceController(eventDispatcher.private, userPanMapMover);
  StartMapBasemapController(eventDispatcher.private, mapBasemapModel, mapBasemapView, webMapStates, containerDisplay);


  StartFrameTogglerServiceController(eventDispatcher.private, frameToggler);
  StartMapGraphicsModelController(eventDispatcher.private, mapGraphicsModel, mapGraphicsView, webMapStates);
  StartMapGraphicsViewController(eventDispatcher.private, mapGraphicsView);
  StartPopupDisplayController(eventDispatcher.private, popupDisplay);
  StartZoomControlsDisplayController(eventDispatcher.private, zoomControlsDisplay);
  StartPanEventsReceiverController(eventDispatcher.private, panEventsReceiver);
  StartZoomEventsReceiverController(eventDispatcher.private, zoomEventsReceiver);


  //public attributes and methods ----------------------------------------------

  return {

    //not happy about these
    graphicsDisplay: mapGraphicsView,

    popupDisplay: popupDisplay,

    container: containerDisplay,

    addEventListener: function(eventName, listener){
      eventDispatcher.public.listen(eventName, listener);
    },

    addGraphicsLayer: function(graphicsLayer){
      eventDispatcher.private.broadcast("addGraphicsLayerRequest", graphicsLayer);
    },

    refreshGraphicsLayer: function(graphicsLayer){
      eventDispatcher.private.broadcast("refreshGraphicsLayerRequest", graphicsLayer);
    },

    panTo: function(location){
      //error check this
      eventDispatcher.private.broadcast("animationMoveRequest", {type:"pan-to", location:location});
    },

    zoomTo: function(location){
      eventDispatcher.private.broadcast("animationMoveRequest", {type:"zoom-to", location:location});
    },

    enablePanning: function(){
      panEventsReceiver.enable();
    },

    disablePanning: function(){
      panEventsReceiver.disable();
    },

    enableZooming: function(){
      zoomEventsReceiver.enable();
    },

    disableZooming: function(){
      zoomEventsReceiver.disable();
    },

    wait: function(){
      containerDisplay.showWorkingCursor();
    },

    clearWaiting: function(){
      containerDisplay.removeWorkingCursor();
    },

  };

};
