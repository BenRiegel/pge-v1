
  var drawPointGraphics = function(){

    pointGraphicsContainer.style.transform = "";
    var currentMapProperties = mapPropertiesRequest.fire();
    var currentPixelSize = currentMapProperties.pixelSize;
    var sites = sitesRequest.fire();
    var selectedSites = [];

    sites.forEach(function(point, i){
      if (point.selected == true){
        point.indices = [i];
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
          var prevCluster = (currentPoint.prevCluster || point.prevCluster);
          var combinedIndicesSet = currentPoint.indices.concat(point.indices);
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

          createdCluster = {
            indices: combinedIndicesSet,
            type: "cluster",
            prevCluster: prevCluster,
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
        var screenCoords = screenCoordsRequest.fire(currentPoint.worldCoords);
        var prevClusterStr = (currentPoint.prevCluster)? "prevCluster" : "";
        htmlStr += `<div class="site-point ${prevClusterStr} no-select"
                    data-type=${currentPoint.type}
                    data-indices=${currentPoint.indices}
                    data-x=${currentPoint.worldCoords.x}
                    data-y=${currentPoint.worldCoords.y}
                    data-screenx=${screenCoords.x}
                    data-screeny=${screenCoords.y} style=
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




    //get rid of these?
    var flagPreviousClusters = function(indicesStr){
      var indicesList = indicesStr.split(",");
      sites.forEach(function(site, i){
        site.prevCluster = indicesList.includes(i.toString());
      });
    };

    var resetPreviousClusters = function(){
      sites.forEach(function(site, i){
        site.prevCluster = false;
      });
    }




    var drawPoints = function(){

      var htmlStr = "";
      selectedSitesTree.forEach(function(site, i){
        var numPoints = (site.type == "site")? 1 : site.children.length;
        var screenCoords = screenCoordsRequest.fire(site.worldCoords);
        htmlStr += `<div class="site-point no-select"
                    data-type=${site.type}
                    data-x=${site.worldCoords.x}
                    data-y=${site.worldCoords.y} style=
                    "left: ${screenCoords.x}px;
                     top: ${screenCoords.y}px;
                     width: ${site.radius * 2}px;
                     height: ${site.radius * 2}px;
                     line-height: ${site.radius * 2}px">${numPoints}</div>`

      });
      pointGraphicsContainer.innerHTML = htmlStr;
    }


    var pointGraphicsNodes = document.getElementsByClassName("site-point");
    for (var i = 0; i < pointGraphicsNodes.length; i++){
      var point = pointGraphicsNodes[i];
      var newScreenCoords = screenCoordsRequest.fire({x:point.dataset.x, y:point.dataset.y});
      point.style.left = `${newScreenCoords.x}px`;
      point.style.top = `${newScreenCoords.y}px`;
    }


    /*var panViewportHandler = function(panProperties){
      var currentMapProperties = mapPropertiesRequest.fire();
      var deltaXWorld = currentMapProperties.pixelSize * panProperties.panData.deltaX;
      var deltaYWorld = currentMapProperties.pixelSize * panProperties.panData.deltaY;
      var newXWorld = currentViewportCenter.worldCoords.x - deltaXWorld;
      var newYWorld = currentViewportCenter.worldCoords.y - deltaYWorld;
      var newLocationRectifiedWorld = rectifiedWorldCoordsRequest.fire({x:newXWorld, y:newYWorld});
      var newLocationRectifiedMap = mapCoordsRequest.fire(newLocationRectifiedWorld);
      var deltaXMap = newLocationRectifiedMap.x - currentViewportCenter.mapCoords.x;
      var deltaYMap = newLocationRectifiedMap.y - currentViewportCenter.mapCoords.y;
      setViewportCenter(newLocationRectifiedWorld);
      viewportMoveEvent.fire({deltaX:deltaXMap, deltaY:deltaYMap});
    }*/

    //----------------------------------------------------------------------------




    var refresh = function(){
      currentViewportCenter.mapCoords = mapCoordsRequest.fire(currentViewportCenter.worldCoords);
    }

    var calculateScreenCoords = function(worldCoords){
      var mapCoords = mapCoordsRequest.fire(worldCoords);
      var currentMapProperties = mapPropertiesRequest.fire();
      var mapSizePx = currentMapProperties.mapSizePx;
      var newY = mapCoords.y - currentViewportCenter.mapCoords.y + Math.trunc(viewportDimensionsPx.height / 2);
      var newX = mapCoords.x - currentViewportCenter.mapCoords.x + Math.trunc(viewportDimensionsPx.width / 2);
      newX = (newX > mapSizePx)? newX - mapSizePx : newX;
      newX = (newX < 0) ? newX + mapSizePx : newX;
      return ({x:newX, y:newY});
    }




            /*htmlStr += `<div draggable="false"
                         data-worldx = ${worldCoordsX}
                         data-worldy = ${worldCoordsY}
                         data-worldlength = ${basemapTileSizePx * pixelSize}
                         class='map-image' style="
                         background-image: url(${src});
                         background-repeat: no-repeat;
                         background-size: cover;
                         width: ${basemapTileSizePx}px; height: ${basemapTileSizePx}px;
                         left: ${screenCoordsX}px; top: ${screenCoordsY}px"></div>`;*/


                           /*  var currentMapProperties = mapPropertiesRequest.fire();
                             var pixelSize = currentMapProperties.pixelSize;
                             var viewportOffset = viewportOffsetRequest.fire();
                             var imageNodes = document.getElementsByClassName("map-image");
                             for (var i = 0; i < imageNodes.length; i++){
                               var image = imageNodes[i];
                               var worldX = image.dataset.worldx;
                               var worldY = image.dataset.worldy;
                               var screenCoordsX = worldX / pixelSize - viewportOffset.x;
                               var screenCoordsY = worldY / pixelSize - viewportOffset.y;
                               image.style.left = `${screenCoordsX}px`;
                               image.style.top = `${screenCoordsY}px`;
                               if (moveType == "zoom"){
                                 var worldLength = image.dataset.worldlength;
                                 var sideLength = mapCoordsRequest.fire({x:worldLength, y:worldLength});
                                 image.style.width = `${sideLength.x}px`;
                                 image.style.height = `${sideLength.y}px`;
                               }
                             }*/
