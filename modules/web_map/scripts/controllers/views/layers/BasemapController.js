var StartBasemapController = function(eventDispatcher, configProperties, model, view){


  //private variables ----------------------------------------------------------

  var moveState;
  var panAnimator,
      zoomAnimator;


  //private functions ----------------------------------------------------------

  var panFunction = function(x, y){
    var viewpointChangeProperties = model.calculateViewpointChange({type:"pan", x:x, y:y});
    model.setCurrentViewpoint(viewpointChangeProperties.new)
  };

  var panAnimatorCallback = function(){
    moveState = "stopped";
    eventDispatcher.private.broadcast("panAnimationEnded");
  };

  var zoomFunction = function(newViewpoint){
    model.setCurrentViewpoint(newViewpoint);
  };

  var zoomAnimatorCallback = function(){
    moveState = "stopped";
    eventDispatcher.private.broadcast("zoomAnimationEnded");
  };


  //init code ------------------------------------------------------------------

  moveState = "stopped";
  zoomAnimator = NewZoomAnimator();
  zoomAnimator.zoomFunction = zoomFunction;
  zoomAnimator.callback = zoomAnimatorCallback;
  panAnimator = NewPanAnimator();
  panAnimator.panFunction = panFunction;
  panAnimator.callback = panAnimatorCallback;


  NewHttpRequest("../modules/web_map/templates/layers/basemap.html", function(htmlStr){
    eventDispatcher.private.broadcast("basemapHTMLReceived", htmlStr);
  });

  eventDispatcher.private.listen("moduleLoaded && basemapHTMLReceived", function(eventData){
    var htmlStr = eventData["basemapHTMLReceived"];
    view.basemap.configure(view.container.node, view.container.dimensionsPx);
    view.basemap.load(htmlStr);
  });

  eventDispatcher.private.listen("basemapReady", function(){
    view.basemap.loadTiles();
  });

  eventDispatcher.private.listen("panStartRequest", function(){
    panAnimator.start();
    moveState = "panning";
    eventDispatcher.private.broadcast("panAnimationStarted");
  });

  eventDispatcher.private.listen("panEndRequest", function(){
    panAnimator.end();
  });

  eventDispatcher.private.listen("panRequest", function(panProperties){
    var panDistanceWorld = model.calculatePanDistanceWorld(panProperties);
    panAnimator.pan(panDistanceWorld);
  });

  eventDispatcher.private.listen("zoomRequest", function(zoomProperties){
    var viewpointChangeProperties = model.calculateViewpointChange(zoomProperties);
    var delta = viewpointChangeProperties.delta;
    if (delta.x || delta.y || delta.z){
      moveState = "zooming";
      eventDispatcher.private.broadcast("zoomAnimationStarted");
      zoomAnimator.run(viewpointChangeProperties.init, viewpointChangeProperties.delta);
    }
  });

  eventDispatcher.private.listen("basemapRenderingComplete", function(){
    if (moveState == "zooming"){
      zoomAnimator.cycle();
    } else if (moveState == "panning"){
      panAnimator.cycle();
    }
  });

  eventDispatcher.private.listen("basemapTilesLoaded && viewpointUpdated", function(eventData){
    var newViewpoint = eventData["viewpointUpdated"];
    view.basemap.draw(newViewpoint);
  });

};
