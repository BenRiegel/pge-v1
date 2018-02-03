var DataRequest = function() {
  this.source = null;
}


DataRequest.prototype = {

  constructor: DataRequest,

  setSource: function (source) {
    this.source = source;
  },

  get: function (arg) {
    return this.source(arg);
  }

};
