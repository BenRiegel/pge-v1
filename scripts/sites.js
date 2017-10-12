
//rename eventually
var siteDataObj = (function(){

  var tagsObj;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      tagsObj = JSON.parse(this.responseText);
    }
  };
  xmlhttp.open("GET", "../assets/tags.txt", false);
  xmlhttp.send();

  var sitesArray;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      sitesArray = JSON.parse(this.responseText);
    }
  };
  xmlhttp.open("GET", "../assets/sites.txt", false);
  xmlhttp.send();

  for (var i = 0; i < sitesArray.length; i++){
    var site = sitesArray[i];
    if ((site.year == "2017") && (site.university == "San Francisco State")){
      site.tags.push("New 2017 Sites");
    }
    site.tags.push("All Sites");
    for (var j = 0; j < site.tags.length; j++){
      var tagName = site.tags[j];
      tagsObj[tagName].count++;
    }
  }

  //should this be method or a property?
  var createMenuRowHTML = function(){
    var htmlStr = "";
    var keys = Object.keys(tagsObj);
    for (var i = 0; i < keys.length; i++){
      var key = keys[i];
      var tagCount = tagsObj[key].count;
      var indentLevel = tagsObj[key].indentLevel;
      htmlStr += `
        <div class='menu-row no-select indent-level-${indentLevel}' data-rownum='${i}' data-tagname='${key}'>
          <div class="icon-container"></div>
          <div class="tag-name">${key}</div>
          <div class="tag-count">${tagCount}</div>
        </div>`;
    }
    return htmlStr;
  }

  var createSiteGraphics = function(graphicsLayer){

    for (var i = 0; i < sitesArray.length; i++){
      var site = sitesArray[i];

      var lineColor = [255,255,255];
      var middleColor = [134,38,51];
      if (site.tags.includes("New 2017 Sites")){
        lineColor = [255,255,0]
        middleColor = [138,43,226];
      }

      var point = new esri.geometry.Point(site.lon, site.lat);
      var lineSymbol = new esri.symbol.SimpleLineSymbol();
      lineSymbol.setStyle(esri.symbol.SimpleLineSymbol.STYLE_SOLID);
      lineSymbol.setWidth(2);
      lineSymbol.setColor(new esri.Color(lineColor));
      var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
      markerSymbol.setStyle(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE);
      markerSymbol.setSize(14);
      markerSymbol.setOutline(lineSymbol);
      markerSymbol.setColor(new esri.Color(middleColor));
      var pointGraphic = new esri.Graphic(point, markerSymbol, site);
      graphicsLayer.add(pointGraphic);
    }
  }

  return {
    createMenuRowHTML: createMenuRowHTML,
    createSiteGraphics: createSiteGraphics
  };

})();
