var NewPopupView = function(eventDispatcher){


  //private variables ----------------------------------------------------------

  var parentNode,
      rootNode;


  //private functions ----------------------------------------------------------

  var position = function(x, y){
    node.style.left = `${x}px`;   //change these to translate
    node.style.top = `${y}px`;
  }


  //public attributes and methods ----------------------------------------------

  return {

    configure: function(node){
      parentNode = node;
    },

    open: function(){
      position.call(this, 300, 50);       //remove this eventually
      rootNode.classList.add("visible");
      var animation = NewAnimation();
      animation.addRunFunction(250, (totalProgress) => {
        rootNode.style.opacity = `${totalProgress}`;
      });
      animation.run();
    },

    close: function(){
      var animation = NewAnimation();
      animation.addRunFunction(250, (totalProgress) => {
        rootNode.style.opacity = `${1 - totalProgress}`;
      });
      animation.setCallbackFunction( () => {
        rootNode.classList.remove("visible");
      });
      animation.run();
    },

    load: function(htmlStr){
      Utils.loadHTMLContent(parentNode, htmlStr);
      rootNode = document.getElementById("popup-container");
      eventDispatcher.private.broadcast("popupReady");
    },

    loadHTMLContent: function(htmlStr){
      var tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlStr;
      while (tempDiv.firstChild) {
        rootNode.appendChild(tempDiv.firstChild);
      }
    },

  };

};
