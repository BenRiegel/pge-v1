"use strict";


var StartProjectsModelController = function(eventDispatcher, projectsModel){

  NewHttpRequest("../app/assets/model_data/projects.txt", (textData) => {
    var list = JSON.parse(textData);
    projectsModel.load(list);
  });

};
