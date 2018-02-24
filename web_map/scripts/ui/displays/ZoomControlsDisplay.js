"use strict";


var NewZoomControlsDisplay = function(eventDispatcher, webMapRootNode){


  //return obj -----------------------------------------------------------------

  return {

    rootNode: null,

    zoomInButtonNode: null,

    zoomOutButtonNode: null,

    zoomeHomeButtonNode: null,

    load: function(htmlStr){
      Utils.loadHTMLContent(webMapRootNode, htmlStr);
      this.rootNode = document.getElementById("zoom-controls-containerService");
      this.zoomInButtonNode = document.getElementById("zoom-in-button");
      this.zoomOutButtonNode = document.getElementById("zoom-out-button");
      this.zoomHomeButtonNode = document.getElementById("zoom-home-button");
      eventDispatcher.broadcast("zoomControlsLoaded");
    },

  };

};
