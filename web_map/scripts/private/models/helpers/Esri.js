"use strict";


var Esri = (function(){

  //public properties and methods ----------------------------------------------

  // note: there is no single max zoom level; for some areas, there is imagery
  // up to level 19; in other places, it's only 10

  return {
    maxScaleLevel: 12,
    basemapTileSizePx: 256,
    basemapURLString: "https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile",
  };

})();
