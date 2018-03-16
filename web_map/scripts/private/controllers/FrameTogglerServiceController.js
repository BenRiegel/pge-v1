"use strict";


var StartFrameTogglerServiceController = function(eventDispatcher, frameToggler){

  eventDispatcher.listen("startNewFrameTogglerEvent", function(eventProperties){
    frameToggler.startNewEvent(eventProperties);
  });

  eventDispatcher.listen("eventImagesLoading", function(){
    frameToggler.recordEventImagesLoading();
  });

  eventDispatcher.listen("eventImagesLoaded", function(framesList){
    frameToggler.downloadFrames(framesList);
  });

  eventDispatcher.listen("basemapImagesDrawingComplete", function(){
    frameToggler.recordBasemapImagesDrawn();
  });

  eventDispatcher.listen("basemapFrameTogglingComplete", function(){
    frameToggler.recordBasemapFrameTogglingComplete();
  });

};
