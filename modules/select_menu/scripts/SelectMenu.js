var NewSelectMenu = function(configProperties){


  //private variables ----------------------------------------------------------

  var selectMenu;


  //private functions ----------------------------------------------------------

  var containerClickEventHandler = function(evt){
    if (this.state == "enabled"){
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


  //init code ------------------------------------------------------------------

  var selectMenu = {

    eventDispatcher: NewEventDispatcher(),

    rootNode: document.getElementById(configProperties.rootNodeId),

    state: "enabled",

    addEventListener: function(eventName, listener){
      this.eventDispatcher.listen(eventName, listener);
    },

    close: function(){
      this.rootNode.classList.remove("open");
    },

    disable: function(){
      this.state = "disabled";
    },

    enable: function(){
      this.state = "enabled";
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
        this.eventDispatcher.broadcast("newMenuOptionSelected", newSelectedOption.dataset.name);
      }
    },

  };

  selectMenu.rootNode.addEventListener("click", containerClickEventHandler.bind(selectMenu));


  //return obj -----------------------------------------------------------------

  return selectMenu;

}
