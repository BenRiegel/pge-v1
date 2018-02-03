
var Model = function() {

  //private constants ----------------------------------------------------------

  const worldExtent = {
    min: -2.0037507067161843E7,
    max: 2.0037507067161843E7,
  };

  const worldCircumference = worldExtent.max - worldExtent.min;

  const maxScale = 5.91657527591555E8,
        log2MaxScale = Math.log2(maxScale);

  const pixelsPerMeter = 3779.52;


  //private constants ----------------------------------------------------------




  const minScaleLevel = 2,
        maxScaleLevel = 12,
        scaleLevelIncrement = 1,
        initScaleLevel = 2;

  const viewportDimensionsPx = {
    width: 905,
    height: 515
  };

  const initViewportCenter = {
    geoCoords: {lon:-5, lat:28},
    worldCoords: {x:null, y:null}
  };

  var sites = [];

  var currentScaleLevel = null,
      currentPixelSize = null,
      currentMapSizePx = null;

  var currentViewportCenter = {
    worldCoords: {x:null, y:null}
  };



    var setScaleLevel = function(newScaleLevel){
      var mapScale = Math.pow(2, log2MaxScale - newScaleLevel);
      var pixelSize = mapScale / pixelsPerMeter;
      this.currentScaleLevel = newScaleLevel;
      this.currentPixelSize = pixelSize;
      this.currentMapSizePx = worldCircumference / pixelSize;
    }



  var setViewportCenter = function(newLocation){
    currentViewportCenter.worldCoords.x = newLocation.x;
    currentViewportCenter.worldCoords.y = newLocation.y;
  };


  var processSitesData = function(){
    sites = ajaxService.getJSONData();
    sites.forEach(function(site, i){
      site.type = "site";
      var geoCoords = {lon: site.lon, lat:site.lat};             //refactor json file eventually to merge lat / lon
      site.worldCoords = mapModel.calculateWorldCoords(geoCoords);
    });
  //  this.dataLoadingCompleteEvent.fire();
  };



}
