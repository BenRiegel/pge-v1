var ViewportModel = function(){

  var worldCoordsRequest = new Event(),
      rectifiedWorldCoordsRequest = new Event(),
      deltaXWorldRequest = new Event(),
      mapCoordsRequest = new Event(),
      mapPropertiesRequest = new Event();

  //any chanes here will have to be reflected in css also
  var viewportDimensionsPx = {
    width: 905,
    height: 515
  };

  var initViewportCenter = {
    geoCoords: {lon:-5, lat:28},
    worldCoords: {x:null, y:null}
  };

  var currentViewportCenter = {
    worldCoords: {x:null, y:null}
  };

  //event handlers -------------------------------------------------------------

  var setViewportCenter = function(newLocation){
    currentViewportCenter.worldCoords.x = newLocation.x;
    currentViewportCenter.worldCoords.y = newLocation.y;
  };

  var init = function(){
    initViewportCenter.worldCoords = worldCoordsRequest.fire(initViewportCenter.geoCoords);
    setViewportCenter(initViewportCenter.worldCoords);
  };

  //data request handlers ------------------------------------------------------

  var sendViewportOffset = function(){
    var currentViewportCenterMapCoords = mapCoordsRequest.fire(currentViewportCenter.worldCoords);
    var x = currentViewportCenterMapCoords.x - (viewportDimensionsPx.width / 2);
    var y = currentViewportCenterMapCoords.y - (viewportDimensionsPx.height / 2);
    return {x:x, y:y};
  }

  //----------------------------------------------------------------------------

  var sendCurrentViewportCenter = function(){
    return currentViewportCenter;
  };

  //----------------------------------------------------------------------------

  var sendViewportDimensions = function(){
    return viewportDimensionsPx;
  };

  //----------------------------------------------------------------------------

  var sendMoveXYResults = function(properties){
    var currentMapProperties = mapPropertiesRequest.fire();
    var newWorldLocation;
    switch (properties.type){
      case "home":
        newWorldLocation = initViewportCenter.worldCoords;
        break;
      case "to":
        newWorldLocation = properties.location;
        break;
      case "pan":
        var deltaXWorld = currentMapProperties.pixelSize * properties.panData.deltaX;
        var deltaYWorld = currentMapProperties.pixelSize * properties.panData.deltaY;
        var newX = currentViewportCenter.worldCoords.x - deltaXWorld;
        var newY = currentViewportCenter.worldCoords.y - deltaYWorld;
        newWorldLocation = {x:newX, y:newY};
        return rectifiedWorldCoordsRequest.fire(newWorldLocation);
    }
    var xPoints = {x1:currentViewportCenter.worldCoords.x, x2:newWorldLocation.x};
    var deltaX = deltaXWorldRequest.fire(xPoints);
    var deltaY = newWorldLocation.y - currentViewportCenter.worldCoords.y;
    var deltaXPx = Math.abs(deltaX / currentMapProperties.pixelSize);
    var deltaYPx = Math.abs(deltaY / currentMapProperties.pixelSize);
    var maxPx = Math.max(deltaXPx, deltaYPx);
    return ({initLocation:currentViewportCenter.worldCoords,
             deltaXY:{x:deltaX, y:deltaY},
             maxPx:maxPx});
  }

  //public variables -----------------------------------------------------------

  return {
    worldCoordsRequest: worldCoordsRequest,
    rectifiedWorldCoordsRequest: rectifiedWorldCoordsRequest,
    deltaXWorldRequest: deltaXWorldRequest,
    mapCoordsRequest: mapCoordsRequest,
    mapPropertiesRequest: mapPropertiesRequest,
    setViewportCenter: setViewportCenter,
    sendViewportOffset: sendViewportOffset,
    sendCurrentViewportCenter: sendCurrentViewportCenter,
    sendViewportDimensions: sendViewportDimensions,
    sendMoveXYResults: sendMoveXYResults,
    init: init,
  };
}
