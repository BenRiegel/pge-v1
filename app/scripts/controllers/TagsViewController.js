"use strict";


var StartTagsViewController = function(eventDispatcher, projectsModel, tagsView){


  //run code -------------------------------------------------------------------
  
  eventDispatcher.listen("projectsModelLoaded", function(){
    tagsView.createOptionsHTML(projectsModel.list);
  });

};
