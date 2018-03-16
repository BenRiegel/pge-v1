var StartAppController = function(eventDispatcher){

  eventDispatcher.private.listen("initialBasemapDisplayEventStarted && graphicsFrameworkReady", function(htmlStr){
    eventDispatcher.public.broadcast("graphicsReady");
  }, true);

  eventDispatcher.private.listen("popupReady", function(htmlStr){
    eventDispatcher.public.broadcast("popupReady");
  });

  eventDispatcher.private.listen("popupCloseComplete", function(htmlStr){
    eventDispatcher.public.broadcast("popupCloseComplete");
  });

  eventDispatcher.private.listen("animationMoveRequest && animationMoveEnded", function(eventData){
    var moveType = eventData["animationMoveRequest"].type;
    if (moveType == "pan-to"){
      eventDispatcher.public.broadcast("panToAnimationComplete");
    } else if (moveType == "zoom-to"){
      eventDispatcher.public.broadcast("zoomToAnimationComplete");
    }
  }, true);

  eventDispatcher.private.listen("userPanStarted", function(){
    eventDispatcher.public.broadcast("userPanStarted");
  });

  eventDispatcher.private.listen("animationMoveStarted", function(){
    eventDispatcher.public.broadcast("animationMoveStarted");
  });

};
