"use strict";


var NewZoomControlsDisplay = function(eventDispatcher, webMapStates){


  //return obj -----------------------------------------------------------------

  return {

    rootNode: null,

    zoomInButtonNode: null,

    zoomOutButtonNode: null,

    zoomeHomeButtonNode: null,

    load: function(htmlStr){
      Utils.loadHTMLContent(webMapStates.rootNode, htmlStr);
      this.rootNode = document.getElementById("zoom-controls-container");
      this.zoomInButtonNode = document.getElementById("zoom-in-button");
      this.zoomOutButtonNode = document.getElementById("zoom-out-button");
      this.zoomHomeButtonNode = document.getElementById("zoom-home-button");
      eventDispatcher.broadcast("zoomControlsLoaded");
    },

  };

};
