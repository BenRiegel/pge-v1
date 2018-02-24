var StartAppController = function(privateEventDispatcher, publicEventDispatcher){

  privateEventDispatcher.listen("basemapToggleFramesRequestInitial && graphicsReady", function(htmlStr){
    publicEventDispatcher.broadcast("graphicsReady");
  }, true);

  privateEventDispatcher.listen("popupReady", function(htmlStr){
    publicEventDispatcher.broadcast("popupReady");
  });

  privateEventDispatcher.listen("popupCloseComplete", function(htmlStr){
    publicEventDispatcher.broadcast("popupCloseComplete");
  });

  privateEventDispatcher.listen("animationMoveRequest && animationMoveEnded", function(eventData){
    var moveType = eventData["animationMoveRequest"].type;
    if (moveType == "pan-to"){
      publicEventDispatcher.broadcast("panToAnimationComplete");
    } else if (moveType == "zoom-to"){
      publicEventDispatcher.broadcast("zoomToAnimationComplete");
    }
  }, true);

  privateEventDispatcher.listen("userPanStarted", function(){
    publicEventDispatcher.broadcast("userPanStarted");
  });

  privateEventDispatcher.listen("animationMoveStarted", function(){
    publicEventDispatcher.broadcast("animationMoveStarted");
  });

};
