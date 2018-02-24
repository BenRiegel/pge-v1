"use strict";


var NewWebMap = function(configProperties){


  //private variables ----------------------------------------------------------

  var eventDispatcher;
  var container;
  var viewpoint;
  var scale;
  var pixel;
  var viewport;
  var drawingEventService;
  var basemapDisplay;
  var graphicsDisplay;
  var popupDisplay;
  var zoomControlsDisplay;
  var panEventsReceiver;
  var zoomEventsReceiver;


  //init code ------------------------------------------------------------------

  eventDispatcher = {
    private: NewEventDispatcher(),
    public: NewEventDispatcher(),
  }

  container = NewContainerService(eventDispatcher.private, configProperties.rootNodeId);
  viewpoint = NewViewpointService(eventDispatcher.private, configProperties.initViewpointLatLon);
  scale = NewScaleService(eventDispatcher.private, configProperties.initScaleLevel, container.dimensionsPx);
  pixel = NewPixelService();
  viewport = NewViewportService(container.dimensionsPx);
  drawingEventService = NewDrawingEventService(eventDispatcher.private, viewpoint, scale, pixel, viewport);
  basemapDisplay = NewBasemapDisplay(eventDispatcher.private, container.node, container.dimensionsPx);
  graphicsDisplay = NewGraphicsDisplay(eventDispatcher.private, container.node, viewpoint, scale, pixel, viewport);
  popupDisplay = NewPopupDisplay(eventDispatcher.private, container.node, container.dimensionsPx);
  zoomControlsDisplay = NewZoomControlsDisplay(eventDispatcher.private, container.node);
  panEventsReceiver = NewPanEventsReceiver(eventDispatcher.private, basemapDisplay);
  zoomEventsReceiver = NewZoomEventsReceiver(eventDispatcher.private, zoomControlsDisplay);

  //change this one
  StartAppController(eventDispatcher.private, eventDispatcher.public);
  StartDrawingEventServiceController(eventDispatcher.private, drawingEventService);
  StartBasemapDisplayController(eventDispatcher.private, basemapDisplay);
  StartGraphicsDisplayController(eventDispatcher.private, graphicsDisplay);
  StartPopupDisplayController(eventDispatcher.private, popupDisplay);
  StartZoomControlsDisplayController(eventDispatcher.private, zoomControlsDisplay);
  StartPanEventsReceiverController(eventDispatcher.private, panEventsReceiver);
  StartZoomEventsReceiverController(eventDispatcher.private, zoomEventsReceiver);


  //public attributes and methods ----------------------------------------------

  return {

    //not happy about these
    graphicsDisplay: graphicsDisplay,

    popupDisplay: popupDisplay,

    container: container,

    addEventListener: function(eventName, listener){
      eventDispatcher.public.listen(eventName, listener);
    },

    panTo: function(location){
      eventDispatcher.private.broadcast("animationMoveRequest", {type:"pan-to", location:location});
    },

    zoomTo: function(location){
      eventDispatcher.private.broadcast("animationMoveRequest", {type:"zoom-to", location:location});
    }

  };

};
