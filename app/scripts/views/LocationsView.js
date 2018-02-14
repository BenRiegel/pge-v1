"use strict";


var NewLocationsView = function(eventDispatcher){


  //private, configurable constants --------------------------------------------

  const sitePointsClassName = "site-point";
  const sitesRadius = 8.5;


  //private functions ----------------------------------------------------------

  var eventHandler = function(evt){
    eventDispatcher.broadcast("sitesGraphicsLayerClicked", evt.target.dataset.id);  //this needs to be changed
  }

  var filter = function(newOptionName){
    this.graphics.forEach(function(graphic){
      graphic.filtered = !graphic.attributes.tags.includes(newOptionName);
      graphic.hidden = graphic.filtered;
    });
    this.refresh();
  };

  var getDistance = function(c1, c2){
    return Math.sqrt( (c2.x - c1.x) * (c2.x - c1.x) + (c2.y - c1.y) * (c2.y - c1.y) );
  }

  var sitesPosition = function(mapProperties, leftMapCoord, topMapCoord){

    this.graphics.forEach(function(graphic){
      graphic.numPoints = 1;
      graphic.radius = sitesRadius;
      graphic.type = "point";
      graphic.coordSet = [graphic.mapCoords];
      graphic.hidden = graphic.filtered;
      graphic.clustered = false;
      graphic.mapCoords.x = graphic.worldCoords.x / mapProperties.pixelSize;
      graphic.mapCoords.y = graphic.worldCoords.y / mapProperties.pixelSize;
      var screenCoordX = graphic.mapCoords.x - leftMapCoord;
      screenCoordX = (screenCoordX < 0) ? screenCoordX + mapProperties.numPixels : screenCoordX;
      var screenCoordY = graphic.mapCoords.y - topMapCoord;
      graphic.screenCoords.x = screenCoordX;
      graphic.screenCoords.y = screenCoordY;
    });

    for (var i = 0; i < this.graphics.length; i++){

      var graphic = this.graphics[i];
      if (graphic.filtered || graphic.clustered){
        continue;
      }
      var done = false;
      var j = 0;
      while (!done){

        var compareGraphic = this.graphics[j];
        var clusterCreated = false;

        if (i != j && compareGraphic.filtered == false && compareGraphic.clustered == false){
          var distanceX = Math.abs(graphic.mapCoords.x - compareGraphic.mapCoords.x);
          var distanceY = Math.abs(graphic.mapCoords.y - compareGraphic.mapCoords.y);
          var clusterDistanceThreshold = graphic.radius + compareGraphic.radius;

          if (distanceX <= clusterDistanceThreshold && distanceY <= clusterDistanceThreshold){

            clusterCreated = true;
            compareGraphic.clustered = true;
            var combinedCoordSet = graphic.coordSet.concat(compareGraphic.coordSet);
            var newNumPoints = combinedCoordSet.length;

            var clusterCoords = {
              x: (compareGraphic.mapCoords.x * compareGraphic.numPoints + graphic.mapCoords.x * graphic.numPoints)/newNumPoints,
              y: (compareGraphic.mapCoords.y * compareGraphic.numPoints + graphic.mapCoords.y * graphic.numPoints)/newNumPoints
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

            graphic.type = "cluster";
            graphic.mapCoords = clusterCoords;
            graphic.numPoints = newNumPoints;
            graphic.coordSet = combinedCoordSet;
            graphic.radius = newRadius;
          }
        }

        if (clusterCreated){
          j = 0;
        } else {
          j++;
        }
        if (j == this.graphics.length){
          done = true;
        }
      }

    }

    this.graphics.forEach(function(graphic){

      if (graphic.clustered){
        graphic.hidden = true;
      }

      if (graphic.type == "cluster"){
        var screenCoordX = graphic.mapCoords.x - leftMapCoord;
        screenCoordX = (screenCoordX < 0) ? screenCoordX + mapProperties.numPixels : screenCoordX;
        var screenCoordY = graphic.mapCoords.y - topMapCoord;
        graphic.screenCoords.x = screenCoordX;
        graphic.screenCoords.y = screenCoordY;
      }

      graphic.nodes[0].innerHTML = graphic.numPoints;
      graphic.nodes[1].innerHTML = graphic.numPoints;
      graphic.setWidth(graphic.radius);
    });


  };


  //public attributes and methods ----------------------------------------------

  return {

    sitesGraphicsLayer: null,

    initSitesGraphicsLayer: function(graphicsLayer){
      this.sitesGraphicsLayer = graphicsLayer;
      this.sitesGraphicsLayer.hide();
      this.sitesGraphicsLayer.addEventListener("click", eventHandler);
      this.sitesGraphicsLayer.filter = filter.bind(this.sitesGraphicsLayer);
      this.sitesGraphicsLayer.position = sitesPosition.bind(this.sitesGraphicsLayer);
      eventDispatcher.broadcast("graphicsLayerInitialized");
    },

    loadProjectsGraphics: function(projects){
      var graphicsList = [];
      projects.forEach((project) => {
        var graphic = NewGraphic(project.geoCoords, project.id, sitePointsClassName);
        graphic.attributes = project;
        graphic.filtered = false;
        graphic.clustered = false;
        graphic.mapCoords = {x:null, y:null};
        graphic.numPoints = 1;
        graphic.radius = sitesRadius;
        graphic.type = "point";
        graphic.coordSet = [graphic.mapCoords];
        graphicsList.push(graphic);
      });
      this.sitesGraphicsLayer.addGraphics(graphicsList);
      eventDispatcher.broadcast("pointGraphicsLoaded");
    },

  };

};
