"use strict";


window.addEventListener("load", function(){

  const webMapConfigProperties = {
    rootNodeId: "map",
    initViewpointLatLon: {lon:-5, lat:28},
    initScaleLevel: 2,
  }

  const selectMenuConfigProperties = {
    rootNodeId: "select-menu",
  };

  var eventDispatcher = NewEventDispatcher();
  var selectMenu = NewSelectMenu(selectMenuConfigProperties);
  var webMap = NewWebMap(webMapConfigProperties);
  var projectsModel = NewProjectsModel(eventDispatcher);
  var tagsView = NewTagsView(eventDispatcher);
  var locationsView = NewLocationsView(eventDispatcher);
  var summaryView = NewSummaryView(eventDispatcher, webMap);

  StartProjectsModelController(eventDispatcher, projectsModel);
  StartTagsViewController(eventDispatcher, projectsModel, tagsView);
  StartLocationsViewController(eventDispatcher, projectsModel, locationsView);
  StartSummaryViewController(eventDispatcher, projectsModel, summaryView, locationsView);
  StartSelectMenuController(eventDispatcher, selectMenu, tagsView);
  StartWebMapController(eventDispatcher, webMap, locationsView, summaryView);

});
