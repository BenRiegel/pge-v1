var NewPopupController = function(){


  //private variables ----------------------------------------------------------

  var popup,
      currentSelectedProject;


  //public attributes and methods ----------------------------------------------

  return {

    run: function(){

      NewHttpRequest("../app/templates/popup_content.html", (htmlStr) => {
        this.eventDispatcher.broadcast("popupContentDataReceived", htmlStr);
      });

      this.eventDispatcher.listen("mapReady && popupContentDataReceived", (eventData) => {
        var htmlStr = eventData["popupContentDataReceived"];
        this.views.webMap.webMap.view.popup.loadContentTemplate(htmlStr);
      });


  /*    this.eventDispatcher.listen("zoomTo", function(){
      });

      this.eventDispatcher.listen("readMoreButtonClicked", function(){
        popup.togglePopupWindow(currentSelectedProject);
      });

      this.eventDispatcher.listen("closePopupWindow", function(){
        popup.close();
      });*/


    },

  };

};
