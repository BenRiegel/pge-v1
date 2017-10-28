var MapView = function () {

  var attemptMapJumpEvent = new Event(),
      newScaleLevelEvent = new Event(),
      viewportRecenterEvent = new Event(),
      panMoveEvent = new Event(),
      panEndEvent = new Event;

  var getScaleLevelChangeResults = new Event(),
      getMapRecenterResults = new Event(),
      basemapTilesHTMLRequest = new Event();

  var mapImagesContainer = document.getElementById("map-images-container"),
      pointGraphicsContainer = document.getElementById("point-graphics-container");

  var panData = {
    lastX: 0,
    lastY: 0,
    deltaX: 0,
    deltaY: 0,
    totalX: 0,
    totalY: 0
  }

  //event handlers -------------------------------------------------------------

  var mapJumpHandler = function(jumpProperties){
    var scaleLevelChangeResults = getScaleLevelChangeResults.fire(jumpProperties);
    var mapRecenterChangeResults = getMapRecenterResults.fire(jumpProperties);
  
    var deltaX = mapRecenterChangeResults.new.x - mapRecenterChangeResults.old.x;
    var deltaY = mapRecenterChangeResults.new.y - mapRecenterChangeResults.old.y;
    var deltaZ = scaleLevelChangeResults.new - scaleLevelChangeResults.old;

    if (deltaX || deltaY || deltaZ){
    //  console.log("animate map jump");
    }

    if (deltaX || deltaY){
      viewportRecenterEvent.fire({x:mapRecenterChangeResults.new.x, y:mapRecenterChangeResults.new.y});
    }
    if (deltaZ){
      newScaleLevelEvent.fire(scaleLevelChangeResults.new);
    }
  }

  //----------------------------------------------------------------------------

  var drawBasemap = function(){
    mapImagesContainer.style.transform = "";
    mapImagesContainer.innerHTML = basemapTilesHTMLRequest.fire();
  }

  //----------------------------------------------------------------------------

  var panBasemap = function(panData){
    mapImagesContainer.style.transform = `translate(${panData.totalX}px, ${panData.totalY}px)`;
  }

  //event listeners ------------------------------------------------------------

  document.getElementById("zoom-in-button").addEventListener("click", function(evt){
    attemptMapJumpEvent.fire({type:"in"});
  });

  document.getElementById("zoom-out-button").addEventListener("click", function(evt){
    attemptMapJumpEvent.fire({type:"out"});
  });

  document.getElementById("zoom-home-button").addEventListener("click", function(evt){
    attemptMapJumpEvent.fire({type:"home"});
  });

  var mouseDragHandler = function(evt){
    evt.preventDefault();
    panData.deltaX = (evt.clientX - panData.lastX);
    panData.deltaY = (evt.clientY - panData.lastY);
    panData.totalX += panData.deltaX;
    panData.totalY += panData.deltaY;
    panData.lastX = evt.clientX;
    panData.lastY = evt.clientY;
    panMoveEvent.fire(panData);
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
      panEndEvent.fire(panData);
      panData = {lastX:0, lastY:0, deltaX:0, deltaY:0, totalX:0, totalY:0};
    } else {
      var x = parseFloat(evt.target.dataset.x);
      var y = parseFloat(evt.target.dataset.y);
      if (evt.target.dataset.type == "cluster"){
        attemptMapJumpEvent.fire({type:"to", location:{x:x, y:y}});
      }
    }
  });

  //public variables -----------------------------------------------------------

  return {
    attemptMapJumpEvent: attemptMapJumpEvent,
    newScaleLevelEvent: newScaleLevelEvent,
    viewportRecenterEvent: viewportRecenterEvent,
    panMoveEvent: panMoveEvent,
    panEndEvent: panEndEvent,
    getScaleLevelChangeResults: getScaleLevelChangeResults,
    getMapRecenterResults: getMapRecenterResults,
    basemapTilesHTMLRequest: basemapTilesHTMLRequest,
    mapJumpHandler: mapJumpHandler,
    drawBasemap: drawBasemap,
    panBasemap: panBasemap
  };

};
