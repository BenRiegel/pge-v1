"use strict";


var NewZoomControlsDisplay = function(eventDispatcher){


  //public properties and methods ----------------------------------------------

  return {

    rootNode: null,

    buttons: {},

    recordElementNodes: function(){
      this.rootNode = document.getElementById("zoom-controls-containerService");
      this.buttons.zoomIn = document.getElementById("zoom-in-button");
      this.buttons.zoomOut = document.getElementById("zoom-out-button");
      this.buttons.zoomHome = document.getElementById("zoom-home-button");
      eventDispatcher.broadcast("zoomElementNodesRecorded", this.buttons);
    },

  };

};
