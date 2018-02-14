"use strict";


var NewSelectMenu = function(configProperties){


  //private variables ----------------------------------------------------------

  var selectMenu;
  var eventDispatcher;
  var state;


  //private functions ----------------------------------------------------------

  var containerClickEventHandler = function(evt){
    if (state == "enabled"){
      var menuIsOpen = this.rootNode.classList.contains("open");
      if (menuIsOpen){
        var clickedOption = getClickedOption(evt.target);
        if (clickedOption){
          this.selectOption(clickedOption);
        }
        this.close();
      } else {
        this.open();
      }
    }
  };

  var getClickedOption = function(initNode){
    var currentNode = initNode;
    while (currentNode){
      if (currentNode.dataset && currentNode.dataset.name){
        return currentNode;
      }
      currentNode = currentNode.parentNode;
    }
    return null;
  };

  var getCurrentSelectedOption = function(){
    return this.rootNode.querySelector('.selected');
  };

  var getOptionNode = function(optionName){
    return this.rootNode.querySelector(`[data-name="${optionName}"]`);
  };

  var selectOption = function(optionNode){
    if (optionNode){
      optionNode.classList.add('selected');
    }
  };

  var unselectOption = function(optionNode){
    if (optionNode){
      optionNode.classList.remove('selected');
    }
  };


  //init private variables -----------------------------------------------------

  eventDispatcher = NewEventDispatcher();

  state = "enabled";

  selectMenu = {

    rootNode: document.getElementById(configProperties.rootNodeId),

    addEventListener: function(eventName, listener){
      eventDispatcher.listen(eventName, listener);
    },

    close: function(){
      this.rootNode.classList.remove("open");
    },

    disable: function(){
      state = "disabled";
    },

    enable: function(){
      state = "enabled";
    },

    loadContent: function(htmlStr){
      this.rootNode.innerHTML = htmlStr;
    },

    open: function(){
      this.rootNode.classList.add("open");
    },

    selectOption: function(newSelectedOption){
      if (typeof newSelectedOption == "string"){
        newSelectedOption = getOptionNode.call(this, newSelectedOption);
      }
      var currentSelectedOption = getCurrentSelectedOption.call(this);
      if (newSelectedOption != currentSelectedOption){
        unselectOption.call(this, currentSelectedOption);
        selectOption.call(this, newSelectedOption);
        eventDispatcher.broadcast("newMenuOptionSelected", newSelectedOption.dataset.name);
      }
    },

  };


  //init code ------------------------------------------------------------------

  selectMenu.rootNode.addEventListener("click", containerClickEventHandler.bind(selectMenu));


  //return obj -----------------------------------------------------------------

  return selectMenu;

};
