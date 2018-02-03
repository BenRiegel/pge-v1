var Controller = function(model, view){


  // events --------------------------------------------------------------------

  view.attemptedPanEvent.attach(function(properties){
    model.attemptedPanEventHandler(properties);
  });

  model.successfulPanEvent.attach(function(properties){
    view.moveBasemap(properties);
  });

  model.loadTileImageEvent.attach(function(tileImageList){
    view.loadImages(tileImageList);
  });

  model.showBasemapEvent.attach(function(){
    view.showBasemap();
  });



  /*mapModel.newScaleLevelEvent.attach(function(currentMapProperties){

  });*/

  /*viewportModel.basemapTilesLoadedEvent.attach(function(){
    webmapView.showBasemap();
  });*/


  /*webmapModel.mapMoveEvent.attach(function(eventProperties){
    viewportModel.setViewportCenter(eventProperties.newLocation);
    mapModel.setScaleLevel(eventProperties.newScaleLevel);
    webmapView.drawBasemapFrame(eventProperties.frameNum);
  });

  webmapView.mapMoveEvent.attach(function(moveProperties){
    webmapModel.mapMoveHandler(moveProperties);
  });*/

/*  webmapView.panEvent.attach(function(panProperties){
    basemapModel.moveBasemap(panProperties);
  })*/



  // services ------------------------------------------------------------------

/*  view.tileInfoListRequest.setSource(function(){
    return model.getTileInfoList();
  });*/

/*  viewportModel.mapPropertiesRequest.setSource(function(){
    return mapModel.getProperties();
  });

  mapModel.minScaleLevelRequest.setSource(function(){
    return viewportModel.calculateMinScaleLevel();
  });

  basemapModel.mapPropertiesRequest.setSource(function(){
    return mapModel.getProperties();
  });

  basemapModel.viewportPropertiesRequest.setSource(function(){
    return viewportModel.getProperties();
  });

  webmapView.basemapTilesHTMLRequest.setSource(function(container){
    return basemapModel.loadBasemapTiles(container);
  });*/


  /*webmapModel.scaleLevelMoveResultsRequest.setSource(function(moveProperties){
    return mapModel.getScaleLevelMoveResults(moveProperties);
  });*/

/*  webmapModel.viewportMoveResultsRequest.setSource(function(moveProperties){
    return viewportModel.getViewportMoveResults(moveProperties);
  });*/
  //view.loadBasemap();



};
