"use strict";


var NewLocationsView = function(eventDispatcher){

  //private, configurable constants --------------------------------------------

  const sitePointsClassName = "site-point";
  const sitesRadius = 8.5;


  //private functions ----------------------------------------------------------

  var filter = function(newOptionName){
    var graphicsList = this.graphics;
    graphicsList.forEach(function(graphic){
      graphic.model.customAttributes.filtered = !graphic.model.attributes.tags.includes(newOptionName);
      graphic.model.hidden = graphic.model.customAttributes.filtered;
    });
  };

  var assignPrevClusters = function(idList){
    var graphicModels = this.sitesGraphicsLayer.model.graphicModels;
    graphicModels.forEach( (graphic, i) => {
      if (idList.includes(i)){
        var graphicView = this.sitesGraphicsLayer.view.graphicViews[i];
        graphicView.addClass("prev-cluster");
      }
    });
  };

  var clickEventHandler = function(evt){
    var graphicId = evt.target.dataset.id;
    var graphic = this.sitesGraphicsLayer.model.graphicModels[graphicId];
    if (graphic.customAttributes.type == "point"){
      this.currentSelectedSiteAttributes = graphic.attributes;
      eventDispatcher.broadcast("siteClicked", graphic);
    } else {
      assignPrevClusters.call(this, graphic.customAttributes.clusterAttributes.idList);
      eventDispatcher.broadcast("clusterClicked", graphic);
    }
  }

  var getDistance = function(c1, c2){
    return Math.sqrt( (c2.x - c1.x) * (c2.x - c1.x) + (c2.y - c1.y) * (c2.y - c1.y) );
  }

  var sitesLayerPosition = function(webMapStates){

    var mapPixelSize = webMapStates.mapPixelSize;
    var mapPixelNum = webMapStates.mapPixelNum;
    var leftMapCoord = webMapStates.viewpointTopLeftMap.left;
    var topMapCoord = webMapStates.viewpointTopLeftMap.top;

    this.model.graphicModels.forEach(function(graphic){
      graphic.mapCoords.x = graphic.worldCoords.x / mapPixelSize;
      graphic.mapCoords.y = graphic.worldCoords.y / mapPixelSize;
      graphic.hidden = graphic.customAttributes.filtered;
      graphic.customAttributes.type = "point";
      graphic.customAttributes.radius = sitesRadius;
      graphic.customAttributes.clustered = false;
      graphic.customAttributes.clusterAttributes = {
        numPoints: 1,
        newWorldCoords: null,
        coordSet: [graphic.mapCoords],
        idList: [graphic.attributes.id],
      };
      var screenCoordX = graphic.mapCoords.x - leftMapCoord;
      screenCoordX = (screenCoordX < 0) ? screenCoordX + mapPixelNum : screenCoordX;
      screenCoordX = (screenCoordX > mapPixelNum) ? screenCoordX - mapPixelNum : screenCoordX;
      var screenCoordY = graphic.mapCoords.y - topMapCoord;
      graphic.screenCoords.x = screenCoordX;
      graphic.screenCoords.y = screenCoordY;
    });

    for (var i = 0; i < this.model.graphicModels.length; i++){

      var graphic = this.model.graphicModels[i];
      if (graphic.customAttributes.filtered || graphic.customAttributes.clustered){
        continue;
      }
      var done = false;
      var j = 0;
      while (!done){

        var compareGraphic = this.model.graphicModels[j];
        var clusterCreated = false;

        if (i != j && compareGraphic.customAttributes.filtered == false && compareGraphic.customAttributes.clustered == false){
          var distanceX = Math.abs(graphic.mapCoords.x - compareGraphic.mapCoords.x);
          var distanceY = Math.abs(graphic.mapCoords.y - compareGraphic.mapCoords.y);
          var clusterDistanceThreshold = graphic.customAttributes.radius + compareGraphic.customAttributes.radius;

          if (distanceX <= clusterDistanceThreshold && distanceY <= clusterDistanceThreshold){

            clusterCreated = true;
            compareGraphic.customAttributes.clustered = true;
            var combinedCoordSet = graphic.customAttributes.clusterAttributes.coordSet.concat(compareGraphic.customAttributes.clusterAttributes.coordSet);
            var combinedIdList = graphic.customAttributes.clusterAttributes.idList.concat(compareGraphic.customAttributes.clusterAttributes.idList);

            var newNumPoints = combinedCoordSet.length;

            var clusterCoords = {
              x: (compareGraphic.mapCoords.x * compareGraphic.customAttributes.clusterAttributes.numPoints + graphic.mapCoords.x * graphic.customAttributes.clusterAttributes.numPoints)/newNumPoints,
              y: (compareGraphic.mapCoords.y * compareGraphic.customAttributes.clusterAttributes.numPoints + graphic.mapCoords.y * graphic.customAttributes.clusterAttributes.numPoints)/newNumPoints
            }

            var newWorldCoords = {
              x: (compareGraphic.worldCoords.x * compareGraphic.customAttributes.clusterAttributes.numPoints + graphic.worldCoords.x * graphic.customAttributes.clusterAttributes.numPoints)/newNumPoints,
              y: (compareGraphic.worldCoords.y * compareGraphic.customAttributes.clusterAttributes.numPoints + graphic.worldCoords.y * graphic.customAttributes.clusterAttributes.numPoints)/newNumPoints
            }

            var maxDist = 0;
            combinedCoordSet.forEach(function(coords){
              var dist = getDistance(clusterCoords, coords);
              if (dist > maxDist){
                maxDist = dist;
              }
            });

            var newRadius = (maxDist < 10)? 10 : maxDist;
            newRadius = (newRadius > 16)? 16 : newRadius;

            graphic.customAttributes.type = "cluster";
            graphic.mapCoords = clusterCoords;
            graphic.customAttributes.clusterAttributes.newWorldCoords = newWorldCoords;
            graphic.customAttributes.clusterAttributes.numPoints = newNumPoints;
            graphic.customAttributes.clusterAttributes.coordSet = combinedCoordSet;
            graphic.customAttributes.clusterAttributes.idList = combinedIdList;
            graphic.customAttributes.radius = newRadius;
          }
        }

        if (clusterCreated){
          j = 0;
        } else {
          j++;
        }
        if (j == this.model.graphicModels.length){
          done = true;
        }
      }

    }

    this.model.graphicModels.forEach(function(graphic){

      if (graphic.customAttributes.clustered){
        graphic.hidden = true;
      }

      if (graphic.customAttributes.type == "cluster"){
        var screenCoordX = graphic.mapCoords.x - leftMapCoord;
        screenCoordX = (screenCoordX < 0) ? screenCoordX + mapPixelNum : screenCoordX;
        screenCoordX = (screenCoordX > mapPixelNum) ? screenCoordX - mapPixelNum : screenCoordX;
        var screenCoordY = graphic.mapCoords.y - topMapCoord;
        graphic.screenCoords.x = screenCoordX;
        graphic.screenCoords.y = screenCoordY;
      }
    });

    for (var i = 0; i < this.model.graphicModels.length; i++){
      var graphicModel = this.model.graphicModels[i];
      var graphicView = this.view.graphicViews[i];
      graphicView.nodes[0].innerHTML = graphicModel.customAttributes.clusterAttributes.numPoints;
      graphicView.nodes[1].innerHTML = graphicModel.customAttributes.clusterAttributes.numPoints;
      graphicView.setWidth(graphicModel.customAttributes.radius);
    }

  };


  //public properties and methods ----------------------------------------------

  return {

    currentSelectedSiteAttributes: null,

    sitesGraphicsLayer: null,

    clearPrevClusters: function(){
      var graphicViews = this.sitesGraphicsLayer.view.graphicViews;
      graphicViews.forEach(function(view){
        view.removeClass("prev-cluster");
      });
    },

    initSitesGraphicsLayer: function(){
      this.sitesGraphicsLayer = NewGraphicsLayer("sites-graphics-layer");
      this.sitesGraphicsLayer.addEventListener("click", clickEventHandler.bind(this));
      this.sitesGraphicsLayer.filter = filter.bind(this.sitesGraphicsLayer);
      this.sitesGraphicsLayer.model.positionGraphicsDefault = sitesLayerPosition.bind(this.sitesGraphicsLayer);
      eventDispatcher.broadcast("graphicsLayerInitialized");
    },

    loadProjectsGraphics: function(projects){
      var graphicsList = [];
      projects.forEach( (project, i) => {
        var graphic = NewGraphic(project.geoCoords);
        graphic.setId(i);
        graphic.addClass(sitePointsClassName);
        graphic.setWidth(sitesRadius);
        graphic.model.attributes = project;
        graphic.model.customAttributes = {
          type: "point",
          radius: sitesRadius,
          filtered: false,
          clustered: false,
          clusterAttributes: null,
        };
        graphicsList.push(graphic);
      });
      this.sitesGraphicsLayer.addGraphics(graphicsList);
      eventDispatcher.broadcast("pointGraphicsLoaded", this.sitesGraphicsLayer);
    },

  };

};
