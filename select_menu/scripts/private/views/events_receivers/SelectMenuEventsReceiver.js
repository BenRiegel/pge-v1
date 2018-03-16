"use strict";


var NewSelectMenuEventsReceiver = function(eventDispatcher, selectMenuDisplay){

  //private functions ----------------------------------------------------------

  var getClickedOptionName = function(initNode){
    var currentNode = initNode;
    while (currentNode){
      if (currentNode.classList.contains("option")){
        return currentNode.dataset.name;
      }
      currentNode = currentNode.parentNode;
    }
    return null;
  };

  var containerClickEventHandler = function(evt){
    var clickedOptionName = getClickedOptionName(evt.target);
    eventDispatcher.broadcast("clickedOption", clickedOptionName);
  };


  //public properties and methods ----------------------------------------------

  return {

    disable: function(){
      selectMenuDisplay.rootNode.removeEventListener("click", containerClickEventHandler);
    },

    enable: function(){
      selectMenuDisplay.rootNode.addEventListener("click", containerClickEventHandler);
    },

  };

}
