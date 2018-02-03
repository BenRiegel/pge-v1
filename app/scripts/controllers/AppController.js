var NewAppController = function(){


  //public attributes and methods ----------------------------------------------

  return {

    run: function(){

      NewHttpRequest("../app/assets/model_data/projects.txt", (textData) => {
        var list = JSON.parse(textData);
        this.models.projects.load(list);
      });

      NewHttpRequest("../app/assets/model_data/tags.txt", (textData) => {
        var list = JSON.parse(textData);
        this.models.tags.load(list);
      });

      window.addEventListener("load", () => {
        this.eventDispatcher.broadcast("domReady");
      });

      this.eventDispatcher.listen("appInitialized && domReady", () => {
        this.views.webMap.load();
        this.views.selectMenu.load();
      });

      this.eventDispatcher.listen("projectsModelLoaded && tagsModelLoaded", () => {
        this.eventDispatcher.broadcast("modelsReady");
      });

    },

  };

};
