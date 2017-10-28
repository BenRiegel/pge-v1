'use strict';

window.addEventListener("load", function(){

  var models = {
    ajaxService: AjaxService("../assets/sites.txt"),
    sitesModel: SitesModel(),
    mapModel: MapModel()
  };

  var views = {
    menuView: MenuView(),
    sitesView: SitesView(),
    mapView: MapView()
  }

  Controller(models, views);

});
