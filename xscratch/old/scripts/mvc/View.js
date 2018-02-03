var View = function(){


  //private, configurable constants --------------------------------------------

  const basemapImagesContainerNodeId = "basemap-images-container",
        basemapImagesFrameNodeId = "basemap-images-frame-0";


  //private variables ----------------------------------------------------------

  var containerNode = document.getElementById(basemapImagesFrameNodeId);

  var panData = {lastX:0, lastY:0, deltaX:0, deltaY:0};


  //public properties ----------------------------------------------------------

  var attemptedPanEvent = new Event();


  //private funtions -----------------------------------------------------------

  var mouseDragHandler = function(evt){
    evt.preventDefault();
    panData.deltaX = (evt.clientX - panData.lastX);
    panData.deltaY = (evt.clientY - panData.lastY);
    panData.lastX = evt.clientX;
    panData.lastY = evt.clientY;
    attemptedPanEvent.notify({deltaX:panData.deltaX, deltaY:panData.deltaY});
  }

  //public methods -------------------------------------------------------------

  var loadImages = function(imageList){
    //console.log(image);
    for (var i = 0; i < imageList.length; i++){
      var image = imageList[i];
      containerNode.appendChild(image);
    }
  }

  var moveBasemap = function(totalPanDist){
    containerNode.style.transform = `translate(${totalPanDist.x}px, ${totalPanDist.y}px)`
  }

  var showBasemap = function(){
    containerNode.style.display = "block";
  }


  //init code ------------------------------------------------------------------

  document.getElementById(basemapImagesContainerNodeId).addEventListener("mousedown", function(evt){
    evt.preventDefault();
    this.style.cursor = "move";
    panData.lastX = evt.clientX;
    panData.lastY = evt.clientY;
    this.addEventListener("mousemove", mouseDragHandler);
  });

  document.getElementById(basemapImagesContainerNodeId).addEventListener("mouseup", function(evt){
    this.style.cursor = "default";
    this.removeEventListener("mousemove", mouseDragHandler);
    var panData = {lastX:0, lastY:0, deltaX:0, deltaY:0};
  });


  //----------------------------------------------------------------------------

  return {
    attemptedPanEvent: attemptedPanEvent,
    loadImages: loadImages,
    moveBasemap: moveBasemap,
    showBasemap: showBasemap,
  }

}
