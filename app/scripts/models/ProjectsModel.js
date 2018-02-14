"use strict";


var NewProjectsModel = function(eventDispatcher) {


  //public attributes and methods ----------------------------------------------

  return {

    list: null,

    load: function(dataArray){
      this.list = dataArray;
      eventDispatcher.broadcast("projectsModelLoaded");
    },
  };

};
