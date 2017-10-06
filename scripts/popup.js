
function Popup(){

  this.popupDomNode = document.getElementById("popup-container");
  this.state = "closed";
  this.isVisible = "false";
  this.selectedMapPoint;
  this.link;

  //----------------------------------------------------------------------------

  this.expand = function(){
    this.state = "open-expanded";

    var popupSVG = document.getElementById("popup-svg");
    popupSVG.setAttribute("width", 935);
    popupSVG.setAttribute("height",545);
    var popupBackground = document.getElementById("popup-background");
    popupBackground.setAttribute("height", 485);
    popupBackground.setAttribute("width", 875);
    popupBackground.setAttribute("x", 20);
    popupBackground.setAttribute("y", 20);

    document.getElementById('read-more-button').childNodes[2].textContent = " Read Less";
    document.getElementById("project-display").src = this.link;
    this.popupDomNode.classList.add("expanded");
  }

  //----------------------------------------------------------------------------

  this.contract = function(){
    this.state = "open-contracted";
    document.getElementById('read-more-button').childNodes[2].textContent = " Read More";
    document.getElementById("project-display").src = "";
    this.popupDomNode.classList.remove("expanded");
    this.display();
  }

  //----------------------------------------------------------------------------

  this.toggleExpanded = function(){
    if (this.state == "open-contracted"){
      this.expand();
    } else {
      this.contract();
    }
  }

  //----------------------------------------------------------------------------

  this.close = function(){
    if (this.state == "open-expanded"){
      this.contract();
    }
    document.getElementById("project-title").textContent = "";
    document.getElementById("project-author").textContent = ""
    document.getElementById("project-text").textContent= "";
    document.getElementById("project-image").src = "";
    document.getElementById("project-image").style.display = "inline";

    this.state = "closed";
    this.hide();
  }

  //----------------------------------------------------------------------------

  this.mapMoveStartHandler = function(){
    if ((this.state == "open-contracted") && (this.isVisible)){
      this.hide();
    }
  }

  //----------------------------------------------------------------------------
  this.mapMoveEndHandler = function(){
    if ((this.state == "open-contracted") && (!this.isVisible)){
      this.display();
    }
  }

  //----------------------------------------------------------------------------

  this.hide = function(){
    this.popupDomNode.classList.remove("visible");
    this.isVisible = false;
  }

  //----------------------------------------------------------------------------

  this.show = function(){
    this.popupDomNode.classList.add("visible");
    this.isVisible = true;
  }

  //----------------------------------------------------------------------------

  this.selectSite = function(evt){

    var attributes = evt.graphic.attributes;

    this.selectedMapPoint = new esri.geometry.Point([attributes.lon, attributes.lat]);
    this.link = attributes.link;

    document.getElementById("project-title").textContent = attributes.projectName;
    document.getElementById("project-text").textContent = attributes.introText;

    document.getElementById("project-image").style.display = "inline";
    document.getElementById("project-image").src = "";
    if (attributes.introImageLink == ""){
      document.getElementById("project-image").style.display = "none";
    } else {
      document.getElementById("project-image").src = attributes.introImageLink;
    }

    var authorDiv = document.getElementById("project-author");
    if (attributes.author != ""){
      authorDiv.textContent = "by " + attributes.author + ", " + attributes.university + " University";
    } else {
      authorDiv.textContent = "written at " + attributes.university + " University"
    }
    if (attributes.semester != ""){
      authorDiv.textContent += ", " + attributes.semester;
    }

    this.state = "open-contracted";
    this.display();
  }

  //----------------------------------------------------------------------------

  this.display = function(){

    //some of this can be taken out an put in the constructor so it's not calculated every time the funciton is called

    var padding = 20;
    var borderRadius = 10;
    var pointerWidth = 10;

    var screenPoint = map.toScreen(this.selectedMapPoint);
    var x = screenPoint.x;
    var y = screenPoint.y;

    var rect = document.getElementById("map").getBoundingClientRect();
    var mapWidth = (rect.right - rect.left);
    var mapHeight = (rect.bottom - rect.top);
    var mapMidX = mapWidth/2;
    var mapMidY = mapHeight/2;

    if ((x < 0) || (x > mapWidth) || (y < 0) || (y > mapHeight)){
      this.isVisible = false;
      return;
    }

    var rect = document.getElementById("popup-content").getBoundingClientRect();
    var popupWidth = (rect.right - rect.left);
    var popupHeight = (rect.bottom - rect.top);
    var popupMidX = popupWidth/2;
    var popupMidY = popupHeight/2;

    var horizDir = (x < mapMidX)? "w" : "e";
    var horizSpace = (x < mapMidX)? (mapWidth - x - popupWidth) : (x - popupWidth);
    var vertDir = (y < mapMidY)? "n" : "s";
    var vertSpace = (y < mapMidY)? (mapHeight - y - popupHeight) : (y - popupHeight);
    var primaryDir = (vertSpace > horizSpace)? vertDir : horizDir;

    if ((primaryDir == "n") || (primaryDir == "s")){
      var space = Math.abs(x - mapMidX);
      var comparison = popupMidX - pointerWidth-7;
    } else {
      var space = Math.abs(y - mapMidY);
      var comparison = popupMidY - pointerWidth-7;  //don't really understand the 7 here
    }

    var placeDirection = (space < comparison)? primaryDir : (vertDir + horizDir);

    var pointerStr = "";
    var pointerOffset;
    var popupOffsetLeft;
    var popupOffsetTop;

    switch(placeDirection){
      case "ne":
        popupOffsetTop = y + padding;
        popupOffsetLeft = x - popupWidth - padding;
        pointerStr = (popupWidth-borderRadius + padding) + "," + padding + " " + (popupWidth+padding*2) + ",0" +  " " + (popupWidth + padding)+ "," + (borderRadius + padding);
        break;
      case "nw":
        popupOffsetTop = y + padding;
        popupOffsetLeft = x + padding;
        pointerStr = "0,0 " + (padding + borderRadius) + "," + (padding) + " " + padding + "," + (borderRadius+padding);
        break;
      case "se":
        popupOffsetTop = y - popupHeight - padding;
        popupOffsetLeft = x - popupWidth - padding;
        pointerStr = (popupWidth + padding * 2) + "," + (popupHeight + padding * 2) + " " + (popupWidth-borderRadius+padding)+"," + (popupHeight+padding);
        pointerStr += " " + (popupWidth + padding) + "," + (popupHeight - borderRadius + padding);
        break;
      case "sw":
        popupOffsetTop = y - popupHeight - padding;
        popupOffsetLeft = x + padding;
        pointerStr = "0," + (popupHeight + padding * 2) + " " + padding + " ," + (popupHeight-borderRadius + padding) + " " + (borderRadius + padding) + "," + (popupHeight + padding);
        break;
      case "n":
        popupOffsetTop = y + padding;
        popupOffsetLeft = mapMidX - popupMidX;
        pointerOffset = x - (mapMidX - popupMidX) + padding;
        pointerStr = (pointerOffset-pointerWidth) + "," + padding + " " + (pointerOffset + pointerWidth) + "," + padding + " " + pointerOffset + ",0";
        break;
      case "s":
        popupOffsetTop = y - popupHeight - padding;
        popupOffsetLeft = mapMidX - popupMidX;
        pointerOffset = x - (mapMidX - popupMidX) + padding;
        pointerStr = (pointerOffset - pointerWidth) + "," + (popupHeight + padding-1) + " " + (pointerOffset + pointerWidth) + ",";
        pointerStr += (popupHeight + padding-1) + " " + pointerOffset + "," + (popupHeight + padding * 2);
        break;
      case "e":
        popupOffsetTop = mapMidY - popupMidY;
        popupOffsetLeft = x - popupWidth - padding;
        pointerOffset = y - (mapMidY - popupMidY) + padding;
        pointerStr = (popupWidth + padding) + "," + (pointerOffset - pointerWidth) + " " + (popupWidth + padding) + "," + (pointerOffset + pointerWidth) + " ";
        pointerStr += (popupWidth + padding * 2) + "," + pointerOffset;
        break;
      case "w":
        popupOffsetTop = mapMidY - popupMidY;
        popupOffsetLeft = x + padding;
        pointerOffset = y - (mapMidY - popupMidY) + padding;
        pointerStr = "0," + pointerOffset + " " + padding + "," + (pointerOffset + pointerWidth) + " " + padding + "," + (pointerOffset - pointerWidth);
        break;
    }

    document.getElementById("popup-pointer").setAttribute("points", pointerStr);

    var popupSVG = document.getElementById("popup-svg");
    popupSVG.setAttribute("height", popupHeight + padding * 2);
    popupSVG.setAttribute("width", popupWidth + padding * 2);

    var popupBackground = document.getElementById("popup-background");
    popupBackground.setAttribute("height", popupHeight);
    popupBackground.setAttribute("width", popupWidth);
    popupBackground.setAttribute("x", padding);
    popupBackground.setAttribute("y", padding);

    this.popupDomNode.style.left = (popupOffsetLeft).toString() + "px";
    this.popupDomNode.style.top = (popupOffsetTop).toString() + "px";

    this.show();
  };

//----------------------------------------------------------------------------

  var self = this;

  document.getElementById("close-button").addEventListener("click", function(evt){
    self.close();
  });

  document.getElementById("zoom-button").addEventListener("click", function(evt){
    if (self.state == "open-contracted"){
      var newZoomLevel = map.getNewMapZoomLevel(2);
      map.centerAndZoom(popup.selectedMapPoint, newZoomLevel);
    }
  });

  document.getElementById("read-more-button").addEventListener("click", function(evt){
     self.toggleExpanded();
  });
};
