var ProjectsView = function(){


  //private variables ----------------------------------------------------------

  var tagList = [
    {name: "All Sites", indent:0},
    {name: "New 2017 Sites", indent:0},
    {name: "Fossil Fuels", indent:0},
    {name: "Coal", indent:1},
    {name: "Natural Gas", indent:1},
    {name: "Oil", indent:1},
    {name: "Nuclear Energy", indent:0},
    {name: "Renewables", indent:0},
    {name: "Bioenergy", indent:1},
    {name: "Hydroelectricity", indent:1},
    {name: "Mining", indent:0},
    {name: "Refining", indent:0},
    {name: "Power Plants", indent:0},
    {name: "Consumption", indent:0},
    {name: "Energy Poverty", indent:0}
  ];


  //public attributes ----------------------------------------------------------

  var newTagSelectedEvent = new Event();

  var tagCountLookupObjRequest = new DataRequest();


  //local functions ------------------------------------------------------------

  var getOptionNameFunction = function(evt){
    var clickedOptionNode = evt.target.parentNode;
    return clickedOptionNode.dataset.name;
  }

  var generateOptionsHTML = function(){
    var tagCountLookupObj = tagCountLookupObjRequest.get();
    var htmlStr = "";
    for (var i = 0; i < tagList.length; i++){
      var name = tagList[i].name;
      var indent = tagList[i].indent;
      var tagCount = tagCountLookupObj[name];
      htmlStr += `
        <div class='menu-row no-highlight indent-level-${indent}' data-name='${name}'>
          <div class="icon-container"></div>
          <div class="tag-name">${name}</div>
          <div class="tag-count">${tagCount}</div>
        </div>`;
    }
    return htmlStr;
  }


  //public methods -------------------------------------------------------------

  var loadSelectMenu = function(){
    var menuOptionsHTML = generateOptionsHTML();
    var selectMenu = new SelectMenu("menu");
    selectMenu.setGetOptionNameFunction(getOptionNameFunction);
    selectMenu.setNewOptionEvent(newTagSelectedEvent);
    selectMenu.loadOptionsHTML(menuOptionsHTML);
    selectMenu.selectNewOption("All Sites");
  }

  //----------------------------------------------------------------------------

  var loadMap = function(){
    /*  var mapConfigProperties = {
        mapNodeId: "map",
        initViewportCenterLatLon: {lon:-5, lat:28},
        initZoomLevel: 2,
      }
      var map = new Map(mapConfigProperties);

      var sitesData = getSitesData();
      map.addGraphicsLayer();
      map.addPointGraphics(sitesData);*/
  }

  //----------------------------------------------------------------------------

  return {
    newTagSelectedEvent: newTagSelectedEvent,
    tagCountLookupObjRequest: tagCountLookupObjRequest,
    loadSelectMenu: loadSelectMenu,
    loadMap: loadMap,
  };
}
