var StartZoomControlsController = function(eventDispatcher, configProperties, model, view){


  //init code ------------------------------------------------------------------

  NewHttpRequest("../modules/web_map/templates/widgets/zoom_controls.html", function(htmlStr){
    eventDispatcher.private.broadcast("zoomControlsHTMLReceived", htmlStr);
  });

  eventDispatcher.private.listen("moduleLoaded && zoomControlsHTMLReceived", function(eventData){
    var htmlStr = eventData["zoomControlsHTMLReceived"];
    view.zoomControls.configure(view.container.node);
    view.zoomControls.load(htmlStr);
  });

  eventDispatcher.private.listen("zoomAnimationStarted", function(){
    view.zoomControls.disable();
  });

  eventDispatcher.private.listen("zoomAnimationEnded", function(){
    view.zoomControls.enable();
  });

}
