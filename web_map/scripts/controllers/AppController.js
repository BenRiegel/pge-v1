var StartAppController = function(privateEventDispatcher, publicEventDispatcher){

  privateEventDispatcher.listen("currentViewpointInitialized && framesToggled", function(htmlStr){
    publicEventDispatcher.broadcast("graphicsReady");
  }, true);

  privateEventDispatcher.listen("popupReady", function(htmlStr){
    publicEventDispatcher.broadcast("popupReady");
  });


}
