"use strict";


var StartZoomAnimatorController = function(eventDispatcher, zoomAnimator){

  eventDispatcher.listen("mapMoveRequest", function(mapMoveProperties){
    zoomAnimator.animateMove(mapMoveProperties);
  });

};
