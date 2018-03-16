"use strict";


var NewBasemapTileView = function(){

  //private variables ----------------------------------------------------------

  var imageNodes;


  //private functions ----------------------------------------------------------

  var newImageNode = function(){
    var newImage = new Image();
    newImage.draggable = false;
    newImage.classList.add("map-image");
    newImage.classList.add("no-highlight");
    return newImage;
  }


  //private code block ---------------------------------------------------------

  imageNodes = [];
  imageNodes[0] = newImageNode();
  imageNodes[1] = newImageNode();


  //public properties and methods ----------------------------------------------

  return {

    imageNodes: imageNodes,

    draw: function(basemapTileModel, nodeIndex){
      var image = this.imageNodes[nodeIndex];
      if (!basemapTileModel.valid || !basemapTileModel.visible){
        image.style.opacity = "0";
        return;
      }
      if (image.style.opacity == "0"){
        image.style.opacity = "1";
      }
      var leftScreenCoord = Math.floor(basemapTileModel.leftScreenCoord);
      var topScreenCoord = Math.floor(basemapTileModel.topScreenCoord);
      var scaleFactor = basemapTileModel.scaleFactor;
      var transformStr = `translate(${leftScreenCoord}px, ${topScreenCoord}px) `;
      image.style.transform = transformStr + `scale(${scaleFactor}, ${scaleFactor}`;
      if (image.src != basemapTileModel.src){
        image.src = basemapTileModel.src;
      }
    },

  };

};
