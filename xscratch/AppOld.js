'use strict'

window.addEventListener("load", function(){

  //private variables ----------------------------------------------------------

  var eventDispatcher,
      model,
      view;


  //init code ------------------------------------------------------------------

  eventDispatcher = NewEventDispatcher();

  model = {
    projects: NewProjectsModel(eventDispatcher),
    tags: NewTagsModel(eventDispatcher),
  };

  view = {
    map: NewMapView(eventDispatcher),
    selectMenu: NewSelectMenuView(eventDispatcher),
  }

  StartAppController(eventDispatcher, model, view);
  StartMapController(eventDispatcher, model, view);
  StartSelectMenuController(eventDispatcher, model, view);

});
