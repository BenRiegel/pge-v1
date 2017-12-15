function ZoomView () {

  const zoomInButtonId = "zoom-in-button",
        zoomOutButtonId = "zoom-out-button",
        zoomHomeButtonId = "zoom-home-button";

  const zoomInOutScaleIncrement = 1,
        zoomToScaleIncrement = 2;


  this.mapZoomEvent = new Event();


  var mapZoomHandler = function(){

  }


  //init code ------------------------------------------------------------------

  document.getElementById(zoomInButtonId).addEventListener("click", function(evt){
    mapZoomEvent.notify({type:"in"});
  });

  document.getElementById(zoomOutButtonId).addEventListener("click", function(evt){
    mapZoomEvent.notify({type:"out"});
  });

  document.getElementById(zoomHomeButtonId).addEventListener("click", function(evt){
    mapZoomEvent.notify({type:"home"});
  });

}




/*  var Animation2 = function(){

    this.callbackFunction;

    var mapImagesContainer = document.getElementById("basemap-images-container");
    var frames = document.getElementsByClassName("basemap-images-frame");
    var numFrames = frames.length-1;
    var counter = 1;
    var numFramesProcessed = 0;
    var prevFrame = document.getElementById("basemap-images-frame-0");

    var cycle = (args) => {

      var currentFrameId = "basemap-images-frame-" + counter.toString();
      var currentFrame = document.getElementById(currentFrameId);
      if (currentFrame){
        currentFrame.style.display = "block";
        mapImagesContainer.removeChild(prevFrame);
        prevFrame = currentFrame;
        numFramesProcessed++;
      }

      counter++;

      if (numFramesProcessed < numFrames){
        requestAnimationFrame(function(){
          cycle(args);
        });
      } else {
        if (this.callbackFunction){
          this.callbackFunction(args);
        }
        prevFrame.id = "basemap-images-frame-0";
      }
    }

    this.run = function(args){
      requestAnimationFrame(function(){
        cycle(args);
      });
    }
  };



*/





  //public attributes ----------------------------------------------------------

/*  var mapMoveHandler = function(moveProperties){
    var zMoveResults = scaleLevelMoveResultsRequest.get(moveProperties);
    var xyMoveResults = viewportMoveResultsRequest.get(moveProperties);

    if (moveProperties.type == "pan"){
      console.log("here");
    }
    else {
      var context = {initX: xyMoveResults.old.x,
                     initY: xyMoveResults.old.y,
                     initZ: zMoveResults.old,
                     deltaX: xyMoveResults.deltaXY.x,
                     deltaY: xyMoveResults.deltaXY.y,
                     deltaZ: zMoveResults.deltaZ};

      var duration = 300 * Math.abs(zMoveResults.deltaZ);
      var numFrames = Math.ceil(duration * 60 / 1000);
      for (var i = 0; i < numFrames; i++){
        var totalProgress = (i+1) / numFrames;
        var newX = context.initX + context.deltaX * totalProgress;
        var newY = context.initY + context.deltaY * totalProgress;
        var newZ = context.initZ + context.deltaZ * totalProgress;
        var frameNum = (i == (numFrames-1))? i + 6 : i;
        mapMoveEvent.notify({newScaleLevel: newZ,
                             newLocation: {x:newX, y:newY},
                             frameNum: i});
      }
      var animation = new Animation2();
      animation.run();
    }

  }*/



/*
this.getViewportMoveResults = function(moveProperties){
  var newCenterObj = {
    "in" : this.center,
    "out" : this.center,
    "home" : webmapConfigProperties.initCenterWorldCoords,
    "to" : moveProperties.location,
  }
  var newCenter = newCenterObj[moveProperties.type];
  var deltaX = WorldModel.calculateDeltaX({x1:this.center.x, x2:newCenter.x});
  var deltaY = newCenter.y - this.center.y;
  return {old:this.center, new:newCenter, deltaXY:{x:deltaX, y:deltaY}};
}*/


/*
  this.getScaleLevelMoveResults = function(moveProperties){
    var newScaleLevelObj = {
      "in" : this.scaleLevel + zoomInOutIncrement,
      "out" : this.scaleLevel - zoomInOutIncrement,
      "home" : initScaleLevel,
      "to" : this.scaleLevel + zoomToIncrement,
    }
    var newScaleLevel = newScaleLevelObj[moveProperties.type];
    newScaleLevel = (newScaleLevel > maxScaleLevel)? maxScaleLevel : newScaleLevel;
    newScaleLevel = (newScaleLevel < minScaleLevel)? minScaleLevel : newScaleLevel;
    return {old:this.scaleLevel, new:newScaleLevel, deltaZ:(newScaleLevel - this.scaleLevel)};
  }*/
