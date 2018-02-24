"use strict";


var StartTagsViewController = function(eventDispatcher, projectsModel, tagsView){

  eventDispatcher.listen("projectsModelLoaded", function(){
    tagsView.createOptionsHTML(projectsModel.list);
  });

};
