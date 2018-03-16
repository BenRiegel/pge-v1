"use strict";


var NewPopupDisplay = function(eventDispatcher){


  //private variables ----------------------------------------------------------

  var state;
  var webMapDimensionsPx;


  //private functions ----------------------------------------------------------

  var position = function(){
    var rect = this.rootNode.getBoundingClientRect();
    var leftCoord = webMapDimensionsPx.width / 2 - 465;
    var topCoord = webMapDimensionsPx.height / 2 - rect.height / 2;
    this.rootNode.style.left = `${leftCoord}px`;
    this.rootNode.style.top = `${topCoord}px`;
  }


  //private code block ---------------------------------------------------------

  state = "enabled";


  //public properties and methods ----------------------------------------------

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

    configure: function(dimensionsPx){
      webMapDimensionsPx = dimensionsPx;
    },

    readyFramework: function(){
      this.rootNode = document.getElementById("popup-container");
      eventDispatcher.broadcast("popupReady");
    },

    loadContentHTML: function(htmlStr){
      var tempNode = document.createElement("div");
      tempNode.innerHTML = htmlStr;
      while (tempNode.firstChild) {
        this.rootNode.appendChild(tempNode.firstChild);
      }
    },

  };

};
