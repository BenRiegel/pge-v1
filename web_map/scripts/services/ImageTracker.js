"use strict";


var NewImageTracker = function(numImages, callback){


  //private variables ----------------------------------------------------------

  var list;
  var callbackFunction;


  //private functions ----------------------------------------------------------

  var checkAllFired = function(){
    var allFired = true;
    list.forEach(function(elementFired){
      allFired = allFired && elementFired;
    });
    if (allFired){
      callbackFunction();
    }
  };


  //init code ------------------------------------------------------------------

  list = Array(numImages).fill(false);
  callbackFunction = callback;


  //public attributes and methods ----------------------------------------------

  return {

    clear: function(){
      list.fill(false);
    },

    report: function(i){
      list[i] = true;
      checkAllFired();
    },

  };

};
