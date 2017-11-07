var SitesModel = function () {

  var dataLoadingCompleteEvent = new Event(),
      selectSitesEvent = new Event(),
      ajaxRequest = new Event(),
      worldCoordsRequest = new Event();

  var sites = [];

  //event handlers -------------------------------------------------------------

  var selectSites = function(tagName){
    var selectedSites = [];
    sites.forEach(function(site, i){
      site.prevCluster = false;
      if (site.tags.includes(tagName)){
        selectedSites.push(site);
      }
    });
    selectSitesEvent.fire(selectedSites);
  }

  var processSitesData = function(){
    sites = ajaxRequest.fire();
    sites.forEach(function(site, i){
      site.type = "site";
      var geoCoords = {lon: site.lon, lat:site.lat};             //refactor json file eventually to merge lat / lon
      site.worldCoords = worldCoordsRequest.fire(geoCoords);
    });
    dataLoadingCompleteEvent.fire();
  };

  //data request handlers ------------------------------------------------------

  var getTagCountObj = function(){
    var tagsObj = {};
    sites.forEach(function(site, i){
      site.tags.forEach(function(tagName, j){
        tagsObj[tagName] = (tagName in tagsObj)? tagsObj[tagName] + 1 : 1;
      });
    });
    return tagsObj;
  }

  //public variables -----------------------------------------------------------

  return {
    dataLoadingCompleteEvent: dataLoadingCompleteEvent,
    selectSitesEvent: selectSitesEvent,
    ajaxRequest: ajaxRequest,
    worldCoordsRequest: worldCoordsRequest,
    selectSites: selectSites,
    processSitesData: processSitesData,
    getTagCountObj: getTagCountObj,
  };
};
