"use strict";


var NewLayerToggler = function(eventDispatcher, basemapDisplay, graphicsDisplay, panAnimator, zoomAnimator){


  //private variables ----------------------------------------------------------

  var animationSource;
  var animating = false;
  var listening = false;
  var newFramesDrawingStarted = false;
  var newFramesDrawingCompleted = false;


  //private functions ----------------------------------------------------------

  var listen = function(){

    if (newFramesDrawingCompleted){
      basemapDisplay.toggleFrames();
      graphicsDisplay.toggleFrames();
      newFramesDrawingCompleted = false;
      newFramesDrawingStarted = false;
      listening = animating;
      if (animating == false){
        eventDispatcher.broadcast("finalAnimationFrameToggled");
      }
    }

    if (animating && newFramesDrawingStarted == false){
      if (animationSource == "user"){
        panAnimator.cycle();
      } else {
        zoomAnimator.cycle();
      }
    }

    if (listening){
      requestAnimationFrame(function(){
        listen();
      });
    }
  };


  //public objects and methods -------------------------------------------------

  return {

    notifyDrawingStarted: function(){
      newFramesDrawingStarted = true;
      if (listening == false){
        listening = true;
        requestAnimationFrame(function(){
          listen();
        });
      }
    },

    notifyDrawingCompleted: function(){
      newFramesDrawingCompleted = true;
    },

    start: function(source){
      animationSource = source;
      animating = true;
      listening = true;
      requestAnimationFrame(function(){
        listen();
      });
    },

    stop: function(){
      animating = false;
      if (newFramesDrawingStarted == false){
        listening = false;
        eventDispatcher.broadcast("finalAnimationFrameToggled");
      }
    },

  };

};
