function Event() {
  this.listeners = [];
  this.hasNotified = false;   //not sure about all this
  this.args = null;
};


Event.prototype = {

  constructor: Event,

  attach: function (listener) {
    this.listeners.push(listener);
    if (this.hasNotified){
      listener(this.args);
    }
  },

  notify: function (args) {
    this.args = args;
    for (var i = 0; i < this.listeners.length; i++) {
      this.listeners[i](args);
    }
    this.hasNotified = true;
  }

};



//==============================================================================

function EventDispatcher(eventNameList){
  this.eventLookupObj = {};

  if (eventNameList){
    eventNameList.forEach(function(eventName, i){
      this.eventLookupObj[eventName] = new Event();
    });
  }

}


EventDispatcher.prototype = {

  constructor: EventDispatcher,

  addNewEvent: function(name){
    this.eventLookupObj[name] = new Event();
  }

}
