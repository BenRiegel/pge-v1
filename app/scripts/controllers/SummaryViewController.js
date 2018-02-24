"use strict";


var StartSummaryViewController = function(eventDispatcher, projectsModel, summaryView, locationsView){


  NewHttpRequest("../app/templates/popup_content_custom.html", function(htmlStr){
    eventDispatcher.broadcast("popupContentDataReceived", htmlStr);
  });

  eventDispatcher.listen("popupContentLoaded", function(){
    summaryView.loadEventListeners();
  });

  eventDispatcher.listen("panToAnimationComplete", function(){
    var projectId = locationsView.currentSelectedSiteId;
    var project = projectsModel.list[projectId];
    summaryView.loadPopup(project);
  });

  eventDispatcher.listen("readMoreButtonClicked", function(){
    summaryView.togglePopupWindow();
  });

  eventDispatcher.listen("popupContentFadeComplete", function(){
    summaryView.animatePopupExpansion();
  });

  eventDispatcher.listen("popupExpansionComplete", function(){
    var projectId = locationsView.currentSelectedSiteId;
    var project = projectsModel.list[projectId];
    var projectUrl = project.url;
    summaryView.toggleReadMoreButton();
    summaryView.loadIframe(projectUrl);
  });

  eventDispatcher.listen("iframeLoaded", function(){
    summaryView.iframeFadeIn();
  });

  eventDispatcher.listen("iframeFadeOutComplete", function(){
    summaryView.unloadIframe();
  });

  eventDispatcher.listen("iframeUnloaded", function(){
    summaryView.animatePopupContraction();
  });

  eventDispatcher.listen("popupContractionComplete", function(){
    summaryView.toggleReadMoreButton();
    summaryView.animatePopupContentFadeIn();
  });

  eventDispatcher.listen("closePopupWindow", function(){
    locationsView.currentSelectedSiteId = null;
    summaryView.contractPopup();
  });

};
