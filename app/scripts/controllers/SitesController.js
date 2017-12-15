
var SitesController = function(ajaxService, sitesModel, menuView) {

//  menuView.selectNewTagEvent.setHandler(function(tagName){
/*    sitesModel.selectSites(tagName);
    sitesView.drawNewSelectedSites();
    sitesView.closePopup();*/
//  });


/*  mapView.panEvent.setHandler(function(eventProperties){
    viewportModel.setViewportCenter(eventProperties.newLocation);
  //  sitesView.panPoints();
    basemapView.moveBasemap();
//    menuView.close();
  });

  mapView.zoomEvent.setHandler(function(eventProperties){
    mapModel.setScaleLevel(eventProperties.newScaleLevel);
  //  sitesView.drawPoints();
    basemapView.moveBasemap();
//    sitesView.closePopup();
//    menuView.close();
  });

  mapView.panZoomEvent.setHandler(function(eventProperties){
    mapModel.setScaleLevel(eventProperties.newScaleLevel);
    viewportModel.setViewportCenter(eventProperties.newLocation);
  //  sitesView.drawPoints();
    basemapView.moveBasemap();
//    sitesView.closePopup();
//    menuView.close();
  });

  mapView.mapMoveEndEvent.setHandler(function(){
    basemapView.drawBasemap();
  });*/

/*  mapView.clusterClickEvent.setHandler(function(index){
    sitesView.flagPreviousClusters(index);
  });

  mapView.clusterResetEvent.setHandler(function(){
    sitesView.resetPreviousClusters();
  })

  mapView.siteSelectionEvent.setHandler(function(siteIndex){
    sitesView.siteSelectionHandler(siteIndex);
    menuView.close();
  });*/

  menuView.tagCountObjRequest.setSource(function(){
    return sitesModel.getTagCountObj();
  });


  ajaxService.setCallback(function(jsonData){
    sitesModel.init(jsonData);
    sitesModel.selectSites("All Sites");
    menuView.init("All Sites");
  //  sitesView.drawNewSelectedSites();
  });
}
