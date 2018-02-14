"use strict";


var NewSummaryView = function(eventDispatcher){


  const maxImageWidth = 200;
  const maxImageHeight = 125;



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


  var menuClickEventHandler = function(evt){
    var menuOptionId = getMenuOptionId(evt.target);
    switch (menuOptionId){
      case "zoom-button":
        eventDispatcher.broadcast("ZoomTo");
        break;
      case "read-more-button":
        eventDispatcher.broadcast("readMoreButtonClicked");
        break;
      case "close-button":
        eventDispatcher.broadcast("closePopupWindow");
        break;
    }
  };


  return {

    loadEventListeners: function(){
      var menuNode = document.getElementById("popup-menu");
      menuNode.addEventListener("click", menuClickEventHandler);
    },

    loadPopup: function(project){
      var projectInfoNode = document.getElementById("project-info");
      var projectTitleNode = document.getElementById("project-title");
      var projectAuthorNode = document.getElementById("project-author");
      var projectImageNode = document.getElementById("project-image");
      var projectTextNode = document.getElementById("project-text");
      var iframeNode = document.getElementById("project-iframe");
      var menuNode = document.getElementById("popup-menu");
      var readMoreButtonTextNode = document.getElementById("read-more-button").childNodes[3];
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
        eventDispatcher.broadcast("popupLoaded");
      };
      projectImageNode.src = project.introImageUrl;
    },

  };


};
