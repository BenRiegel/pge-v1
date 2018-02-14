"use strict";


var NewPopupDisplay = function(eventDispatcher, webMapStates){


  var state;


  //private functions ----------------------------------------------------------

  var position = function(x, y){
    this.rootNode.style.left = `${x}px`;   //change these to translate
    this.rootNode.style.top = `${y}px`;
  }

  //init code ------------------------------------------------------------------

  state = "enabled";


  //public attributes and methods ----------------------------------------------

  return {

    rootNode: null,

    open: function(){
      position.call(this, 300, 50);       //remove this eventually

      //make this a transition?
      this.rootNode.classList.add("visible");
      var animation = NewAnimation();
      animation.addRunFunction(150, (totalProgress) => {
        this.rootNode.style.opacity = `${totalProgress}`;
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
          this.rootNode.classList.remove("visible");
        });
        animation.run();
      }
    },

    load: function(htmlStr){
      Utils.loadHTMLContent(webMapStates.rootNode, htmlStr);
      this.rootNode = document.getElementById("popup-container");
      eventDispatcher.broadcast("popupReady");
    },

    loadContentHTML: function(htmlStr){
      Utils.loadHTMLContent(this.rootNode, htmlStr);
    },

  };

};
