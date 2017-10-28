var SitesView = function () {

  var sitesRequest = new Event(),
      mapPropertiesRequest = new Event(),
      screenCoordsRequest = new Event();

  var pointGraphicsContainer = document.getElementById("point-graphics-container");
  var pointGraphicRadius = 8;

  //helper functions -----------------------------------------------------------

  var getDistance = function(coords1, coords2){
    var distanceX = coords1.x - coords2.x;
    var distanceY = coords1.y - coords2.y;
    return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  }

  //event handlers -------------------------------------------------------------

  var drawPoints = function(){

    var currentMapProperties = mapPropertiesRequest.fire();
    var currentPixelSize = currentMapProperties.pixelSize;

    var sites = sitesRequest.fire();
    var selectedSites = [];

    sites.forEach(function(point, i){
      if (point.selected == true){
        point.index = i;
        point.type = "point";
        point.coordSet = [point.wmCoords];
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
        var distance = getDistance(currentPoint.wmCoords, point.wmCoords);
        var clusterDistanceThreshold = currentPixelSize * (currentPoint.radius + point.radius);

        if (distance < clusterDistanceThreshold){
          var combinedCoordSet = currentPoint.coordSet.concat(point.coordSet);
          var newNumPoints = combinedCoordSet.length;
          var clusterCoords = {
            x: (currentPoint.wmCoords.x * currentPoint.numPoints + point.wmCoords.x * point.numPoints)/newNumPoints,
            y: (currentPoint.wmCoords.y * currentPoint.numPoints + point.wmCoords.y * point.numPoints)/newNumPoints
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

          createdCluster = {
            type: "cluster",
            wmCoords: clusterCoords,
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
        var screenCoords = screenCoordsRequest.fire(currentPoint.wmCoords);
        htmlStr += `<div class="site-point"
                    data-type=${currentPoint.type}
                    data-x=${currentPoint.wmCoords.x}
                    data-y=${currentPoint.wmCoords.y} style=
                    "left: ${screenCoords.x}px;
                     top: ${screenCoords.y}px;
                     width: ${currentPoint.radius * 2}px;
                     height: ${currentPoint.radius * 2}px;
                     line-height: ${currentPoint.radius * 2}px;">
                     ${currentPoint.numPoints}</div>`
      }
    }
    pointGraphicsContainer.innerHTML = htmlStr;
  }

  //----------------------------------------------------------------------------

  var updatePointScreenLocations = function(){
    var pointGraphicsNodes = document.getElementsByClassName("site-point");
    for (var i = 0; i < pointGraphicsNodes.length; i++){
      var point = pointGraphicsNodes[i];
      var newScreenCoords = screenCoordsRequest.fire({x:point.dataset.x, y:point.dataset.y});
      point.style.left = `${newScreenCoords.x}px`;
      point.style.top = `${newScreenCoords.y}px`;
    }
  };

  //public variables -----------------------------------------------------------

  return {
    sitesRequest: sitesRequest,
    mapPropertiesRequest: mapPropertiesRequest,
    screenCoordsRequest: screenCoordsRequest,
    drawPoints: drawPoints,
    updatePointScreenLocations: updatePointScreenLocations,
  };
}
