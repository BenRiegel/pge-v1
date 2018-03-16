"use strict";


var NewAnimation = function(){


  //private variables ----------------------------------------------------------

  var startTime,
      callback,
      currentRunFunction,
      runFunctions;


  //private functions ----------------------------------------------------------

  var cycle = function(){
    var timeStamp = new Date().getTime();
    var runTime = timeStamp - startTime;
    var totalProgress = runTime / currentRunFunction.duration;
    totalProgress = Math.min(totalProgress, 1);

    currentRunFunction.function(totalProgress);

    if (runTime >= currentRunFunction.duration){
      currentRunFunction = runFunctions.pop();
      startTime = new Date().getTime();
    }

    if (currentRunFunction){
      requestAnimationFrame( function(){
        cycle();
      });
    } else {
      if (callback){
        callback();
      }
    }
  };


  //private code block ---------------------------------------------------------

  runFunctions = [];


  //public properties and methods ----------------------------------------------

  return {

    setCallbackFunction: function(callbackFunction){
      callback = callbackFunction
    },

    addRunFunction: function(duration, runFunction){
      runFunctions.unshift({duration:duration, function:runFunction});
    },

    run: function(){
      currentRunFunction = runFunctions.pop();
      if (currentRunFunction){
        startTime = new Date().getTime();
        requestAnimationFrame( () => {
          cycle();
        });
      }
    },

  };

};
