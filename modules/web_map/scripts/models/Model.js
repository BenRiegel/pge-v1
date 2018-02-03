var NewWebMapModel = function(eventDispatcher){


  //private variables ----------------------------------------------------------

  var minZoomLevel,
      maxZoomLevel;

  var initViewpoint,
      currentViewpoint;


  //private functions ----------------------------------------------------------

  var copyViewpoint = function(viewpoint){
    return {
      x: viewpoint.x,
      y: viewpoint.y,
      z: viewpoint.z,
    }
  }


  //public attributes and methods ----------------------------------------------

  return {

    calculatePanDistanceWorld: function(panProperties){
      var mapProperties = MapModel.getMapProperties(currentViewpoint.z);
      return {
        x: panProperties.x * mapProperties.pixelSize,
        y: panProperties.y * mapProperties.pixelSize,
      }
    },

    calculateViewpointChange: function(changeProperties){
      switch(changeProperties.type){
        case "pan":
          var newX = WebMercator.calculateNewX(currentViewpoint.x - changeProperties.x);
          var newY = WebMercator.calculateNewY(currentViewpoint.y - changeProperties.y);
          var newZ = currentViewpoint.z;
          break;
        case "in":
          var newX = currentViewpoint.x;
          var newY = currentViewpoint.y;
          var newZ = currentViewpoint.z + changeProperties.increment;
          newZ = Math.min(newZ, maxZoomLevel);
          break;
        case "out":
          var newX = currentViewpoint.x;
          var newY = currentViewpoint.y;
          var newZ = currentViewpoint.z - changeProperties.increment;
          newZ = Math.max(newZ, minZoomLevel);
          break;
        case "home":
          var newX = initViewpoint.x;
          var newY = initViewpoint.y;
          var newZ = initViewpoint.z;
          break;
        case "to":
          var newX = changeProperties.location.x;
          var newX = changeProperties.location.y;
          var newZ = currentViewpoint.z + changeProperties.increment;
      }
      var newViewpoint = {
        x: newX,
        y: newY,
        z: newZ
      };
      var delta = {
        x: WebMercator.calculateDeltaX(newX, currentViewpoint.x),
        y: newY - currentViewpoint.y,
        z: newZ - currentViewpoint.z,
      };
      return {
        init: currentViewpoint,
        new: newViewpoint,
        delta: delta,
      };
    },

    setCurrentViewpoint: function(viewpoint){
      currentViewpoint = copyViewpoint(viewpoint);
      eventDispatcher.private.broadcast("viewpointUpdated", currentViewpoint);
    },

    setInitViewpoint: function(viewpoint){
      initViewpoint = copyViewpoint(viewpoint);
    },

    setMinZoomLevel: function(zoomLevel){
      minZoomLevel = zoomLevel;
    },

    setMaxZoomLevel: function(zoomLevel){
      maxZoomLevel = zoomLevel;
    },
  };

};
