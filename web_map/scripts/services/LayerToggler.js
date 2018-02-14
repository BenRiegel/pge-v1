"use strict";


var NewLayerToggler = function(eventDispatcher, basemapDisplay, graphicsDisplay, panAnimator, zoomAnimator){

  var animationSource;
  var animating = false;
  var listening = false;
  var newFramesDrawingStarted = false;
  var newFramesDrawingCompleted = false;

  var startTime = new Date().getTime();


  var logEvent = function(desc){
    var timeStamp = new Date().getTime();
    console.log(desc, (timeStamp - startTime));
  }


  //private functions ----------------------------------------------------------

  var listen = function(){

    if (animating && newFramesDrawingStarted == false){
      if (animationSource == "user"){
        panAnimator.cycle();
      } else {
        zoomAnimator.cycle();
      }
    }
    if (newFramesDrawingCompleted){
      basemapDisplay.toggleFrames();
      graphicsDisplay.toggleFrames();
      newFramesDrawingCompleted = false;
      newFramesDrawingStarted = false;
      listening = animating;
    }

    if (listening){
  //    logEvent("requesting new listening cycle");
      requestAnimationFrame(function(){
        listen();
      });
    }
  };



  return {

    notifyDrawingStarted: function(){
  //    logEvent("notified that drawing started");
      newFramesDrawingStarted = true;
      if (listening == false){
    //    logEvent("starting to listen");
        listening = true;
        requestAnimationFrame(function(){
          listen();
        });
      }
    },

    notifyDrawingCompleted: function(){
  //    logEvent("notified that drawing completed");
      newFramesDrawingCompleted = true;
    },

    start: function(source){
    //  logEvent("starting layer toggler");
      animationSource = source;
      animating = true;
      listening = true;
      requestAnimationFrame(function(){
        listen();
      });

    },

    stop: function(){
    //  logEvent("stopping");
      animating = false;
      if (newFramesDrawingStarted == false){
        listening = false;
      }
    },

  };

};
