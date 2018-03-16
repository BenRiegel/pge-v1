"use strict";


var NewSelectMenu = function(configProperties){


  //private variables ----------------------------------------------------------

  var eventDispatcher;
  var selectMenuStates;
  var selectMenuDisplay;
  var selectMenuEventsReceiver;


  //private code block ---------------------------------------------------------

  eventDispatcher = {
    private: NewEventDispatcher(),
    public: NewEventDispatcher(),
  };

  selectMenuStates = NewSelectMenuStates(eventDispatcher.private);
  selectMenuDisplay = NewSelectMenuDisplay(eventDispatcher.private, configProperties.rootNodeId);
  selectMenuEventsReceiver = NewSelectMenuEventsReceiver(eventDispatcher.private, selectMenuDisplay);

  StartSelectMenuPublicController(eventDispatcher);
  StartSelectMenuDisplayController(eventDispatcher.private, selectMenuDisplay);
  StartSelectMenuEventsReceiverController(eventDispatcher.private, selectMenuEventsReceiver);
  StartSelectMenuStatesController(eventDispatcher.private, selectMenuStates);


  //public properties and methods ----------------------------------------------

  return {

    addEventListener: function(eventName, listener){
      eventDispatcher.public.listen(eventName, listener);
    },

    close: function(){
      selectMenuStates.close();
    },

    disable: function(){
      selectMenuEvents.disable();
    },

    enable: function(){
      selectMenuEvents.enable();
    },

    loadOptions: function(htmlStr){
      selectMenuDisplay.loadOptions(htmlStr);
    },

    selectOption: function(optionName){
      selectMenuStates.selectOption(optionName);
    },

  };

};
