"use strict";


var StartUserPanMapMoverServiceController = function(eventDispatcher, userPanAnimator){

  eventDispatcher.listen("userPanStartRequest", function(){
    userPanAnimator.startRequestHandler();
  });

  eventDispatcher.listen("userPanRequest", function(userPanRequestProperties){
    userPanAnimator.panRequestHandler(userPanRequestProperties);
  });

  eventDispatcher.listen("userPanEndRequest", function(){
    userPanAnimator.endRequestHandler();
  });

  eventDispatcher.listen("frameTogglerReadyForNewFrame", function(){
    userPanAnimator.newFrame();
  });

  eventDispatcher.listen("userPanEnded", function(){
    userPanAnimator.end();
  });

};
