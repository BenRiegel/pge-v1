var NewZoomControlsView = function(eventDispatcher){


  //private, configurable constants --------------------------------------------

  const zoomInOutIncrement = 1;


  //private variables ----------------------------------------------------------

  var state;
  var parentNode,
      rootNode;


  //init code ------------------------------------------------------------------

  state = "enabled";


  //return obj -----------------------------------------------------------------

  return {

    configure: function(node){
      parentNode = node;
    },

    disable: function(){
      state = "disabled";
    },

    enable: function(){
      state = "enabled";
    },

    load: function(htmlStr){
      Utils.loadHTMLContent(parentNode, htmlStr);
      rootNode = document.getElementById("zoom-controls-container");
      document.getElementById("zoom-in-button").addEventListener("click", function(evt){
        if (state == "enabled"){
          eventDispatcher.private.broadcast("zoomRequest", {type:"in", increment:zoomInOutIncrement});
        }
      });
      document.getElementById("zoom-out-button").addEventListener("click", function(evt){
        if (state == "enabled"){
          eventDispatcher.private.broadcast("zoomRequest", {type:"out", increment:zoomInOutIncrement});
        }
      });
      document.getElementById("zoom-home-button").addEventListener("click", function(evt){
        if (state == "enabled"){
          eventDispatcher.private.broadcast("zoomRequest", {type:"home"});
        }
      });
      eventDispatcher.private.broadcast("zoomControlsReady");
    },

  };

};
