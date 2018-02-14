"use strict";


var StartProjectsModelController = function(eventDispatcher, projectsModel){


  //run code -------------------------------------------------------------------

  NewHttpRequest("../app/assets/model_data/projects.txt", (textData) => {
    var list = JSON.parse(textData);
    projectsModel.load(list);
  });

};
