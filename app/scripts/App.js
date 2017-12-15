'use strict';


window.addEventListener("load", function(){

  var webmapConfigProperties = {
    mapNodeId: "map",
    initViewportCenterLatLon: {lon:-5, lat:28},
    initZoomLevel: 2,
  }
  var webmap = new Webmap(webmapConfigProperties);




  //var ajaxService = new AjaxService("../data/sites.txt");
//  var sitesModel = new SitesModel();
//  webmap.addGraphicsLayer();

});
