"use strict";


var StartSummaryViewController = function(eventDispatcher, projectsModel, summaryView){


  //run code -------------------------------------------------------------------

  NewHttpRequest("../app/templates/popup_content_custom.html", function(htmlStr){
    eventDispatcher.broadcast("popupContentDataReceived", htmlStr);
  });

  eventDispatcher.listen("popupContentLoaded", function(){
    summaryView.loadEventListeners();
  });

  eventDispatcher.listen("sitesGraphicsLayerClicked", function(projectId){
    summaryView.loadPopup(projectsModel.list[projectId]);
  });

};
