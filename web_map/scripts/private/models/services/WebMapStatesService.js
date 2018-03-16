"use strict";


var NewWebMapStatesService = function(eventDispatcher, initViewpointLatLon, initScaleLevel){


  //private non-configurable constants -----------------------------------------

  //see https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/
  const maxScale = 5.91657527591555E8,
        log2MaxScale = Math.log2(maxScale),
        pixelsPerMeter = 3779.52;

  const initViewpointCenterWorld = WebMercator.latLonToWebMercator(initViewpointLatLon);


  //private, configurable constants --------------------------------------------

  const zoomInOutScaleLevelIncrement = 1;
  const zoomToScaleLevelIncrement = 2;


  //private variables ----------------------------------------------------------

  var minScaleLevel;
  var maxScaleLevel;
  var webMapDimensionsPx;


  //private functions ----------------------------------------------------------

  var calculateMapPixelProperties = function(){
    var mapScale = Math.pow(2, log2MaxScale - this.scaleLevel);
    this.mapPixelSize = mapScale / pixelsPerMeter;
    this.mapPixelNum = Math.round(WebMercator.circumference / this.mapPixelSize);
  };

  var calculateViewpointMapProperties = function(){
    this.viewpointCenterMap.x = this.viewpointCenterWorld.x / this.mapPixelSize;
    this.viewpointCenterMap.y = this.viewpointCenterWorld.y / this.mapPixelSize;
    this.viewpointTopLeftMap.left = this.viewpointCenterMap.x - webMapDimensionsPx.width * 0.5;
    this.viewpointTopLeftMap.top = this.viewpointCenterMap.y - webMapDimensionsPx.height * 0.5;
  };


  //private code block ---------------------------------------------------------

  maxScaleLevel = Esri.maxScaleLevel;


  //public properties and methods ----------------------------------------------

  return {

    viewpointCenterWorld: {x:null, y:null},

    viewpointCenterMap: {x:null, y:null},

    viewpointTopLeftMap: {left:null, top:null},

    scaleLevel: null,

    mapPixelSize: null,

    mapPixelNum: null,

    calculateAnimationViewpointScaleChange: function(eventProperties){
      switch(eventProperties.type){
        case "zoom-in":
          var requestedX = this.viewpointCenterWorld.x;
          var requestedY = this.viewpointCenterWorld.y;
          var requestedScaleLevel = this.scaleLevel + zoomInOutScaleLevelIncrement;
          break;
        case "zoom-out":
          var requestedX = this.viewpointCenterWorld.x;
          var requestedY = this.viewpointCenterWorld.y;
          var requestedScaleLevel = this.scaleLevel - zoomInOutScaleLevelIncrement;
          break;
        case "zoom-home":
          var requestedX = initViewpointCenterWorld.x;
          var requestedY = initViewpointCenterWorld.y;
          var requestedScaleLevel = initScaleLevel;
          break;
        case "zoom-to":
          var requestedX = eventProperties.location.x;
          var requestedY = eventProperties.location.y;
          var requestedScaleLevel = this.scaleLevel + zoomToScaleLevelIncrement;
          break;
        case "pan-to":
          var requestedX = eventProperties.location.x;
          var requestedY = eventProperties.location.y;
          var requestedScaleLevel = this.scaleLevel;
          break;
      }
      var newScaleLevel = Math.min(Math.max(requestedScaleLevel, minScaleLevel), maxScaleLevel);
      var deltaX = WebMercator.calculateDeltaX(requestedX, this.viewpointCenterWorld.x);
      var deltaY = requestedY - this.viewpointCenterWorld.y;
      var deltaScaleLevel = newScaleLevel - this.scaleLevel;
      return {
        current: {x:this.viewpointCenterWorld.x, y:this.viewpointCenterWorld.y, scaleLevel:this.scaleLevel},
        new: {x:requestedX, y:requestedY, scaleLevel:newScaleLevel},
        delta: {x:deltaX, y:deltaY, scaleLevel:deltaScaleLevel},
      };
    },

    calculatePanViewpointChange: function(deltaX, deltaY){
      var newX = WebMercator.calculateNewX(this.viewpointCenterWorld.x + deltaX);
      var newY = WebMercator.calculateNewY(this.viewpointCenterWorld.y + deltaY);
      var resultDeltaY = newY - this.viewpointCenterWorld.y;
      return {
        current: {x:this.viewpointCenterWorld.x, y:this.viewpointCenterWorld.y},
        new: {x:newX, y:newY},
        delta: {x:deltaX, y:resultDeltaY},
      };
    },

    updateViewpointScale: function(newViewpoint, newScaleLevel){
      if (newViewpoint){
        this.viewpointCenterWorld.x = WebMercator.calculateNewX(newViewpoint.x);
        this.viewpointCenterWorld.y = WebMercator.calculateNewY(newViewpoint.y);
      }
      if (newScaleLevel){
        this.scaleLevel = newScaleLevel;
        calculateMapPixelProperties.call(this)
      };
      calculateViewpointMapProperties.call(this);
    },

    //redundant
    calculateMapPixelProperties: function(scaleLevel){
      var mapScale = Math.pow(2, log2MaxScale - scaleLevel);
      var mapPixelSize = mapScale / pixelsPerMeter;
      var mapPixelNum = Math.round(WebMercator.circumference / mapPixelSize);
      return {size:mapPixelSize, num:mapPixelNum};
    },

    configure: function(scaleLevel, dimensionsPx){
      minScaleLevel = scaleLevel;
      webMapDimensionsPx = dimensionsPx;
      this.updateViewpointScale(initViewpointCenterWorld, initScaleLevel);
      eventDispatcher.broadcast("webMapStatesServiceConfigured");
    },

  };

};
