var PanView = function () {


  //private configurable constants --------------------------------------------

  /*const maxVelocity,
        maxAccelerationRate,
        decayRate;*/

  const basemapImagesContainerNodeId = "basemap-images-container",
        basemapImagesFrameNodeId = "basemap-images-frame-0";


  //private variables ----------------------------------------------------------

  var panData = {lastX:0, lastY:0, deltaX:0, deltaY:0};

  var velocity;


  //public attributes ----------------------------------------------------------

  this.panEvent = new Event();


 //private functions -----------------------------------------------------------

  var mouseDragHandler = function(evt){
    evt.preventDefault();
    panData.deltaX = (evt.clientX - panData.lastX);
    panData.deltaY = (evt.clientY - panData.lastY);
    panData.lastX = evt.clientX;
    panData.lastY = evt.clientY;
    panEvent.notify({x:panData.deltaX, y:panData.deltaY});
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
    panData = {lastX:0, lastY:0, deltaX:0, deltaY:0};
  });

};
