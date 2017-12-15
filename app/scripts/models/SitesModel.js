var SitesModel = function(worldModel) {

  //private variables ----------------------------------------------------------

  var sites = [];

  //public methods -------------------------------------------------------------

  var init = function(sitesData){
    sites = JSON.parse(sitesData);
    sites.forEach(function(site, i){
      site.type = "site";
      site.selected = false;
      site.prevCluster = false;
      var geoCoords = {lon: site.lon, lat:site.lat};             //refactor json file eventually to merge lat / lon
      site.worldCoords = worldModel.calculateWorldCoords(geoCoords);
    });
  };

  var selectSites = function(tagName){
    sites.forEach(function(site, i){
      site.selected = site.tags.includes(tagName);
      site.prevCluster = false;
    });
  }

  //service functions ----------------------------------------------------------

  var getSelectedSites = function(){
    var selectedSites = [];
    sites.forEach(function(site, i){
      if (site.selected){
        selectedSites.push(site);
      }
    });
    return selectedSites;
  }

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
    init: init,
    selectSites: selectSites,
    getSelectedSites: getSelectedSites,
    getTagCountObj: getTagCountObj
  };

};
