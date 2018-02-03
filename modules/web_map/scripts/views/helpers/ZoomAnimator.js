var NewZoomAnimator = function(){


  //private, configurable constants --------------------------------------------

  const zoomIncrementTime = 300;

  //private variables ----------------------------------------------------------

  var startTime;
  var duration;
  var initViewpoint,
      deltaViewpoint;


  //private functions ----------------------------------------------------------

  var calculateAnimationDuration = function(delta){
    if (delta.z == 0){
       var percentDeltaX = Math.abs(delta.x / WebMercator.circumference);
       var percentDeltaY = Math.abs(delta.y / WebMercator.circumference);
       var largerPercentage = Math.max(percentDeltaX, percentDeltaY);
       return 1000 * largerPercentage;
    } else {
      return zoomIncrementTime * Math.abs(delta.z);
    }
  }


  //public attributes and methods ----------------------------------------------

  return {

    callback: null,

    zoomFunction: null,

    cycle: function(){
      var timeStamp = new Date().getTime();
      var runTime = timeStamp - startTime;
      var totalProgress = runTime / duration;
      totalProgress = Math.min(totalProgress, 1);

      var newViewpoint = {
        x: initViewpoint.x + deltaViewpoint.x * totalProgress,
        y: initViewpoint.y + deltaViewpoint.y * totalProgress,
        z: initViewpoint.z + deltaViewpoint.z * totalProgress,
      }
      this.zoomFunction(newViewpoint);

      if ((totalProgress == 1) && (this.callback)){
        this.callback();
      }
    },

    run: function(init, delta){

      initViewpoint = init;
      deltaViewpoint = delta;
      duration = calculateAnimationDuration(delta);
      startTime = new Date().getTime();
      requestAnimationFrame( () => {
        this.cycle();
      });
    },
  };

};
