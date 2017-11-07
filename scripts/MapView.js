var MapView = function () {

  var panEvent = new Event(),
      zoomEvent = new Event(),
      panZoomEvent = new Event(),
      mapMoveEndEvent = new Event(),
      clusterClickEvent = new Event(),
      clusterResetEvent = new Event(),
      pointGraphicMouseOverEvent = new Event(),
      pointGraphicMouseOutEvent = new Event();

  var moveXYResultsRequest = new Event(),
      moveZResultsRequest = new Event();

  var pointGraphicsContainer = document.getElementById("point-graphics-container");

  var panData = {
    lastX: 0,
    lastY: 0,
    deltaX: 0,
    deltaY: 0,
  }

  //helper functions -----------------------------------------------------------

  var zoomFunction = function(context, totalProgress){
    var newScaleLevel = context.initZ + context.deltaZ * totalProgress;
    zoomEvent.fire({newScaleLevel: newScaleLevel});
  }

  var panFunction = function(context, totalProgress){
    var newX = context.initX + context.deltaX * totalProgress;
    var newY = context.initY + context.deltaY * totalProgress;
    panEvent.fire({newLocation:{x:newX, y:newY}});
  }

  var panZoomFunction = function(context, totalProgress){
    var newScaleLevel = context.initZ + context.deltaZ * totalProgress;
    var newX = context.initX + context.deltaX * totalProgress;
    var newY = context.initY + context.deltaY * totalProgress;
    panZoomEvent.fire({newScaleLevel: newScaleLevel, newLocation:{x:newX, y:newY}});
  }

  //event handlers -------------------------------------------------------------

  var mapMoveHandler = function(moveProperties){

    //clean up this
    if (moveProperties.type == "pan"){
      moveXYResults = moveXYResultsRequest.fire(moveProperties);
      panEvent.fire({newLocation:moveXYResults});
      return;
    }

    if ((moveProperties.type == "in") || (moveProperties.type == "out")){
      var moveZResults = moveZResultsRequest.fire(moveProperties);
      var zoomAnimation = new Animation();
      zoomAnimation.duration = (moveZResults.deltaZ == 0)? 0 : 300;
      zoomAnimation.runFunction = zoomFunction;
      zoomAnimation.callbackFunction = function(){
        mapMoveEndEvent.fire();
      }
      zoomAnimation.run({initZ: moveZResults.old, deltaZ: moveZResults.deltaZ});
      return;
    }

    moveZResults = moveZResultsRequest.fire(moveProperties);
    moveXYResults = moveXYResultsRequest.fire(moveProperties);
    var initLocation = moveXYResults.initLocation;
    var deltaXY = moveXYResults.deltaXY;
    context = {initX:initLocation.x, initY:initLocation.y, deltaX:deltaXY.x, deltaY:deltaXY.y,
              initZ: moveZResults.old, deltaZ: moveZResults.deltaZ};

    var animation = new Animation();
    animation.duration = 300;
    animation.runFunction = panZoomFunction;
    animation.callbackFunction = function(){
      mapMoveEndEvent.fire();
      if (moveProperties.type == "home"){
        clusterResetEvent.fire();
      }
    }
    animation.run(context);
  }

  //event listeners ------------------------------------------------------------

  document.getElementById("zoom-in-button").addEventListener("click", function(evt){
    mapMoveHandler({type:"in"});
  });

  document.getElementById("zoom-out-button").addEventListener("click", function(evt){
    mapMoveHandler({type:"out"});
  });

  document.getElementById("zoom-home-button").addEventListener("click", function(evt){
    mapMoveHandler({type:"home"});
  });

  var mouseDragHandler = function(evt){
    evt.preventDefault();
    panData.deltaX = (evt.clientX - panData.lastX);
    panData.deltaY = (evt.clientY - panData.lastY);
    panData.lastX = evt.clientX;
    panData.lastY = evt.clientY;
    mapMoveHandler({type:"pan", panData:panData});
  }

  pointGraphicsContainer.addEventListener("mousedown", function(evt){
    if (evt.target.id == "point-graphics-container"){
      evt.preventDefault();
      this.style.cursor = "move";
      panData.lastX = evt.clientX;
      panData.lastY = evt.clientY;
      this.addEventListener("mousemove", mouseDragHandler);
    }
  });

  pointGraphicsContainer.addEventListener("mouseup", function(evt){
    if (evt.target.id == "point-graphics-container"){
      this.style.cursor = "default";
      this.removeEventListener("mousemove", mouseDragHandler);
      mapMoveEndEvent.fire();
      panData = {lastX:0, lastY:0, deltaX:0, deltaY:0};
    } else {
      var x = parseFloat(evt.target.dataset.worldx);
      var y = parseFloat(evt.target.dataset.worldy);
      if (evt.target.dataset.type == "cluster"){
        clusterClickEvent.fire(evt.target.dataset.index)
        mapMoveHandler({type:"to", location:{x:x, y:y}});
      }
    }
  });

  var mouseOverGraphic = false;
  pointGraphicsContainer.addEventListener("mouseover", function(evt){
    if (evt.target.classList.contains("site-point")){
      evt.preventDefault();
      this.style.cursor = "default";
    //  var tooltip = evt.target.getElementsByClassName('tooltip')[0];

      pointGraphicMouseOverEvent.fire(evt.target);

    //  tooltip.style.visibility = "visible";
      mouseOverGraphic = true;
    } else {
      if (mouseOverGraphic){
    //    pointGraphicMouseOutEvent.fire();
        mouseOverGraphic = false;
      }
    }
  });


  //public variables -----------------------------------------------------------

  return {
    panEvent: panEvent,
    zoomEvent: zoomEvent,
    panZoomEvent: panZoomEvent,
    mapMoveEndEvent: mapMoveEndEvent,
    clusterClickEvent: clusterClickEvent,
    clusterResetEvent: clusterResetEvent,
    pointGraphicMouseOverEvent: pointGraphicMouseOverEvent,
    pointGraphicMouseOutEvent: pointGraphicMouseOutEvent,
    moveXYResultsRequest: moveXYResultsRequest,
    moveZResultsRequest: moveZResultsRequest,
    mapMoveHandler: mapMoveHandler,
  };

};
