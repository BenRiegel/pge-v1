"use strict";


var NewGraphic = function(geoCoords){


  //public attributes and methods ----------------------------------------------

  return {

    model: NewGraphicModel(geoCoords),

    view: NewGraphicView(),

    setWidth: function(radius){
      this.view.setWidth(radius);
    },

    setId: function(id){
      this.view.setId(id);
    },

    addClass: function(className){
      this.view.addClass(className);
    },

    removeClassName: function(className){
      this.view.removeClassName(className);
    },

  };

}
