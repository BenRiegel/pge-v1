var NewApp = function(){


  //public attributes and methods ----------------------------------------------

  return {

    models: {},

    views: {},

    controllers: {},

    eventDispatcher: NewEventDispatcher(),

//    dataDispatcher: NewDataDispatcher(),

    addModels: function(modelsObj){
      this.models = modelsObj;
      for (modelName in this.models){
        this.models[modelName].eventDispatcher = this.eventDispatcher;
      }
    },

    addViews: function(viewsObj){
      this.views = viewsObj;
      for (viewName in this.views){
        this.views[viewName].eventDispatcher = this.eventDispatcher;
      }
    },

    addControllers: function(controllersObj){
      this.controllers = controllersObj;
      for (controllerName in this.controllers){
        var controller = this.controllers[controllerName];
        controller.eventDispatcher = this.eventDispatcher;
        controller.models = this.models;
        controller.views = this.views;
      }
    },

    run: function(){
      for (controllerName in this.controllers){
        this.controllers[controllerName].run();
      }
      this.eventDispatcher.broadcast("appInitialized");
    },

  };

};
