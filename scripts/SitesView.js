var SitesView = function(){

  var mapPropertiesRequest = new Event(),
      mapCoordsRequest = new Event(),
      viewportOffsetRequest = new Event();

  //var popup = document.getElementById("popup");
  var pointGraphicsContainer = document.getElementById("point-graphics-container");
  var pointGraphicRadius = 8;
  var selectedSites;
  var selectedSitesTree;

  //local functions ------------------------------------------------------------

  var calculateDistance = function(coords1, coords2){
    var distanceX = coords1.x - coords2.x;
    var distanceY = coords1.y - coords2.y;
    return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  }

  var calculateScreenCoords = function(worldCoords){
    var mapCoords = mapCoordsRequest.fire(worldCoords);
    var viewportOffset = viewportOffsetRequest.fire();
    var currentMapProperties = mapPropertiesRequest.fire();
    var mapSizePx = currentMapProperties.mapSizePx;
    var newX = mapCoords.x - viewportOffset.x;
    var newY = mapCoords.y - viewportOffset.y;
    newX = (newX > mapSizePx)? newX - mapSizePx : newX;
    newX = (newX < 0) ? newX + mapSizePx : newX;
    return ({x:newX, y:newY});
  }

  //event handlers -------------------------------------------------------------

  var drawPoints = function(){

    pointGraphicsContainer.innerHTML = "";

    var currentMapProperties = mapPropertiesRequest.fire();
    var currentPixelSize = currentMapProperties.pixelSize;

    var selectedSitesCopy = [];
    selectedSites.forEach(function(site, i){
      site.radius = pointGraphicRadius;
      site.domNode = null;
      selectedSitesCopy.push(site);
    });

    selectedSitesTree = [];
    var treeIndex = 0;

    while (selectedSitesCopy.length > 0){
      var currentSite = selectedSitesCopy.splice(0, 1)[0];
      var createdCluster = null;

      for (let i = 0; i < selectedSitesCopy.length; i++){
        var nextSite = selectedSitesCopy[i];
        var distance = calculateDistance(currentSite.worldCoords, nextSite.worldCoords);
        var clusterDistanceThreshold = currentPixelSize * (currentSite.radius + nextSite.radius);

        if (distance < clusterDistanceThreshold){
          createdCluster = {
            type: "cluster",
            worldCoords: {x:null, y:null},
            radius: 0,
            domNode: null,
            prevCluster: false,
            children: [],
          };

          if (currentSite.type == "site"){
            createdCluster.children.push(currentSite);
          } else {
            createdCluster.children = createdCluster.children.concat(currentSite.children);
          }
          if (nextSite.type == "site"){
            createdCluster.children.push(nextSite);
          } else {
            createdCluster.children = createdCluster.children.concat(nextSite.children);
          }

          var sumX = 0;
          var sumY = 0;
          createdCluster.children.forEach(function(child, i){
            sumX += child.worldCoords.x;
            sumY += child.worldCoords.y;
            createdCluster.prevCluster = createdCluster.prevCluster || child.prevCluster;
          });
          createdCluster.worldCoords.x = sumX / createdCluster.children.length;
          createdCluster.worldCoords.y = sumY / createdCluster.children.length;

          var maxDist = 0;
          createdCluster.children.forEach(function(child, i){
            var dist = calculateDistance(child.worldCoords, createdCluster.worldCoords);
            if (dist > maxDist){
              maxDist = dist;
            }
          });

          var maxDistPx = Math.round(maxDist / currentPixelSize);
          createdCluster.radius = (maxDistPx < 10)? 10 : maxDistPx;

          selectedSitesCopy.splice(i, 1);
          selectedSitesCopy.push(createdCluster);
          break;
        }
      }
      if (createdCluster == null){

        var screenCoords = calculateScreenCoords(currentSite.worldCoords);
        var numPoints = (currentSite.type == "site")? 1 : currentSite.children.length;
        var prevClusterStr = (currentSite.prevCluster)? "prevCluster" : "";

        var node = document.createElement("div");
        node.className = `site-point ${prevClusterStr} no-select`;
        node.dataset.type = currentSite.type;
        node.dataset.index = treeIndex;
        node.dataset.worldx = currentSite.worldCoords.x;
        node.dataset.worldy = currentSite.worldCoords.y;
        node.dataset.screenx = screenCoords.x;
        node.dataset.screeny = screenCoords.y;
        node.style.left = `${screenCoords.x}px`;
        node.style.top = `${screenCoords.y}px`;
        node.style.width = `${currentSite.radius * 2}px`;
        node.style.height = `${currentSite.radius * 2}px`;
        node.style.lineHeight = `${currentSite.radius * 2}px`;
        node.textContent = numPoints.toString();
        currentSite.domNode = node;

        selectedSitesTree.push(currentSite);
        pointGraphicsContainer.appendChild(node);
        treeIndex++;
      }
    }
  };

  //----------------------------------------------------------------------------

  var panPoints = function(){
    selectedSitesTree.forEach(function(site, i){
      var newScreenCoords = calculateScreenCoords(site.worldCoords);
      site.domNode.style.left = `${newScreenCoords.x}px`;
      site.domNode.style.top = `${newScreenCoords.y}px`;
    });
  };

  //----------------------------------------------------------------------------

  var selectSitesHandler = function(sites){
    selectedSites = sites;
    drawPoints();
  }

  //----------------------------------------------------------------------------
  var flagPreviousClusters = function(index){
    resetPreviousClusters();
    var cluster = selectedSitesTree[index];
    cluster.children.forEach(function(child, i){
      child.prevCluster = true;
    });
  }
  //----------------------------------------------------------------------------

  var resetPreviousClusters = function(){
    selectedSites.forEach(function(site, i){
      site.prevCluster = false;
    });
    selectedSitesTree.forEach(function(site, i){
      site.domNode.classList.remove("prevCluster");
      if (site.type == "cluster"){
        site.children.forEach(function(child, j){
          child.prevCLuster = false;
        });
      }
    });
  }

  var showToolTip = function(node){
  //  var siteIndex = node.dataset.index;


  /*  popup.style.visibility = "visible";
    var x = node.dataset.screenx;
    var y = node.dataset.screeny;
    popup.style.left = `${x-100+1}px`;
    popup.style.top = `${y-67-12}px`;*/

  }

  /*var hideToolTip = function(){
    popup.style.visibility = "hidden";
  }*/

  //public variables -----------------------------------------------------------

  return {
    mapPropertiesRequest: mapPropertiesRequest,
    mapCoordsRequest: mapCoordsRequest,
    viewportOffsetRequest: viewportOffsetRequest,
    panPoints: panPoints,
    selectSitesHandler: selectSitesHandler,
    drawPoints: drawPoints,
    flagPreviousClusters: flagPreviousClusters,
    resetPreviousClusters: resetPreviousClusters,
    showToolTip: showToolTip,
  /*  hideToolTip: hideToolTip*/
  };
}
