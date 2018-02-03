function MapView(mapNodeId){

  this.dimensionsPx;

  const zoomInButtonId = "zoom-in-button",
        zoomOutButtonId = "zoom-out-button",
        zoomHomeButtonId = "zoom-home-button";

  var mapNode = document.getElementById(mapNodeId);
  var popupNode = document.getElementById('popup');

  var loadMapElements = function(htmlStr){
    var mapElementsNode = document.createElement("div");
    mapElementsNode.innerHTML = htmlStr;
    mapNode.appendChild(mapElementsNode);
  }

  var loadEventListeners = function(){
    document.getElementById(zoomInButtonId).addEventListener("click", function(evt){
      EventDispatcher.broadcast("mapZoomEvent", {type:"in"});
    });
    document.getElementById(zoomOutButtonId).addEventListener("click", function(evt){
      EventDispatcher.broadcast("mapZoomEvent", {type:"out"});
    });
    document.getElementById(zoomHomeButtonId).addEventListener("click", function(evt){
      EventDispatcher.broadcast("mapZoomEvent", {type:"home"});
    });
  }

  this.closePopupWindow = function(){
    var popupNode = document.getElementById("popup");
    popupNode.classList.remove("visible");
  }

  this.openPopupWindow = function(){
    var popupNode = document.getElementById("popup");
    popupNode.classList.add("visible");
  }




  //----------------------------------------------------------------------------

  var mapNode = document.getElementById(mapNodeId);
  var rect = mapNode.getBoundingClientRect();
  this.dimensionsPx = {width:rect.width, height:rect.height};

  new AjaxService("../lib/map/templates/MapElements.html", "mapElementsDataReceived");

  EventDispatcher.listen("mapElementsDataReceived", function(textData){
    loadMapElements(textData);
    loadEventListeners();
    EventDispatcher.broadcast("mapReady");
  });

}
