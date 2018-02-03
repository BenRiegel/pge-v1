var StartPopupController = function(eventDispatcher, configProperties, model, view){


  //init code ------------------------------------------------------------------

  NewHttpRequest("../modules/web_map/templates/widgets/popup.html", function(htmlStr){
    eventDispatcher.private.broadcast("popupHTMLReceived", htmlStr);
  });

  eventDispatcher.private.listen("moduleLoaded && popupHTMLReceived", function(eventData){
    var htmlStr = eventData["popupHTMLReceived"];
    view.popup.configure(view.container.node);
    view.popup.load(htmlStr);
  });

}
