//global variables
var map;
var popup;
var siteDataObj;
var menu;

//------------------------------------------------------------------------------

require(["esri/map",
         "esri/layers/GraphicsLayer",
         "esri/graphic",
         "esri/geometry/Point",
         "esri/symbols/SimpleLineSymbol",
         "esri/symbols/SimpleMarkerSymbol",
         "esri/Color",
         "dojo/domReady!"],
         function(Map,
                  GraphicsLayer,
                  Graphic,
                  Point,
                  SimpleLineSymbol,
                  SimpleMarkerSymbol,
                  Color){

           siteDataObj = getSiteData();   //in menu.js
           menu = new Menu();             //in menu.js
           popup = new Popup();           //in popup.js

           map = new esri.Map("map", {
             center: [-5, 28],
             zoom: 2,
             basemap: "streets",
             showAttribution: false,
             showInfoWindowOnClick : false,
             logo: false,
             slider: false
           });

           map.toggleGraphicsLayers = function(newTagName){
             var layerId = this.graphicsLayerIds[0];
             var graphicsLayer = this.getLayer(layerId);
             if (newTagName == "All Sites"){
               for (var i = 0; i < graphicsLayer.graphics.length; i++){
                 graphicsLayer.graphics[i].show();
               }
             } else {
               for (var i = 0; i < graphicsLayer.graphics.length; i++){
                 var currentGraphic = graphicsLayer.graphics[i];
                 var currentSiteTagArray = currentGraphic.attributes.tagArray;
                 (currentSiteTagArray.includes(newTagName))? currentGraphic.show() : currentGraphic.hide();
               }
             }
           }

           map.getNewMapZoomLevel =  function(delta){
             var newZoomLevel = this.getZoom() + delta;

             if (newZoomLevel > 12){
               newZoomLevel = 12;
             } else if (newZoomLevel < 2){
               newZoomLevel = 2;
             }
             return newZoomLevel;
           }

           map.on("pan-start", function(){popup.mapMoveStartHandler();});
           map.on("pan-end", function(){popup.mapMoveEndHandler();});
           map.on("zoom-start", function(){popup.mapMoveStartHandler();});
           map.on("zoom-end", function(){popup.mapMoveEndHandler();});

           map.on("click", function(evt){
             if (evt.target.id == "map_gc"){
               popup.close();
             }
           });

           map.on("load", function(){

             var graphicsLayer = new GraphicsLayer();

             for (var i = 0; i < siteDataObj.siteAttributesArray.length; i++){

               var currentSiteInfo = siteDataObj.siteAttributesArray[i];
               var point = new Point(currentSiteInfo.lon, currentSiteInfo.lat);
               var lineSymbol = new SimpleLineSymbol();
               lineSymbol.setStyle(SimpleLineSymbol.STYLE_SOLID);
               lineSymbol.setWidth(2);
               lineSymbol.setColor(new Color([255,255,255]));
               var markerSymbol = new SimpleMarkerSymbol();
               markerSymbol.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
               markerSymbol.setSize(15);
               markerSymbol.setOutline(lineSymbol);
               markerSymbol.setColor(new Color([173,102,102]));
               var attributes = currentSiteInfo;
               var pointGraphic = new Graphic(point, markerSymbol, attributes);
               graphicsLayer.add(pointGraphic);
             }

             graphicsLayer.on("click",function(evt){popup.selectSite(evt);});

             this.addLayer(graphicsLayer);
           });

           //zoom control event handlers
           document.getElementById("zoom-home-button").addEventListener("click", function(){
             map.centerAndZoom([-5, 28], 2);
           });

           document.getElementById("zoom-in-button").addEventListener("click", function(evt){
             var newZoomLevel = map.getNewMapZoomLevel(1);
             map.setZoom(newZoomLevel);
           });

           document.getElementById("zoom-out-button").addEventListener("click", function(evt){
             var newZoomLevel = map.getNewMapZoomLevel(-1);
             map.setZoom(newZoomLevel);
           });

         });

//------------------------------------------------------------------------------
