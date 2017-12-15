//  var viewportProperties = viewportPropertiesRequest.get();
//  var viewportCenter = viewportProperties.center;
//  var viewportDimensions = viewportProperties.dimensions;

/*  imageBufferPxThreshold = {
    x: basemapBufferFactor * viewportDimensions.width,
    y: basemapBufferFactor * viewportDimensions.height
  }*/

/*  var mapProperties = mapPropertiesRequest.get();
  currentTileLevel = Math.trunc(mapProperties.scaleLevel);
  numTiles = Math.pow(2, currentTileLevel);
  var lastTileIndex = numTiles - 1;*/

  /*var viewportExtentWorld = {
    top: viewportCenter.y - (viewportDimensions.height - 1) / 2 * mapProperties.pixelSize,
    right: viewportCenter.x + (viewportDimensions.width - 1) / 2 * mapProperties.pixelSize,
    bottom: viewportCenter.y + (viewportDimensions.height - 1) / 2 * mapProperties.pixelSize,
    left: viewportCenter.x - (viewportDimensions.width - 1) / 2 * mapProperties.pixelSize,
  }

  viewportExtentMap = {
    top: Math.floor(viewportExtentWorld.top / worldModel.circumference * mapProperties.numPixels),
    right: Math.floor(viewportExtentWorld.right / worldModel.circumference * mapProperties.numPixels),
    bottom: Math.floor(viewportExtentWorld.bottom / worldModel.circumference * mapProperties.numPixels),
    left: Math.floor(viewportExtentWorld.left / worldModel.circumference * mapProperties.numPixels),
  }

  viewportExtentMapSpace = {
    top: viewportExtentMap.top,
    right: Math.round(mapProperties.numPixels) - viewportExtentMap.right - 1,
    bottom: Math.round(mapProperties.numPixels) - viewportExtentMap.bottom - 1,
    left: viewportExtentMap.left,
  }*/

/*    var bufferedViewportExtentMap = {
    top: viewportExtentMap.top - basemapBufferFactor * viewportDimensions.height,
    right: viewportExtentMap.right + basemapBufferFactor * viewportDimensions.width,
    bottom: viewportExtentMap.bottom + basemapBufferFactor * viewportDimensions.height,
    left: viewportExtentMap.left - basemapBufferFactor * viewportDimensions.width
  }

  bufferedViewportExtentTile = {
    top: Math.floor(bufferedViewportExtentMap.top / esriBasemapTileSizePx),
    right: Math.floor(bufferedViewportExtentMap.right / esriBasemapTileSizePx),
    bottom: Math.floor(bufferedViewportExtentMap.bottom / esriBasemapTileSizePx),
    left: Math.floor(bufferedViewportExtentMap.left / esriBasemapTileSizePx),
  }
  bufferedViewportExtentTile.top = (bufferedViewportExtentTile.top < 0)? 0 : bufferedViewportExtentTile.top;
  bufferedViewportExtentTile.bottom = (bufferedViewportExtentTile.bottom > lastTileIndex) ? lastTileIndex : bufferedViewportExtentTile.bottom;

  var newBufferedViewportExtentMap = {
    top: bufferedViewportExtentTile.top * esriBasemapTileSizePx,
    right: (bufferedViewportExtentTile.right + 1) * esriBasemapTileSizePx,
    bottom: (bufferedViewportExtentTile.bottom + 1) * esriBasemapTileSizePx,
    left: bufferedViewportExtentTile.left * esriBasemapTileSizePx,
  }

  imageBufferSpace = {
    top: viewportExtentMap.top - newBufferedViewportExtentMap.top,
    right: newBufferedViewportExtentMap.right -  viewportExtentMap.right - 1,
    bottom: newBufferedViewportExtentMap.bottom - viewportExtentMap.bottom - 1,
    left: viewportExtentMap.left - newBufferedViewportExtentMap.left,
  }




/*


    var topLeftCornerWorld = {
      x: center.x - (dimensions.width - 1) / 2 * mapProperties.pixelSize,
      y: center.y - (dimensions.height - 1) / 2 * mapProperties.pixelSize
    }

    var topLeftCornerMap = {
      x: Math.floor(topLeftCornerWorld.x / worldModel.circumference * mapProperties.sizePx),
      y: Math.floor(topLeftCornerWorld.y / worldModel.circumference * mapProperties.sizePx)
    }





    var topLeftCornerTile = {
      x: Math.floor(topLeftCornerMap.x / currentBasemapTileSizePx),
      y: Math.floor(topLeftCornerMap.y / currentBasemapTileSizePx)
    }

    var topLeftCornerTileOffset = {
      x: topLeftCornerMap.x % currentBasemapTileSizePx,
      y: topLeftCornerMap.y % currentBasemapTileSizePx
    }

    //console.log(topLeftCornerTileOffset);

    var neededPxLeft = dimensions.width * basemapBufferFactor - topLeftCornerTileOffset.x;
    var neededPxRight = dimensions.width * (basemapBufferFactor + 1) - (currentBasemapTileSizePx - topLeftCornerTileOffset.x)
    var neededPxTop = dimensions.height * basemapBufferFactor - topLeftCornerTileOffset.y;
    var neededPxBottom = dimensions.height * (basemapBufferFactor + 1) - (currentBasemapTileSizePx - topLeftCornerTileOffset.y)

    var neededTilesLeft = Math.trunc(neededPxLeft / currentBasemapTileSizePx);
    neededTilesLeft = (neededPxLeft % currentBasemapTileSizePx > 0)? neededTilesLeft + 1: neededTilesLeft;
    var neededTilesRight = Math.trunc(neededPxRight / currentBasemapTileSizePx);
    neededTilesRight = (neededPxRight % currentBasemapTileSizePx > 0)? neededTilesRight + 1: neededTilesRight;
    var neededTilesTop = Math.trunc(neededPxTop / currentBasemapTileSizePx);
    neededTilesTop = (neededPxTop % currentBasemapTileSizePx > 0)? neededTilesTop + 1: neededTilesTop;
    var neededTilesBottom = Math.trunc(neededPxBottom / currentBasemapTileSizePx);
    neededTilesBottom = (neededPxBottom % currentBasemapTileSizePx > 0)? neededTilesBottom + 1: neededTilesBottom;

    var tilesExtent = {
      left: topLeftCornerTile.x - neededTilesLeft,
      right: topLeftCornerTile.x + neededTilesRight,
      top: topLeftCornerTile.y - neededTilesTop,
      bottom: topLeftCornerTile.y + neededTilesBottom
    }

    tilesExtent.top = (tilesExtent.top < 0)? 0 : tilesExtent.top;
    tilesExtent.bottom = (tilesExtent.bottom >= numTiles) ? (numTiles - 1) : tilesExtent.bottom;


  //  console.log(tilesExtent);
    var bufferExtent = {
      left: neededTilesLeft * currentBasemapTileSizePx + topLeftCornerTileOffset.x,
      right: neededTilesRight * currentBasemapTileSizePx - dimensions.width + (currentBasemapTileSizePx - topLeftCornerTileOffset.x),
      top: neededTilesTop * currentBasemapTileSizePx + topLeftCornerTileOffset.y,
      bottom: neededTilesBottom * currentBasemapTileSizePx - dimensions.height + (currentBasemapTileSizePx - topLeftCornerTileOffset.y)
    }

  //  console.log(bufferExtent);






    var viewportWidthWorld = dimensions.width * mapProperties.pixelSize;
    var viewportHeightWorld = dimensions.height * mapProperties.pixelSize;
    var bufferWidthWorld = basemapBufferFactor * viewportWidthWorld;
    var bufferHeightWorld = basemapBufferFactor * viewportHeightWorld;

    var viewportOffsetWorld = {
      x: center.x - viewportWidthWorld / 2,
      y: center.y - viewportHeightWorld / 2
    }



    var viewportOffsetMap = {
      x: Math.floor(viewportOffsetWorld.x / worldModel.circumference * mapProperties.sizePx),
      y: Math.floor(viewportOffsetWorld.y / worldModel.circumference * mapProperties.sizePx)
    }

    var bufferedViewportExtent = {
      top: center.y - (viewportHeightWorld + bufferHeightWorld) / 2,
      right: center.x + (viewportWidthWorld + bufferWidthWorld) / 2,
      bottom: center.y + (viewportHeightWorld + bufferHeightWorld) / 2,
      left: center.x - (viewportWidthWorld + bufferWidthWorld) / 2
    }
    var viewportExtentMap = {
      top: Math.floor(bufferedViewportExtent.top / worldModel.circumference * mapProperties.sizePx),
      right: Math.floor(bufferedViewportExtent.right / worldModel.circumference * mapProperties.sizePx),
      bottom: Math.floor(bufferedViewportExtent.bottom / worldModel.circumference * mapProperties.sizePx),
      left: Math.floor(bufferedViewportExtent.left / worldModel.circumference * mapProperties.sizePx)
    }
    var tilesExtent = {
      top: Math.floor(viewportExtentMap.top / currentBasemapTileSizePx),
      right: Math.floor(viewportExtentMap.right / currentBasemapTileSizePx),
      bottom: Math.floor(viewportExtentMap.bottom / currentBasemapTileSizePx),
      left: Math.floor(viewportExtentMap.left / currentBasemapTileSizePx),
    }*/




/*      htmlStr += `<img draggable="false"
                   src = ${src}
                   class='map-image' style="
                   left: ${screenCoordsX}px; top: ${screenCoordsY}px;
                   width: ${currentBasemapTileSizePx}px; height:${currentBasemapTileSizePx}px">`*/




/*  var mapMoveFunction = function(context, totalProgress){
    var newX = context.initX + context.deltaX * totalProgress;
    var newY = context.initY + context.deltaY * totalProgress;
    var newZ = context.initZ + context.deltaZ * totalProgress;
  //  mapMoveEvent.notify({newScaleLevel:newZ, newLocation:{x:newX, y:newY}});
}*/


/*  var numImages = webmap.viewport.calculateNumImagesNeeded();
  var images = document.getElementsByClassName('map-image');
  var tilesArray = webmap.viewport.createBasemapTilesArray();
  for (let i = 0; i < numImages; i++){
    var image = images[i];
    image.style.display = "none";
    image.src = "";
    var tile = tilesArray[i];
    if (tile){
      var src = `https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/${tile.tileLevel}/${tile.yTileIndex}/${tile.xTileIndex}`;
      image.style.left = `${tile.screenCoordsX}px`;
      image.style.top = `${tile.screenCoordsY}px`;
      image.style.width = `${tile.size}px`;
      image.style.height = `${tile.size}px`;
      image.src = src;
      image.style.display = "inline";
    }
  }*/

  var createBasemapImagesHTML = function(){
    var numImages = webmap.viewport.calculateNumImagesNeeded();
    htmlStr = "";
    for (let i = 0; i < numImages; i++){
      htmlStr += "<img draggable='false' class='map-image'>";
    }
    document.getElementById(basemapImagesNodeId).innerHTML = htmlStr;
  }



var calculateNumImagesNeeded = function(){
  var minTileSize = esriBasemapTileSizePx / 2;
  var maxTilesX = Math.floor(dimensions.width / minTileSize) + 1;
  maxTilesX = ((dimensions.width % minTileSize) > 2)? maxTilesX + 1 : maxTilesX;
  var maxTilesY = Math.floor(dimensions.height / minTileSize) + 1;
  maxTilesY = ((dimensions.height % minTileSize) > 2)? maxTilesY + 1 : maxTilesY;
  return maxTilesX * maxTilesY;
}


  var calculateMapCoords = function(worldCoords){
    var x = Math.trunc(worldCoords.x / worldModel.circumference * sizePx);
    var y = Math.trunc(worldCoords.y / worldModel.circumference * sizePx);
    return {x:x, y:y};
  }




var calculateViewportOffset = function(){
  var currentViewportCenterMapCoords = map.calculateMapCoords(viewport.center);
  var x = currentViewportCenterMapCoords.x - (viewport.dimensions.width / 2);   //not sure about this
  var y = currentViewportCenterMapCoords.y - (viewport.dimensions.height / 2);
  return {x:x, y:y};
}




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



                             #pointer{
                               position:absolute;
                               border:0px solid black;
                               overflow:hidden;
                             }

                             #pointer.w{
                               transform: translate(0px, -10px);
                               left:0px;
                               top:50%;
                             }

                             #pointer.e{
                               transform: translate(0px, -10px) rotate(180deg);
                               right:0px;
                               top:50%;
                             }

                             #pointer.n{
                               right:50%;
                               top:0px;
                               transform: translate(10px, 0px) rotate(90deg);
                             }

                             #pointer.s{
                               right:50%;
                               bottom:-22px;
                               transform: translate(10px, 0px) rotate(270deg);
                             }


                             #pointer-arrow{
                               position:relative;
                               left:15px;
                               width:23.58px;
                               height:21.20px;
                               background-color:white;
                               transform: rotate(32.01deg) skewX(-25.99deg);
                               box-shadow: 0px 0px 3px rgba(0,0,0,0.25);
                             }


                             var mapProperties = {  //get rid of this
                               "0" : {scaleLevel:0, pixelSize:156543.03392800014, mapSizePx:256},
                               "1" : {scaleLevel:1, pixelSize:78271.51696399994, mapSizePx:512},
                               "2" : {scaleLevel:2, pixelSize:39135.75848200009, mapSizePx:1024},
                               "3" : {scaleLevel:3, pixelSize:19567.87924099992, mapSizePx:2048},
                               "4" : {scaleLevel:4, pixelSize:9783.93962049996, mapSizePx:4096},
                               "5" : {scaleLevel:5, pixelSize:4891.96981024998, mapSizePx:8192},
                               "6" : {scaleLevel:6, pixelSize:2445.98490512499, mapSizePx:16384},
                               "7" : {scaleLevel:7, pixelSize:1222.992452562495, mapSizePx:32768},
                               "8" : {scaleLevel:8, pixelSize:611.4962262813797, mapSizePx:655536},
                               "9" : {scaleLevel:9, pixelSize:305.74811314055756, mapSizePx:131072},
                               "10" : {scaleLevel:10, pixelSize:152.87405657041106, mapSizePx:262144},
                               "11" : {scaleLevel:11, pixelSize:76.43702828507324, mapSizePx:524288},
                               "12" : {scaleLevel:12, pixelSize:38.21851414253662, mapSizePx:1048576}
                             };







                               var drawBasemap = function(){

                                 basemapMoveData.initViewportCenter.x = webmap.viewport.center.x;
                                 basemapMoveData.initViewportCenter.y = webmap.viewport.center.y;
                                 basemapMoveData.initPixelSize = webmap.map.pixelSize;

                                 var initViewportOffset = webmap.calculateViewportOffset();

                                 var currentTileLevel = Math.round(webmap.map.scaleLevel);
                                 var numTiles = Math.round(webmap.map.sizePx / esriBasemapTileSizePx);

                                 var bufferedViewportHeight = (viewportBufferFactor + 0.5) * webmap.viewport.dimensions.height * webmap.map.pixelSize;
                                 var bufferedViewportWidth = (viewportBufferFactor + 0.5) * webmap.viewport.dimensions.width * webmap.map.pixelSize;

                                 var bufferedViewportExtent = {
                                   top: webmap.viewport.center.y - bufferedViewportHeight,
                                   right: webmap.viewport.center.x + bufferedViewportWidth,
                                   bottom: webmap.viewport.center.y + bufferedViewportHeight,
                                   left: webmap.viewport.center.x - bufferedViewportWidth
                                 }

                                 var tilesExtent = {
                                   top: Math.floor(bufferedViewportExtent.top / (esriBasemapTileSizePx * webmap.map.pixelSize)),
                                   right: Math.floor(bufferedViewportExtent.right / (esriBasemapTileSizePx * webmap.map.pixelSize)),
                                   bottom: Math.floor(bufferedViewportExtent.bottom / (esriBasemapTileSizePx * webmap.map.pixelSize)),
                                   left: Math.floor(bufferedViewportExtent.left / (esriBasemapTileSizePx * webmap.map.pixelSize))
                                 }

                                 var htmlStr = "";
                                 for (var i = tilesExtent.left; i <= tilesExtent.right; i++){
                                   for (var j = tilesExtent.top; j <= tilesExtent.bottom; j++){
                                     if ((j < 0) || (j >= numTiles)){
                                       continue;
                                     }
                                     var yTileIndex = j;
                                     var xTileIndex = i % numTiles;
                                     xTileIndex = (xTileIndex < 0)? xTileIndex + numTiles : xTileIndex;

                                     var worldCoordsX = i * esriBasemapTileSizePx * webmap.map.pixelSize;
                                     var worldCoordsY = j * esriBasemapTileSizePx * webmap.map.pixelSize;
                                     var screenCoordsX = Math.round(i * esriBasemapTileSizePx - initViewportOffset.x);
                                     var screenCoordsY = Math.round(j * esriBasemapTileSizePx - initViewportOffset.y);

                                     var src = `https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/${currentTileLevel}/${yTileIndex}/${xTileIndex}`;

                                     htmlStr += `<img draggable="false"
                                                  src = ${src}
                                                  class='map-image' style="
                                                  left: ${screenCoordsX}px; top: ${screenCoordsY}px">`
                                   }
                                 }
                                 document.getElementById(basemapImagesNodeId).innerHTML = htmlStr;
                               }

                                 var moveBasemap = function(moveProperties){
                                   var mapImagesContainer = document.getElementById("map-images-container");
                                   var currentViewportCenter = {x:webmap.viewport.center.x, y:webmap.viewport.center.y}
                                   var currentPixelSize = webmap.map.pixelSize;
                                   var basemapScale = basemapMoveData.initPixelSize / currentPixelSize;;
                                   var deltaX = currentViewportCenter.x - basemapMoveData.initViewportCenter.x;
                                   var deltaXPx = Math.round(deltaX / basemapMoveData.initPixelSize);
                                   var deltaY = currentViewportCenter.y - basemapMoveData.initViewportCenter.y;
                                   var deltaYPx = Math.round(deltaY / basemapMoveData.initPixelSize);
                                   mapImagesContainer.style.transform = `scale(${basemapScale},${basemapScale}) translate(${-deltaXPx}px, ${-deltaYPx}px)`;
                                 }
