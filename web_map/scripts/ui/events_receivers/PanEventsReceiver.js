"use strict";


var NewPanEventsReceiver = function(eventDispatcher, basemapDisplay){


  //private variables ----------------------------------------------------------

  var initialCoords;
  var enabled;


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
  enabled = false;


  //public attributes and methods ----------------------------------------------

  return {

    disable: function(){
      if (enabled){
        basemapDisplay.rootNode.removeEventListener("mousedown", mouseDownEventHandler);
        basemapDisplay.rootNode.removeEventListener("mouseup", mouseUpEventHandler);
        enabled = false;
      }
    },

    enable: function(){
      if (!enabled){
        basemapDisplay.rootNode.addEventListener("mousedown", mouseDownEventHandler);
        basemapDisplay.rootNode.addEventListener("mouseup", mouseUpEventHandler);
        enabled = true;
      }
    },

  };

};
