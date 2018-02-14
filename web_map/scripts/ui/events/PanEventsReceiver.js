"use strict";


var NewPanEventsReceiver = function(eventDispatcher, basemapDisplay){


  //private variables ----------------------------------------------------------

  var initialCoords;


  //private functions ----------------------------------------------------------

  var mouseDownEventHandler = function(evt){
    evt.preventDefault();
    this.style.cursor = "move";
    initialCoords.x = evt.clientX;
    initialCoords.y = evt.clientY;
    this.addEventListener("mousemove", mouseMoveEventHandler);
    eventDispatcher.broadcast("panStartRequest");
  }

  var mouseUpEventHandler = function(evt){
    this.style.cursor = "default";
    this.removeEventListener("mousemove", mouseMoveEventHandler);
    eventDispatcher.broadcast("panEndRequest");
  }

  var mouseMoveEventHandler = function(evt){
    evt.preventDefault();
    var deltaX = evt.clientX - initialCoords.x;
    var deltaY = evt.clientY - initialCoords.y;
    initialCoords.x = evt.clientX;
    initialCoords.y = evt.clientY;
    eventDispatcher.broadcast("panRequest", {x:-deltaX, y:-deltaY});
    //negate so that pan to the right shifts viewpoint left
  }


  //code block -----------------------------------------------------------------

  initialCoords = {x:null, y:null};


  //public attributes and methods ----------------------------------------------

  return {

    disable: function(){
      basemapDisplay.rootNode.removeEventListener("mousedown", mouseDownEventHandler);
      basemapDisplay.rootNode.removeEventListener("mouseup", mouseUpEventHandler);
    },

    enable: function(){
      basemapDisplay.rootNode.addEventListener("mousedown", mouseDownEventHandler);
      basemapDisplay.rootNode.addEventListener("mouseup", mouseUpEventHandler);
    },

  };

};
