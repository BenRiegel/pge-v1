"use strict";


window.addEventListener("load", function(){


  //configuration constants ----------------------------------------------------
  const webMapConfigProperties = {
    rootNodeId: "map",
    initViewpointLatLon: {lon:-5, lat:28},
    initScaleLevel: 2,
  }

  const selectMenuConfigProperties = {
    rootNodeId: "select-menu",
  };

  //app event dispather --------------------------------------------------------
  var eventDispatcher = NewEventDispatcher();

  //plugins --------------------------------------------------------------------
  var selectMenu = NewSelectMenu(selectMenuConfigProperties);
  var webMap = NewWebMap(webMapConfigProperties);

  //model ----------------------------------------------------------------------
  var projectsModel = NewProjectsModel(eventDispatcher);

  //views ----------------------------------------------------------------------
  var tagsView = NewTagsView(eventDispatcher);
  var locationsView = NewLocationsView(eventDispatcher);
  var summaryView = NewSummaryView(eventDispatcher, webMap);

  //controllers ----------------------------------------------------------------
  StartProjectsModelController(eventDispatcher, projectsModel);
  StartTagsViewController(eventDispatcher, projectsModel, tagsView);
  StartLocationsViewController(eventDispatcher, webMap, projectsModel, locationsView);
  StartSummaryViewController(eventDispatcher, projectsModel, summaryView, locationsView);
  StartSelectMenuController(eventDispatcher, selectMenu, tagsView);
  StartWebMapController(eventDispatcher, webMap, locationsView, summaryView);

});
