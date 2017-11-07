var SitesView = function () {

  var sitesRequest = new Event(),
      mapCoordsRequest = new Event();

  var pointGraphicsContainer = document.getElementById("point-graphics-container");

  var currentMapProperties;

  //var viewportOffsetCoords = {x:null, y:null};



  //event handlers -------------------------------------------------------------

  var drawPoints = function(){

/*    var currentPixelSize = currentMapProperties.pixelSize;

    var sites = sitesRequest.fire();
    var selectedSites = [];

    sites.forEach(function(point, i){
      if (point.selected == true){
        point.index = i;
        point.type = "point";
        point.coordSet = [point.worldCoords];
        point.numPoints = 1;  //need this one?
        point.radius = pointGraphicRadius;
        selectedSites.push(point);
      }
    });

    var htmlStr = ""
    while (selectedSites.length > 0){
      var currentPoint = selectedSites.splice(0, 1)[0];
      var createdCluster = null;

      for (let i = 0; i < selectedSites.length; i++){
        var point = selectedSites[i];
        var distance = getDistance(currentPoint.worldCoords, point.worldCoords);
        var clusterDistanceThreshold = currentPixelSize * (currentPoint.radius + point.radius);

        if (distance < clusterDistanceThreshold){
          var combinedCoordSet = currentPoint.coordSet.concat(point.coordSet);
          var newNumPoints = combinedCoordSet.length;
          var clusterCoords = {
            x: (currentPoint.worldCoords.x * currentPoint.numPoints + point.worldCoords.x * point.numPoints)/newNumPoints,
            y: (currentPoint.worldCoords.y * currentPoint.numPoints + point.worldCoords.y * point.numPoints)/newNumPoints
          }

          var maxDist = 0;
          combinedCoordSet.forEach(function(coords){
            var dist = getDistance(clusterCoords, coords);
            if (dist > maxDist){
              maxDist = dist;
            }
          });

          var maxDistPx = Math.round(maxDist / currentPixelSize);
          var newRadius = (maxDistPx < 10)? 10 : maxDistPx;
          newRadius = (newRadius > 16)? 16 : newRadius;

          //calculate map points her
          createdCluster = {
            type: "cluster",
            worldCoords: clusterCoords,
            numPoints: newNumPoints,
            coordSet: combinedCoordSet,
            radius: newRadius
          };

          selectedSites.splice(i, 1);
          selectedSites.push(createdCluster);
          break;
        }
      }

      if (createdCluster == null){
        var screenCoords = mapCoordsRequest.fire(currentPoint.worldCoords);
        htmlStr += `<div class="site-point"
                    data-type=${currentPoint.type}
                    data-x=${currentPoint.worldCoords.x}
                    data-y=${currentPoint.worldCoords.y} style=
                    "left: ${screenCoords.x}px;
                     top: ${screenCoords.y}px;
                     width: ${currentPoint.radius * 2}px;
                     height: ${currentPoint.radius * 2}px;
                     line-height: ${currentPoint.radius * 2}px;">
                     ${currentPoint.numPoints}</div>`
      }
    }*/
  //  pointGraphicsContainer.innerHTML = htmlStr;
  }

  //----------------------------------------------------------------------------

  var updatePointScreenLocations = function(){
    var pointGraphicsNodes = document.getElementsByClassName("site-point");
    for (var i = 0; i < pointGraphicsNodes.length; i++){
      var point = pointGraphicsNodes[i];
      var newScreenCoords = mapCoordsRequest.fire({x:point.dataset.x, y:point.dataset.y});
      point.style.left = `${newScreenCoords.x}px`;
      point.style.top = `${newScreenCoords.y}px`;
    }
  };

  var updateCurrentMapProperties = function(mapProperties){
    currentMapProperties = mapProperties;
  }

  //public variables -----------------------------------------------------------

  return {
    sitesRequest: sitesRequest,
    updateCurrentMapProperties: updateCurrentMapProperties,
    mapCoordsRequest: mapCoordsRequest,
    drawPoints: drawPoints,
    updatePointScreenLocations: updatePointScreenLocations,
  };
}
