var NewAppController = function(eventDispatcher){


  window.addEventListener("load", function(){
    console.log("dom ready");
    eventDispatcher.broadcast("domReady");
  });

};
