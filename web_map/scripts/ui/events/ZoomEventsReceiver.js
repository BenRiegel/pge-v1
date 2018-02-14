"use strict";


var NewZoomEventsReceiver = function(eventDispatcher, zoomDisplay){


  //private functions ----------------------------------------------------------

  var zoomInEventHandler = function(){
    eventDispatcher.broadcast("mapMoveRequest", {type:"zoom-in"});
  };

  var zoomOutEventHandler = function(){
    eventDispatcher.broadcast("mapMoveRequest", {type:"zoom-out"});
  };

  var zoomHomeEventHandler = function(){
    eventDispatcher.broadcast("mapMoveRequest", {type:"zoom-home"});
  };


  //public attributes and methods ----------------------------------------------

  return {

    disable: function(){
      //add something to css?
      zoomDisplay.zoomInButtonNode.removeEventListener("click", zoomInEventHandler);
      zoomDisplay.zoomOutButtonNode.removeEventListener("click", zoomOutEventHandler);
      zoomDisplay.zoomHomeButtonNode.removeEventListener("click", zoomHomeEventHandler);
    },

    enable: function(){
      zoomDisplay.zoomInButtonNode.addEventListener("click", zoomInEventHandler);
      zoomDisplay.zoomOutButtonNode.addEventListener("click", zoomOutEventHandler);
      zoomDisplay.zoomHomeButtonNode.addEventListener("click", zoomHomeEventHandler);
    },

  };

};
