"use strict";


var NewMapBasemapView = function(eventDispatcher){

  //private variables ----------------------------------------------------------

  var displayIndex;
  var writeIndex;
  var frameNodes;
  var tileViewList;


  //private functions ----------------------------------------------------------

  var toggleFramesDefault = function(){
    frameNodes[writeIndex].style.opacity = "1";
    frameNodes[displayIndex].style.opacity = "0";
    displayIndex = 1 - displayIndex;
    writeIndex = 1 - writeIndex;
    eventDispatcher.broadcast("basemapFrameTogglingComplete");
  };

  var toggleFramesFadeIn = function(){
    frameNodes[writeIndex].style.opacity = "0";
    frameNodes[writeIndex].classList.add("in-front");
    var animation = NewAnimation();
    animation.addRunFunction(400, function(totalProgress){
      frameNodes[writeIndex].style.opacity = `${totalProgress}`;
    });
    animation.setCallbackFunction(function(){
      frameNodes[displayIndex].style.opacity = "0";
      frameNodes[writeIndex].classList.remove("in-front");
      displayIndex = 1 - displayIndex;
      writeIndex = 1 - writeIndex;
      eventDispatcher.broadcast("basemapFrameTogglingComplete");
    });
    animation.run();
  };


  //private code block ---------------------------------------------------------

  displayIndex = 0;
  writeIndex = 1;
  frameNodes = [];
  tileViewList = [];


  //public properties and methods ----------------------------------------------

  return {

    rootNode: null,

    draw: function(tileModelList){
      for (var i = 0; i < tileModelList.length; i++){
        var currentTileModel = tileModelList[i];
        var currentTileView = tileViewList[i];
        currentTileView.draw(currentTileModel, writeIndex);
      }
      eventDispatcher.broadcast("basemapImagesDrawingComplete");
    },

    toggleFrames: function(toggleType){
      switch(toggleType){
        case "initBasemapDisplayFadeIn":
        case "zoomEventFinalFrameFadeIn":
          toggleFramesFadeIn();
          break;
        case "default":
          toggleFramesDefault();
          break;
      }
    },

    recordElementNodes: function(){
      this.rootNode = document.getElementById("basemap-layer");
      frameNodes[0] = document.getElementById("frame-0");
      frameNodes[1] = document.getElementById("frame-1");
      eventDispatcher.broadcast("basemapElementNodesRecorded", this.rootNode);
    },

    loadFrames: function(numTilesTotal){
      tileViewList = [];
      frameNodes[0].innerHTML = "";
      frameNodes[1].innerHTML = "";
      for (var i = 0; i < numTilesTotal; i++){
        var newBasemapTileView = NewBasemapTileView();
        tileViewList.push(newBasemapTileView);
        frameNodes[0].appendChild(newBasemapTileView.imageNodes[0]);
        frameNodes[1].appendChild(newBasemapTileView.imageNodes[1]);
      }
      eventDispatcher.broadcast("basemapFramesLoaded");
    },

    startBasemapDisplayEvent: function(){
      eventDispatcher.broadcast("initialBasemapDisplayEventStarted");
      var eventProperties = {
        type: "initBasemapDisplay",
        subType: null,
        status: null,
        callbackMessage: "initialBasemapDisplayEventComplete",
      };
      eventDispatcher.broadcast("startNewFrameTogglerEvent", eventProperties);
      var frameProperties = {
        type: "init",
        status: null,
        loadFrameNum: 1,
        totalLoadFrames: 1,
        eventFrameNum: 1,
        totalEventFrames: 1,
        toggleType: "initBasemapDisplayFadeIn",
      };
      eventDispatcher.broadcast("createNewFrame", frameProperties);
    },

  };

};
