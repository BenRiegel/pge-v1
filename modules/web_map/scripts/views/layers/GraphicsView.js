var NewGraphicsView = function(eventDispatcher){


  //private variables ----------------------------------------------------------

  var parentNode,
      rootNode;


  //public attributes and methods ----------------------------------------------

  return {

    configure: function(node){
      parentNode = node;
    },

    addGraphicsLayer: function(layerName){
      var newLayerNode = document.createElement("div");
      newLayerNode.id = layerName;
      rootNode.appendChild(newLayerNode);
    },

    load: function(htmlStr){
      Utils.loadHTMLContent(parentNode, htmlStr);
      rootNode = document.getElementById("graphics-layers-container");
      eventDispatcher.private.broadcast("graphicsReady");
    },


    //don't like these
/*    latLonToWebMercator: function(geoCoords){
      return WebMercator.latLonToWebMercator(geoCoords);
    },


    updateCurrentViewpoint: function(viewpoint){
      currentViewpoint = viewpoint;
    },

    getCurrentViewpoint: function(){
      return currentViewpoint;
    },*/

  };

};
