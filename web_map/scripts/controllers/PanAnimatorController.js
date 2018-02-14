"use strict";


var StartPanAnimatorController = function(eventDispatcher, panAnimator){


  eventDispatcher.listen("panStartRequest", function(){
    panAnimator.start();
  });

  eventDispatcher.listen("panRequest", function(panRequestProperties){
    panAnimator.pan(panRequestProperties);
  });

  eventDispatcher.listen("panEndRequest", function(){
    panAnimator.end();
  });

};
