var NewWebMapView = function(){


  //private, configurable constants --------------------------------------------

  const mapConfigProperties = {
    rootNodeId: "map",
    initViewportCenterLatLon: {lon:-5, lat:28},
    initScaleLevel: 2,
  }


  //public attributes and methods ----------------------------------------------

  return {

    webMap: null,

    load: function(){
      this.webMap = NewWebMap(mapConfigProperties);
  //    modifyDefaultMapPopup(this.webMap.view.popup);
  //    modifyDefaultMapGraphics(this.webMap.view.graphics);
      this.eventDispatcher.broadcast("mapReady");
    },

  };

};
