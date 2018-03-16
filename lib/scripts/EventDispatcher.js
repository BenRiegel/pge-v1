"use strict";


var NewEventDispatcher = function(){


  //private variables ----------------------------------------------------------

  var eventsRegistry = {};


  //private functions ----------------------------------------------------------

  var NewEmptyEventObj = function(){
    return {
      namesList: [],
      data: {},
      hasFired: {},
      listeners: [],
      reset: false,
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
        if (this.reset === true){
          this.namesList.forEach( (name) => {
            this.hasFired[name] = false;
          });
        }
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
    var newEvent = NewEmptyEventObj();
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


  //public properties and methods ----------------------------------------------

  return {

    eventsRegistry: eventsRegistry,

    broadcast: function(eventDesc, eventData){
      lookupEvent(eventDesc);
      for (var registryKey in eventsRegistry){
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

    listen: function(eventDesc, listener, reset, ignoreEarlierFires){
      var event = lookupEvent(eventDesc);
      event.listeners.push(listener);
      event.reset = reset;
      if (!ignoreEarlierFires){
        if (event.allFired()){
          var data = event.getBroadcastData();
          listener(data);
        }
      }
    },

    remove: function(eventDesc, listener){
      var event = eventsRegistry[eventDesc];
      var found = false;
      for (var i = 0; i < event.listeners.length; i++){
        var recordedListener = event.listeners[i];
        if (recordedListener == listener){
          found = true;
          var index = i;
        }
      }
      if (found){
        event.listeners.splice(index, 1);
      }
    },

    getBroadcastedData: function(eventDesc){
      var event = eventsRegistry[eventDesc];
      var returnData = event.data;
      if (event.namesList.length == 1){
        var name = event.namesList[0];
        returnData = event.data[name];
      }
      return returnData;
    }

  };

};
