var NewPanAnimator = function(){


  //private, configurable constants --------------------------------------------

  const numStopFrames = 20;
  const decayFactor = 0.8;


  //private variables ----------------------------------------------------------

  var panArray;
  var status;
  var velocityX,
      velocityY;
  var counter;
  var frameReady;


  //init code ------------------------------------------------------------------

  panArray = [];
  status = "stopped";

  //public attributes and functions --------------------------------------------

  return {

    panFunction: null,

    callback: null,

    listen: function(){

      if (frameReady && status == "started"){
        velocityX = 0;
        velocityY = 0;
        panArray.forEach( (panObj, i) => {
          velocityX += panObj.x;
          velocityY += panObj.y;
        });
        this.panFunction(velocityX, velocityY);
        panArray = [];
        frameReady = false;
      }

      if (frameReady && status == "ended"){
        counter--;
        velocityX = velocityX * decayFactor;
        velocityY = velocityY * decayFactor;
        this.panFunction(velocityX, velocityY);
        frameReady = false;

      }
      if (counter == 0){
        status = "stopped";
        if (this.callback){
          this.callback();
        }
      }
      if (status != "stopped"){
        requestAnimationFrame(() => {
          this.listen();
        });
      }
    },

    cycle: function(){
      frameReady = true;
    },

    pan: function(distance){
      var timeStamp = new Date().getTime();
      var panObj = {x:distance.x, y:distance.y, timeStamp:timeStamp};
      panArray.push(panObj);
    },

    start: function(){
      if (status == "stopped"){
        counter = numStopFrames;
        status = "started";
        panArray = [];
        requestAnimationFrame( () => {
          frameReady = true;
          this.listen();
        });
      }
    },

    end: function(){
      status = "ended";
    },

  };

};
