var SitesModel = function () {

  var dataLoadingCompleteEvent = new Event(),
      sitesRequest = new Event(),
      wmCoordsRequest = new Event();

  var tagsObj = {},
      sites = [];

  //helper functions -----------------------------------------------------------

  var getWMCoords = function(){
    sites.forEach(function(site, i){
      var geoCoords = {lon: site.lon, lat:site.lat};  //refactor json file eventually to merge lat / lon
      site.wmCoords = wmCoordsRequest.fire(geoCoords);
    });
  };

  var calculateTagCounts = function(){
    sites.forEach(function(site, i){
      site.tags.forEach(function(tagName, j){
        tagsObj[tagName] = (tagName in tagsObj)? tagsObj[tagName] + 1 : 1;
      });
    });
  }

  //event handlers -------------------------------------------------------------

  var selectSites = function(tagName){           //responds to menu event
    sites.forEach(function(site, i){
      site.selected = site.tags.includes(tagName);
    });
  }

  var processSitesData = function(){
    sites = sitesRequest.fire();
    calculateTagCounts();
    getWMCoords();
    dataLoadingCompleteEvent.fire();
  };

  //data request handlers ------------------------------------------------------

  var getTagCount = function(tagName){         //used in MenuView.js
    return tagsObj[tagName];
  }

  var getSites = function(tagName){            //used in SitesView.js
    return sites;
  }

  //public variables -----------------------------------------------------------

  return {
    dataLoadingCompleteEvent: dataLoadingCompleteEvent,
    sitesRequest: sitesRequest,
    wmCoordsRequest: wmCoordsRequest,
    selectSites: selectSites,
    processSitesData: processSitesData,
    getTagCount: getTagCount,
    getSites: getSites
  };
};
