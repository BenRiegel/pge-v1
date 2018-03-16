"use strict";


var NewZoomEventsReceiver = function(eventDispatcher){


  //private variables ----------------------------------------------------------

  var enabled;
  var zoomControlButtons;


  //private functions ----------------------------------------------------------

  var zoomInEventHandler = function(){
    eventDispatcher.broadcast("animationMoveRequest", {type:"zoom-in"});
  };

  var zoomOutEventHandler = function(){
    eventDispatcher.broadcast("animationMoveRequest", {type:"zoom-out"});
  };

  var zoomHomeEventHandler = function(){
    eventDispatcher.broadcast("animationMoveRequest", {type:"zoom-home"});
  };

  //private code block ---------------------------------------------------------

  enabled = false;
  zoomControlButtons = null;


  //public properties and methods ----------------------------------------------

  return {

    configure: function(buttons){
      zoomControlButtons = buttons;
    },

    disable: function(){
      if (zoomControlButtons && enabled){
        zoomControlButtons.zoomIn.removeEventListener("click", zoomInEventHandler);
        zoomControlButtons.zoomOut.removeEventListener("click", zoomOutEventHandler);
        zoomControlButtons.zoomHome.removeEventListener("click", zoomHomeEventHandler);
        enabled = false;
      }
    },

    enable: function(){
      if (zoomControlButtons && !enabled){
        zoomControlButtons.zoomIn.addEventListener("click", zoomInEventHandler);
        zoomControlButtons.zoomOut.addEventListener("click", zoomOutEventHandler);
        zoomControlButtons.zoomHome.addEventListener("click", zoomHomeEventHandler);
        enabled = true;
      }
    },
  };

};
