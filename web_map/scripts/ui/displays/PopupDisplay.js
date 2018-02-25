"use strict";


var NewPopupDisplay = function(eventDispatcher, webMapRootNode, webMapDimensionsPx){


  var state;


  //private functions ----------------------------------------------------------

  var position = function(){
    var rect = this.rootNode.getBoundingClientRect();
    var leftCoord = webMapDimensionsPx.width / 2 - 465;
    var topCoord = webMapDimensionsPx.height / 2 - rect.height / 2;
    this.rootNode.style.left = `${leftCoord}px`;
    this.rootNode.style.top = `${topCoord}px`;
  }


  //init code ------------------------------------------------------------------

  state = "enabled";


  //public attributes and methods ----------------------------------------------

  return {

    rootNode: null,

    isOpen: false,

    open: function(){
      position.call(this);
      this.rootNode.classList.add("visible");
      var animation = NewAnimation();
      animation.addRunFunction(150, (totalProgress) => {
        this.rootNode.style.opacity = `${totalProgress}`;
      });
      animation.setCallbackFunction( () => {
        this.isOpen = true;
      });
      animation.run();
    },

    close: function(){
      if (state == "enabled"){
        var animation = NewAnimation();
        animation.addRunFunction(150, (totalProgress) => {
          this.rootNode.style.opacity = `${1 - totalProgress}`;
        });
        animation.setCallbackFunction( () => {
          this.isOpen = false;
          this.rootNode.classList.remove("visible");
          eventDispatcher.broadcast("popupCloseComplete");
        });
        animation.run();
      }
    },

    hide: function(){
      this.isOpen = false;
      this.rootNode.classList.remove("visible");
    },

    load: function(htmlStr){
      Utils.loadHTMLContent(webMapRootNode, htmlStr);
      this.rootNode = document.getElementById("popup-container");
      eventDispatcher.broadcast("popupReady");
    },

    loadContentHTML: function(htmlStr){
      Utils.loadHTMLContent(this.rootNode, htmlStr);
    },

  };

};
