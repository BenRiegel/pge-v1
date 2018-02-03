(function () {

  "use strict"

  var app = NewApp();

  app.addModels({
    projects: NewProjectsModel(),
    tags: NewTagsModel(),
  });

  app.addViews({
    webMap: NewWebMapView(),
    selectMenu: NewSelectMenuView(),
  });

  app.addControllers({
    appController: NewAppController(),
  //  graphicsController: NewGraphicsController(),
  //  popupController: NewPopupController(),
    selectMenuController: NewSelectMenuController(),
  });

  app.run();

})();
