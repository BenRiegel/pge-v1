'use strict';

window.addEventListener("load", function(){

  //models / services
  var ajaxService = AjaxService("../assets/sites.txt");
  var sitesModel = SitesModel();
  var mapModel = MapModel();
  var viewportModel = ViewportModel();

  //views
  var menuView = MenuView();
  var sitesView = SitesView();
  var basemapView = BasemapView();
  var mapView = MapView();

  ajaxService.controller = AjaxServiceController;
  sitesModel.controller = SitesModelController;
  menuView.controller = MenuViewController;
  viewportModel.controller = ViewportModelController;
  mapModel.controller = MapModelController;
  sitesView.controller = SitesViewController;
  basemapView.controller = BasemapViewController;
  mapView.controller = MapViewController;

  sitesModel.controller(ajaxService, mapModel, viewportModel, basemapView, menuView, sitesView);
  viewportModel.controller(mapModel, sitesView, mapView, basemapView);
  mapModel.controller(viewportModel, sitesView, basemapView);
  menuView.controller(sitesModel, sitesView);
  sitesView.controller(sitesModel, mapModel, viewportModel);
  basemapView.controller(mapModel, viewportModel);
  mapView.controller(sitesModel, viewportModel, mapModel, sitesView, basemapView);
  ajaxService.controller(sitesModel);       //should go last

});
