"use strict";


var modifyDefaultMapGraphics = function(graphics){

  const sitesGraphicsLayerName = "sites-graphics-layer";
  const clustersGraphicsLayerName = "clusters-graphics-layer";
  const sitePointRadius = 8;



  var loadPointGraphics = function(projects){
    var sitesGraphicsLayerNode = document.getElementById(sitesGraphicsLayerName);
    var htmlStr = "";
    projects.forEach( (project) => {
      var worldCoords = this.latLonToWebMercator(project.geoCoords);
      htmlStr += `<div
                   class="site-point"
                   data-id="${project.id}"
                   data-xcoord="${worldCoords.x}"
                   data-ycoord="${worldCoords.y}"></div>`
    });
    sitesGraphicsLayerNode.innerHTML = htmlStr;
    eventDispatcher.broadcast("pointGraphicsLoaded");
  };


  var filterPointGraphics = function(projects, tagName){
    var siteGraphics = document.querySelectorAll(".site-point");
    siteGraphics.forEach(function(siteGraphic){
      var id = siteGraphic.dataset.id;
      var project = projects[id];
      if (project.tags.includes(tagName)){
        siteGraphic.style.display = "block";
      } else {
        siteGraphic.style.display = "none";
      }
    });
  };

  var draw = function(viewpoint){
    console.log(viewpoint);
    var viewpoint = this.getCurrentViewpoint();
    scaleProperties = ScaleModel.getProperties(viewpoint.scale);
    var heightPx = 905 / 2 - 0.5;
    var widthPx = 512 / 2 - 0.5;
    var leftWorldCoord = viewpoint.center.x - widthPx * scaleProperties.pixelSize;
    var topWorldCoord = viewpoint.center.y - heightPx * scaleProperties.pixelSize;
    var leftMapCoord = Math.floor(leftWorldCoord / scaleProperties.pixelSize);
    var topMapCoord = Math.floor(topWorldCoord / scaleProperties.pixelSize);
    console.log(leftMapCoord, topMapCoord);


    var siteGraphics = document.querySelectorAll(".site-point");
    siteGraphics.forEach(function(siteGraphic){

    });
  };


  var loadGraphicsLayers = function(){
    this.addGraphicsLayer(sitesGraphicsLayerName);
    this.addGraphicsLayer(clustersGraphicsLayerName);
  };


  graphics.loadGraphicsLayers = loadGraphicsLayers.bind(graphics);
  graphics.loadPointGraphics = loadPointGraphics.bind(graphics);
  graphics.filterPointGraphics = filterPointGraphics.bind(graphics);
  graphics.draw = draw.bind(graphics);

};
