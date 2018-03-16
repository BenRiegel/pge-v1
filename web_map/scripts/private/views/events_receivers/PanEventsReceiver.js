"use strict";


var NewPanEventsReceiver = function(eventDispatcher){


  //private variables ----------------------------------------------------------

  var initialCoords;
  var enabled;
  var basemapNode;


  //private functions ----------------------------------------------------------

  var mouseDownEventHandler = function(evt){
    evt.preventDefault();
    this.style.cursor = "move";
    initialCoords.x = evt.clientX;
    initialCoords.y = evt.clientY;
    this.addEventListener("mousemove", mouseMoveEventHandler);
    eventDispatcher.broadcast("userPanStartRequest");
  }

  var mouseUpEventHandler = function(evt){
    this.style.cursor = "default";
    this.removeEventListener("mousemove", mouseMoveEventHandler);
    eventDispatcher.broadcast("userPanEndRequest");
  }

  var mouseMoveEventHandler = function(evt){
    evt.preventDefault();
    var deltaX = evt.clientX - initialCoords.x;
    var deltaY = evt.clientY - initialCoords.y;
    initialCoords.x = evt.clientX;
    initialCoords.y = evt.clientY;
    //negate so that pan to the right shifts viewpoint left
    eventDispatcher.broadcast("userPanRequest", {x:-deltaX, y:-deltaY});
  }


  //private code block ---------------------------------------------------------

  initialCoords = {x:null, y:null};
  basemapNode = null;
  enabled = false;


  //public properties and methods ----------------------------------------------

  return {

      configure: function(node){
        basemapNode = node;
      },

      disable: function(){
      if (basemapNode && enabled){
        basemapNode.removeEventListener("mousedown", mouseDownEventHandler);
        basemapNode.removeEventListener("mouseup", mouseUpEventHandler);
        enabled = false;
      }
    },

    enable: function(){
      if (basemapNode && !enabled){
        basemapNode.addEventListener("mousedown", mouseDownEventHandler);
        basemapNode.addEventListener("mouseup", mouseUpEventHandler);
        enabled = true;
      }
    },

  };

};
