
var Event = function () {
  this.handler = null;
  this.hasFired = false;
}

Event.prototype = {

  constructor: Event,

  setHandler: function (handler) {
    this.handler = handler;
  },

  fire: function (arg) {
    this.hasFired = true;
    if (this.handler){
      return this.handler(arg);
    }
  }
};
