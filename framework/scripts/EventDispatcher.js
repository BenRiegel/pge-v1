var NewEventDispatcher = function(){


  //private variables ----------------------------------------------------------

  var eventsRegistry = {};


  //private functions ----------------------------------------------------------

  var createEmptyEventObj = function(){
    return {
      namesList: [],
      data: {},
      hasFired: {},
      listeners: [],
      allFired: function(){
        var allFired = true;
        this.namesList.forEach( (name) => {
          allFired = allFired && this.hasFired[name];
        });
        return allFired;
      },
      broadcast: function(){
        var returnData = this.data;
        if (this.namesList.length == 1){
          var name = this.namesList[0];
          returnData = this.data[name];
        }
        this.listeners.forEach(function(listener){
          listener(returnData);
        });
      },
      getBroadcastData: function(){
        var returnData = this.data;
        if (this.namesList.length == 1){
          var name = this.namesList[0];
          returnData = this.data[name];
        }
        return returnData;
      },
    };
  };

  var eventHasFired = function(eventName){
    var eventRegistration = eventsRegistry[eventName];
    if (eventRegistration){
      return (eventsRegistry[eventName].hasFired[eventName]);
    }
    return false;
  }

  var getEventData = function(eventName){
    var eventRegistration = eventsRegistry[eventName];
    if (eventRegistration){
      return (eventsRegistry[eventName].data[eventName]);
    }
    return null;
  }

  var createNewEvent = function(eventDesc){
    var newEvent = createEmptyEventObj();
    var eventNamesList = eventDesc.split(" && ");
    eventNamesList.forEach(function(eventName){
      newEvent.data[eventName] = getEventData(eventName);
      newEvent.hasFired[eventName] = eventHasFired(eventName);
    });
    newEvent.namesList = eventNamesList;
    return newEvent;
  };

  var lookupEvent = function(eventDesc){
    if (!eventsRegistry[eventDesc]){
      eventsRegistry[eventDesc] = createNewEvent(eventDesc);
    }
    return eventsRegistry[eventDesc];
  };


  //public attributes and methods ----------------------------------------------

  return {

    eventsRegistry: eventsRegistry,

    broadcast: function(eventDesc, eventData){
      lookupEvent(eventDesc);
      for (registryKey in eventsRegistry){
        var event = eventsRegistry[registryKey];
        if (event.namesList.includes(eventDesc)){
          event.data[eventDesc] = eventData;
          event.hasFired[eventDesc] = true;
          if (event.allFired()){
            event.broadcast();
          };
        }
      }
    },

    listen: function(eventDesc, listener){
      var event = lookupEvent(eventDesc);
      event.listeners.push(listener);
      if (event.allFired()){
        var data = event.getBroadcastData();
        listener(data);
      }
    },

  };

};

//var EventDispatcher = NewEventDispatcher();
