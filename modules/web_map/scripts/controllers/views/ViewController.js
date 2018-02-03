var StartViewController = function(eventDispatcher, configProperties, model, view){


  //init code ------------------------------------------------------------------

  eventDispatcher.private.listen("moduleLoaded", function(eventData){
    view.container.configure(configProperties);
  });

};
