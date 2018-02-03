var StartGraphicsController = function(eventDispatcher, configProperties, model, view){


  //init code ------------------------------------------------------------------

  NewHttpRequest("../modules/web_map/templates/layers/graphics.html", function(htmlStr){
    eventDispatcher.private.broadcast("graphicsHTMLReceived", htmlStr);
  });

  eventDispatcher.private.listen("moduleLoaded && graphicsHTMLReceived", function(eventData){
    var htmlStr = eventData["graphicsHTMLReceived"];
    view.graphics.configure(view.container.node);
    view.graphics.load(htmlStr);
  });

}
