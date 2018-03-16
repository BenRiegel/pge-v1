"use strict";


var StartAnimationMapMoverServiceController = function(eventDispatcher, animationMapMover){

  eventDispatcher.listen("animationMoveRequest", function(moveRequestProperties){
    animationMapMover.animationMoveRequestHandler(moveRequestProperties);
  });

};
