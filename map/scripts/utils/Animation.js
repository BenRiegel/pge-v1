
var Animation = function(){

  this.type;
  this.runFunction;
  this.callbackFunction;
  this.duration;

  var startTime;

  var cycle = (args) => {

    var timeStamp = new Date().getTime();
    var runTime = timeStamp - startTime;
    var totalProgress = runTime / this.duration;
    totalProgress = Math.min(totalProgress, 1);


    this.runFunction(args, totalProgress);

    if (runTime < this.duration){
      requestAnimationFrame(function(){
        cycle(args);
      });
    } else {
      this.callbackFunction(args);
    }
  }

  this.run = function(args){
    startTime = new Date().getTime();
    requestAnimationFrame(function(){
      cycle(args);
    });
  }
};