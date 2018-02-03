var NewWebMap = function(configProperties){


  //private variables ----------------------------------------------------------

  var eventDispatcher,
      model,
      view;


  //init code ------------------------------------------------------------------


  eventDispatcher = {
    private: NewEventDispatcher(),
    public: NewEventDispatcher(),
  };

  model = NewWebMapModel(eventDispatcher);

  view = {
    container: NewContainer(eventDispatcher),
    basemap: NewBasemapView(eventDispatcher),
    graphics: NewGraphicsView(eventDispatcher),
    popup: NewPopupView(eventDispatcher),
    zoomControls: NewZoomControlsView(eventDispatcher),
  };

  StartModelController(eventDispatcher, configProperties, model, view);
  StartViewController(eventDispatcher, configProperties, model, view);
  StartBasemapController(eventDispatcher, configProperties, model, view);
  StartGraphicsController(eventDispatcher, configProperties, model, view);
  StartPopupController(eventDispatcher, configProperties, model, view);
  StartZoomControlsController(eventDispatcher, configProperties, model, view);

  eventDispatcher.private.broadcast("moduleLoaded");


  //public attributes and methods ----------------------------------------------

  return {

    view: view,

    addEventListener: function(eventName, listener){
      eventDispatcher.public.listen(eventName, listener);
    },

    addGraphicsLayer: function(layerName){
      view.graphics.addGraphicsLayer(layerName);
    },

  };

};
