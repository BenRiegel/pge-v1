var NewSelectMenuView = function(){


  //private, configurable constants --------------------------------------------

  const selectMenuConfigProperties = {
    rootNodeId: "select-menu",
  }


  //public attributes and methods ----------------------------------------------

  return {

    selectMenu: null,

    //not happy about this
    load: function(){
      this.selectMenu = NewSelectMenu(selectMenuConfigProperties);
      modifyDefaultSelectMenu(this.selectMenu);
      this.eventDispatcher.broadcast("menuContainerReady");

      this.selectMenu.addEventListener("newMenuOptionSelected", (newOptionName) => {
        this.eventDispatcher.broadcast("newMenuOptionSelected", newOptionName);
      });

    },
  };
};
