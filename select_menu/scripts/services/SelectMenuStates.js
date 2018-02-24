"use strict";


var NewSelectMenuStates = function(eventDispatcher){


  //private variables ----------------------------------------------------------

  var open;
  var currentSelectedOption;
  var enabled;


  //private functions ----------------------------------------------------------

  var toggleOpenState = function(){
    if (open){
      eventDispatcher.broadcast("closeRequest");
    } else {
      eventDispatcher.broadcast("openRequest");
    }
    open = !open;
  };


  //private code block ---------------------------------------------------------

  open = false;
  currentSelectedOption = null;
  enabled = true;
  eventDispatcher.broadcast("enable");


  //public attributes and methods ----------------------------------------------

  return {

    selectOption: function(option){
      if (currentSelectedOption != option){
        if (currentSelectedOption === null){
          eventDispatcher.broadcast("initialOptionSelected", option);
        } else {
          eventDispatcher.broadcast("newOptionSelected", option);
        }
        currentSelectedOption = option;
      }
    },

    clickedOptionHandler: function(option){
      this.selectOption(option);
      toggleOpenState();
    },

    enable: function(){
      if (enabled == false){
        enabled = true;
        eventDispatcher.broadcast("enable");
      }
    },

    disable: function(){
      if (enabled == true){
        enabled = false;
        eventDispatcher.broadcast("disable");
      }
    },

    close: function(){
      if (open){
        toggleOpenState();
      }
    },

  };

};
