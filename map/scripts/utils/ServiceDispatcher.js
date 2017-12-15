var Service = function() {
  this.source = null;
}


Service.prototype = {

  constructor: Service,

  setSource: function (source) {
    this.source = source;
  },

  get: function (arg) {
    return this.source(arg);
  }
  
};
