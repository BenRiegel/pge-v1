
var Controller = function(models, views){

  // events --------------------------------------------------------------------

  models.sitesModel.dataLoadingCompleteEvent.setHandler(function(){
    models.mapModel.init();
    views.mapView.drawBasemap();
    views.menuView.init("All Sites");
  });

  views.mapView.newScaleLevelEvent.setHandler(function(newScaleLevel){
    models.mapModel.setScaleLevel(newScaleLevel);
    views.mapView.drawBasemap();
    views.sitesView.drawPoints();
  });

  views.mapView.viewportRecenterEvent.setHandler(function(newLocation){
    models.mapModel.setNewLocation(newLocation);
    views.mapView.drawBasemap();  //this is redundant except when zooming home; not sure what to do about this
    views.sitesView.drawPoints();
  });

  views.mapView.attemptMapJumpEvent.setHandler(function(jumpProperties){
    views.mapView.mapJumpHandler(jumpProperties);
  });

  views.mapView.panMoveEvent.setHandler(function(panData){
    models.mapModel.updateViewportOffset(panData);
    views.sitesView.updatePointScreenLocations();
    views.mapView.panBasemap(panData);
  });

  views.mapView.panEndEvent.setHandler(function(panData){
    models.mapModel.updateViewportCenter(panData);
    views.mapView.drawBasemap();
    views.sitesView.drawPoints();
  });

  views.menuView.selectNewTagEvent.setHandler(function(tagName){
    models.sitesModel.selectSites(tagName);
    views.sitesView.drawPoints();
  });

  // data requests -------------------------------------------------------------

  models.sitesModel.sitesRequest.setHandler(function(){
    return models.ajaxService.getJSONData();
  });

  models.sitesModel.wmCoordsRequest.setHandler(function(geoCoords){
    return models.mapModel.calculateWMCoords(geoCoords);
  });

  views.menuView.tagCountRequest.setHandler(function(tagName){
    return models.sitesModel.getTagCount(tagName);
  });

  views.sitesView.sitesRequest.setHandler (function(){
    return models.sitesModel.getSites();
  });

  views.sitesView.mapPropertiesRequest.setHandler(function(){
    return models.mapModel.getCurrentMapProperties();
  });

  views.sitesView.screenCoordsRequest.setHandler(function(mapCoords){
    return models.mapModel.calculateScreenCoords(mapCoords);
  });

  views.mapView.getScaleLevelChangeResults.setHandler(function(properties){
    return models.mapModel.getScaleLevelChangeResults(properties);
  });

  views.mapView.getMapRecenterResults.setHandler(function(properties){
    return models.mapModel.getMapRecenterResults(properties);
  });

  views.mapView.basemapTilesHTMLRequest.setHandler(function(){
    return models.mapModel.createBasemapTilesHTML();
  });

  //ajax callback handler ------------------------------------------------------
  //this should go last after all other handlers have been loaded
  if (models.ajaxService.readyEvent.hasFired){
    models.sitesModel.processSitesData();
  } else {
    models.ajaxService.readyEvent.setHandler(function(){
      models.sitesModel.processSitesData();
    });
  }
};
