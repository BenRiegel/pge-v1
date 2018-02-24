"use strict";


var NewSelectMenuDisplay = function(eventDispatcher, rootNodeId){


  //private functions ----------------------------------------------------------

  var unselectCurrentOption = function(){
    var currentSelectedOptionNode = this.rootNode.querySelector('.selected');
    currentSelectedOptionNode.classList.remove('selected');
  };

  var selectNewOption = function(optionName){
    var newSelectedOptionNode = this.rootNode.querySelector(`[data-name="${optionName}"]`);
    newSelectedOptionNode.classList.add('selected');
  };


  //public attributes and methods ----------------------------------------------

  return {

    rootNode: document.getElementById(rootNodeId),

    loadOptions: function(htmlStr){
      this.rootNode.innerHTML = htmlStr;
      eventDispatcher.broadcast("optionsLoaded");
    },

    selectInitialOption: function(optionName){
      selectNewOption.call(this, optionName);
    },

    selectNewOption: function(optionName){
      unselectCurrentOption.call(this);
      selectNewOption.call(this, optionName);
    },

    open: function(){
      eventDispatcher.broadcast("openingStarted");
      this.rootNode.classList.add("open");
      var optionNodes = this.rootNode.querySelectorAll(".option");
      var animation = NewAnimation();
      animation.addRunFunction(200, function(totalProgress){
        optionNodes.forEach(function(node){
          if (node.classList.contains("selected") == false){
            node.style.height = `${25 * totalProgress}px`;
            node.style.lineHeight = `${25  * totalProgress}px`;
          }
        });
      });
      animation.addRunFunction(200, function(totalProgress){
        optionNodes.forEach(function(node){
          if (node.classList.contains("selected") == false){
            node.style.opacity = `${totalProgress}`;
          }
        });
      });
      animation.setCallbackFunction( () => {
        this.rootNode.classList.add("open-complete");
        eventDispatcher.broadcast("openingCompleted");
      });
      animation.run();
    },

    close: function(){
      eventDispatcher.broadcast("closingStarted");
      var optionNodes = this.rootNode.querySelectorAll(".option");
      var animation = NewAnimation();
      animation.addRunFunction(200, function(totalProgress){
        optionNodes.forEach(function(node){
          if (node.classList.contains("selected") == false){
            node.style.opacity = `${1 - totalProgress}`;
          }
        });
      });
      animation.addRunFunction(200, function(totalProgress){
        optionNodes.forEach(function(node){
          if (node.classList.contains("selected") == false){
            node.style.height = `${25 - 25 * totalProgress}px`;
            node.style.lineHeight = `${25 - 25 * totalProgress}px`;
          }
        });
      });
      animation.setCallbackFunction( () => {
        this.rootNode.classList.remove("open-complete");
        this.rootNode.classList.remove("open");
        eventDispatcher.broadcast("closingCompleted");
      });
      animation.run();
    },

  };

};
