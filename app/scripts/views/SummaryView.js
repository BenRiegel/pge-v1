"use strict";


var NewSummaryView = function(eventDispatcher, webMap){


  const maxImageWidth = 200;
  const maxImageHeight = 125;

  var popupNode;
  var projectInfoNode;
  var projectTitleNode;
  var projectAuthorNode;
  var projectImageNode;
  var projectTextNode;
  var loaderNode;
  var iframeNode;
  var animationNode;
  var menuNode;
  var readMoreButtonTextNode;

  var initPopupMeasurements;
  var expandWidth;
  var expandHeight;
  var iframeLoaded = false;


  var calculateExpansionDimensions = function(){
    expandWidth = webMap.container.dimensionsPx.width - 30;
    expandHeight = webMap.container.dimensionsPx.height - 30;
  };

  var resizePopup = function(){
    var projectInfoRect = projectInfoNode.getBoundingClientRect();
    popupNode.style.width = `${projectInfoRect.width + 30}px`;
    popupNode.style.height = `${projectInfoRect.height + 65}px`;
  }

  var recordPopupDimensions = function(){
    var popupRect = popupNode.getBoundingClientRect();
    initPopupMeasurements = {
      top: popupNode.offsetTop,
      left: popupNode.offsetLeft,
      width: popupRect.width,
      height: popupRect.height,
    };
  };

  var loadDomNodeVariables = function(){
    popupNode = webMap.popupDisplay.rootNode;
    projectInfoNode = document.getElementById("project-info");
    projectTitleNode = document.getElementById("project-title");
    projectAuthorNode = document.getElementById("project-author");
    projectImageNode = document.getElementById("project-image");
    projectTextNode = document.getElementById("project-text");
    loaderNode = document.getElementById("loader");
    iframeNode = document.getElementById("project-iframe");
    animationNode = document.getElementById("animation");
    menuNode = document.getElementById("popup-menu");
    readMoreButtonTextNode = document.getElementById("read-more-button").childNodes[3];
  };


  var calculateNewImageDimensions = function(naturalWidth, naturalHeight){
    var ratio = naturalWidth / naturalHeight;
    if (ratio > (maxImageWidth / maxImageHeight)){
      var newWidth = maxImageWidth;
      var newHeight = newWidth / ratio;
    } else {
      var newHeight = maxImageHeight;
      var newWidth = ratio * newHeight;
    }
    return {width:newWidth, height:newHeight};
  };


  var getMenuOptionId = function(initNode){
    var currentNode = initNode;
    while (currentNode){
      if (currentNode.classList.contains("popup-menu-item")){
        return currentNode.id;
      }
      currentNode = currentNode.parentNode;
    }
    return "";
  };

  //put this elsewhere
  var menuClickEventHandler = function(evt){
    var menuOptionId = getMenuOptionId(evt.target);
    switch (menuOptionId){
      case "zoom-button":
        eventDispatcher.broadcast("zoomTo");
        break;
      case "read-more-button":
        eventDispatcher.broadcast("readMoreButtonClicked");
        break;
      case "close-button":
        eventDispatcher.broadcast("closePopupWindow");
        break;
    }
  };

  var iframeLoadEventHandler = function(){
    if (iframeLoaded == false){
      loaderNode.classList.add("loaded");
      iframeLoaded == true;
      eventDispatcher.broadcast("iframeLoaded");
    }
  };




  return {

    animatePopupContentFadeOut: function(){
      var animation = NewAnimation();
      animation.addRunFunction(150, (totalProgress) => {
        projectInfoNode.style.opacity = `${1 - totalProgress}`;
      });
      animation.setCallbackFunction(function(){
        loaderNode.style.width = `${initPopupMeasurements.width - 30}px`;   //rename loader
        loaderNode.style.height = `${initPopupMeasurements.height - 65}px`;
        eventDispatcher.broadcast("popupContentFadeComplete");
      });
      animation.run();
    },

    animatePopupContentFadeIn: function(){
      var animation = NewAnimation();
      animation.addRunFunction(150, (totalProgress) => {
        projectInfoNode.style.opacity = `${totalProgress}`;
      });
      animation.setCallbackFunction(function(){

      });
      animation.run();
    },

    animatePopupExpansion: function(){
      var diffTop = 15 - initPopupMeasurements.top;
      var diffLeft = 15 - initPopupMeasurements.left;
      var diffWidth = expandWidth - initPopupMeasurements.width;
      var diffHeight = expandHeight - initPopupMeasurements.height;
      popupNode.classList.add("expanding");

      var animation = NewAnimation();
      animation.addRunFunction(150, (totalProgress) => {
        var newTop = initPopupMeasurements.top + diffTop * totalProgress;
        var newLeft = initPopupMeasurements.left + diffLeft * totalProgress;
        var newWidth = initPopupMeasurements.width + diffWidth * totalProgress;
        var newHeight = initPopupMeasurements.height + diffHeight * totalProgress;
        popupNode.style.left = `${newLeft}px`;
        popupNode.style.top = `${newTop}px`;
        popupNode.style.width = `${newWidth}px`;
        popupNode.style.height = `${newHeight}px`;
        loaderNode.style.width = `${newWidth - 30}px`;
        loaderNode.style.height = `${newHeight - 65}px`;
      });
      animation.setCallbackFunction(function(){
        popupNode.classList.add("expanded");
        eventDispatcher.broadcast("popupExpansionComplete");
      });
      animation.run();
    },

    animatePopupContraction: function(){
      var diffTop = initPopupMeasurements.top - 15;
      var diffLeft = initPopupMeasurements.left - 15;
      var diffWidth = initPopupMeasurements.width - expandWidth;
      var diffHeight = initPopupMeasurements.height - expandHeight;
      popupNode.classList.remove("expanding");
      var animation = NewAnimation();
      animation.addRunFunction(150, (totalProgress) => {
        var newTop = 15 + diffTop * totalProgress;
        var newLeft = 15 + diffLeft * totalProgress;
        var newWidth = expandWidth + diffWidth * totalProgress;
        var newHeight = expandHeight + diffHeight * totalProgress;
        popupNode.style.left = `${newLeft}px`;
        popupNode.style.top = `${newTop}px`;
        popupNode.style.width = `${newWidth}px`;
        popupNode.style.height = `${newHeight}px`;
        loaderNode.style.width = `${newWidth - 30}px`;
        loaderNode.style.height = `${newHeight - 65}px`;
      });
      animation.setCallbackFunction(function(){
        popupNode.classList.remove("expanded");
        eventDispatcher.broadcast("popupContractionComplete");
      });
      animation.run();
    },

    toggleReadMoreButton: function(){
      if (popupNode.classList.contains("expanded")){
        readMoreButtonTextNode.textContent = "Return to Map";
      } else {
        readMoreButtonTextNode.textContent = "Read More";
      }
    },

    loadIframe: function(projectUrl){
      iframeNode.src = projectUrl;
    },

    unloadIframe: function(){
      loaderNode.classList.remove("loaded");
      iframeLoaded = false;
      eventDispatcher.broadcast("iframeUnloaded");
    },

    iframeFadeIn: function(){
      var animation = NewAnimation();
      animation.addRunFunction(150, (totalProgress) => {
        iframeNode.style.opacity = `${totalProgress}`;
      });
      animation.setCallbackFunction(function(){
      });
      animation.run();
    },

    animateIframeFadeOut: function(){
      var animation = NewAnimation();
      animation.addRunFunction(150, (totalProgress) => {
        iframeNode.style.opacity = `${1-totalProgress}`;
      });
      animation.setCallbackFunction(function(){
        eventDispatcher.broadcast("iframeFadeOutComplete");
      });
      animation.run();
    },

    loadEventListeners: function(){
      calculateExpansionDimensions();
      loadDomNodeVariables();
      menuNode.addEventListener("click", menuClickEventHandler);
      iframeNode.addEventListener("load", iframeLoadEventHandler);
    },

    loadPopup: function(project){
      projectTitleNode.textContent = project.projectName;
      if (project.author){
        projectAuthorNode.textContent = `by ${project.author}, ${project.university} University, ${project.year}`;
      } else {
        projectAuthorNode.textContent = `written at ${project.university} University in ${project.year}`;
      }
      projectImageNode.style.display = (project.introImageUrl) ? "inline" : "none";
      projectTextNode.textContent = project.introText;
      projectImageNode.src = "";
      projectImageNode.onload = function(){
        var newDimensions = calculateNewImageDimensions(this.naturalWidth, this.naturalHeight);
        this.style.width = `${newDimensions.width}px`;
        this.style.height = `${newDimensions.height}px`;
        resizePopup();            //merge these
        recordPopupDimensions();
        eventDispatcher.broadcast("popupLoaded");
      };
      projectImageNode.src = project.introImageUrl;
    },

    contractPopup: function(){
      if (popupNode.classList.contains("expanded")){

        iframeNode.style.opacity = 0;
        projectInfoNode.style.opacity = 1;
        loaderNode.classList.remove("loaded");
        iframeLoaded = false;
        popupNode.classList.remove("expanded");
        popupNode.classList.remove("expanding");
        this.toggleReadMoreButton();
      }
      eventDispatcher.broadcast("popupReadyToClose");
    },


    togglePopupWindow: function(){
      if (popupNode.classList.contains("expanded")){
        this.animateIframeFadeOut();
      } else {
        recordPopupDimensions();
        this.animatePopupContentFadeOut();
      }
    },

  };


};
