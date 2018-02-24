"use strict";


var NewZoomEventsReceiver = function(eventDispatcher, zoomDisplay){


  //private variables ----------------------------------------------------------

  var enabled;


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


  //public attributes and methods ----------------------------------------------

  return {

    disable: function(){
      //add something to css?
      if (enabled){
        zoomDisplay.zoomInButtonNode.removeEventListener("click", zoomInEventHandler);
        zoomDisplay.zoomOutButtonNode.removeEventListener("click", zoomOutEventHandler);
        zoomDisplay.zoomHomeButtonNode.removeEventListener("click", zoomHomeEventHandler);
        enabled = false;
      }
    },

    enable: function(){
      if (!enabled){
        zoomDisplay.zoomInButtonNode.addEventListener("click", zoomInEventHandler);
        zoomDisplay.zoomOutButtonNode.addEventListener("click", zoomOutEventHandler);
        zoomDisplay.zoomHomeButtonNode.addEventListener("click", zoomHomeEventHandler);
        enabled = true;
      }
    },
  };

};
