var NewContainer = function(eventDispatcher){


  //public attributes and methods ----------------------------------------------

  return {

    dimensionsPx: null,

    node: null,

    configure: function(configProperties){
      this.node = document.getElementById(configProperties.rootNodeId);
      const rect = this.node.getBoundingClientRect();
      this.dimensionsPx = {width:rect.width, height:rect.height};
      eventDispatcher.private.broadcast("containerConfigured");
    },

  };

};
