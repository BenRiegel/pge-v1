var AjaxServiceController = function(sitesModel){

  if (this.readyEvent.hasFired){
    sitesModel.processSitesData();
  } else {
    this.readyEvent.setHandler(function(){
      sitesModel.processSitesData();
    });
  }
}

//------------------------------------------------------------------------------

var MapModelController = function(viewportModel, sitesView, basemapView){
/*  this.newScaleLevelEvent.setHandler(function(tileScale){
    sitesView.drawPoints();
    basemapView.drawPoints(tileScale);
  });*/
}

//------------------------------------------------------------------------------

var ViewportModelController = function(mapModel, sitesView, mapView, basemapView){

/*  this.viewportMoveEvent.setHandler(function(){
    sitesView.panPoints();
    basemapView.panBasemap();
  });*/

  //----------------------------------------------------------------------------

  this.worldCoordsRequest.setHandler(function(geoCoords){
    return mapModel.calculateWorldCoords(geoCoords);
  });

  this.mapCoordsRequest.setHandler(function(worldCoords){
    return mapModel.calculateMapCoords(worldCoords);
  });

  this.mapPropertiesRequest.setHandler(function(){
    return mapModel.getCurrentMapProperties();
  });

  this.rectifiedWorldCoordsRequest.setHandler(function(worldCoords){
    return mapModel.rectifyWorldCoords(worldCoords);
  });

  this.deltaXWorldRequest.setHandler(function(xPoints){
    return mapModel.calculateDeltaX(xPoints);
  });
}

//------------------------------------------------------------------------------

var SitesModelController = function(ajaxService, mapModel, viewportModel, basemapView, menuView, sitesView){

  this.dataLoadingCompleteEvent.setHandler(function(){
    mapModel.init();
    viewportModel.init();
    basemapView.drawBasemap();
    menuView.init("All Sites");   //not very happy with this starting everything
  });

  this.selectSitesEvent.setHandler(function(selectedSites){
    sitesView.selectSitesHandler(selectedSites);
  });

  //----------------------------------------------------------------------------

  this.ajaxRequest.setHandler(function(){
    return ajaxService.getJSONData();
  });

  this.worldCoordsRequest.setHandler(function(geoCoords){
    return mapModel.calculateWorldCoords(geoCoords);
  });
}

//------------------------------------------------------------------------------

var MenuViewController = function(sitesModel, sitesView){

  this.selectNewTagEvent.setHandler(function(tagName){
    sitesModel.selectSites(tagName);
  });

  this.tagCountObjRequest.setHandler(function(){
    return sitesModel.getTagCountObj();
  });
}

//------------------------------------------------------------------------------

var SitesViewController = function(sitesModel, mapModel, viewportModel){

  this.mapPropertiesRequest.setHandler(function(){
    return mapModel.getCurrentMapProperties();
  });

  this.mapCoordsRequest.setHandler(function(worldCoords){
    return mapModel.calculateMapCoords(worldCoords);
  });

  this.viewportOffsetRequest.setHandler(function(){
    return viewportModel.sendViewportOffset();
  });
}

//------------------------------------------------------------------------------

var BasemapViewController = function(mapModel, viewportModel){

  this.viewportCenterRequest.setHandler(function(){
    return viewportModel.sendCurrentViewportCenter();
  });

  this.viewportDimensionsRequest.setHandler(function(){
    return viewportModel.sendViewportDimensions();
  });

  this.viewportOffsetRequest.setHandler(function(){
    return viewportModel.sendViewportOffset();
  });

  this.mapCoordsRequest.setHandler(function(worldCoords){
    return mapModel.calculateMapCoords(worldCoords);
  });

  this.mapPropertiesRequest.setHandler(function(){
    return mapModel.getCurrentMapProperties();
  });
}

//------------------------------------------------------------------------------

var MapViewController = function(sitesModel, viewportModel, mapModel, sitesView, basemapView){

  this.panEvent.setHandler(function(eventProperties){
    viewportModel.setViewportCenter(eventProperties.newLocation);
    sitesView.panPoints();
    basemapView.moveBasemap();
  });

  this.zoomEvent.setHandler(function(eventProperties){
    mapModel.setScaleLevel(eventProperties.newScaleLevel);
    sitesView.drawPoints();
    basemapView.moveBasemap();
  });

  this.panZoomEvent.setHandler(function(eventProperties){
    mapModel.setScaleLevel(eventProperties.newScaleLevel);
    viewportModel.setViewportCenter(eventProperties.newLocation);
    sitesView.drawPoints();
    basemapView.moveBasemap();
  });

  this.mapMoveEndEvent.setHandler(function(){
    basemapView.drawBasemap();
  });

  this.clusterClickEvent.setHandler(function(index){
    sitesView.flagPreviousClusters(index);
  });

  this.clusterResetEvent.setHandler(function(){
    sitesView.resetPreviousClusters();
  })

  this.pointGraphicMouseOverEvent.setHandler(function(node){
    sitesView.showToolTip(node);
  });

  this.pointGraphicMouseOutEvent.setHandler(function(){
    sitesView.hideToolTip();
  });

  //------------------------------------------------------------------------------

  this.moveXYResultsRequest.setHandler(function(moveProperties){
    return viewportModel.sendMoveXYResults(moveProperties);
  });

  this.moveZResultsRequest.setHandler(function(moveProperties){
    return mapModel.calculateMoveZResults(moveProperties);
  });

}
