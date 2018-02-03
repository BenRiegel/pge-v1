var Event = function(){

  var hasFired = false;
  var listeners = [];
  var data = null;

  return {

    addListener: function(listener){
      listeners.push(listener);
      if (hasFired){
        listener(data);
      }
    },

    broadcast: function(eventData){
      data = eventData;
      listeners.forEach(function(listener){
        listener(data);
      });
      hasFired = true;
    },

  };
}



//==============================================================================

function EventGroup(){
  this.eventList = [];
  this.listener = null;
  this.data = {};
}


EventGroup.prototype = {

  constructor: EventGroup,

  allFired: function(){
    var allEventsFired = true;
    this.eventList.forEach(function(event){
      allEventsFired = allEventsFired && event.hasFired;
    });
    return allEventsFired;
  }
}



//==============================================================================

var EventDispatcher = (function(){

  //private variables ----------------------------------------------------------

  var eventsLookupHash = {};

  var eventGroupList = [];


  //private functions ----------------------------------------------------------

  var lookupEvent = function(eventName){
    if (!eventsLookupHash[eventName]){
      eventsLookupHash[eventName] = new Event();
    }
    return eventsLookupHash[eventName];
  }


  //public attributes and methods ----------------------------------------------

  return {

    broadcast: function(eventName, eventData){
      var event = lookupEvent(eventName);
      event.hasFired = true;
      event.broadcast(eventData);
      eventGroupList.forEach(function(eventGroup){
        if (eventGroup.eventList.includes(event)){
          eventGroup.data[eventName] = eventData;
          if (eventGroup.allFired()){
            eventGroup.listener(eventGroup.data);
          }
        }
      });
    },

    listen: function(eventDesc, listener){
      var eventNamesList = eventDesc.split(" && ");
      if (eventNamesList.length == 1){
        var event = lookupEvent(eventNamesList[0]);
        event.listen(listener);
      } else if (eventNamesList.length > 1){
        var newGroup = new EventGroup();
        eventNamesList.forEach(function(eventName){
          var event = lookupEvent(eventName);
          newGroup.eventList.push(event);
        });
        newGroup.listener = listener;
        if (newGroup.allFired()){
          listener(newGroup.args);
        }
        eventGroupList.push(newGroup);
      }
    },

    delete: function(eventName){
      delete eventsLookupHash[eventName];
    }

  };

})();




function EventDispatcher(){
   //eventname : [event1 . . . event n], listener, hasfired,
}
