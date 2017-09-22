
function Popup(){

  this.popupContainerDomNode = document.getElementById("popup-container");
  this.pointerDomNode = document.getElementById("pointer");
  this.popupDomNode = document.getElementById("popup");
  this.state = "closed";
  this.isVisible = "false";
  this.selectedMapPoint;
  this.link;

  //----------------------------------------------------------------------------

  this.expand = function(){
    this.state = "open-expanded";
    document.getElementById('read-more-button').childNodes[2].textContent = " Read Less";
    document.getElementById("project-display").src = this.link;
    this.popupContainerDomNode.classList.add("expanded");
    this.popupDomNode.classList.add("expanded");
  }

  //----------------------------------------------------------------------------

  this.contract = function(){
    this.state = "open-contracted";
    document.getElementById('read-more-button').childNodes[2].textContent = " Read More";
    document.getElementById("project-display").src = "";
    this.popupContainerDomNode.classList.remove("expanded");
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
    this.popupContainerDomNode.classList.remove("visible");
    this.pointerDomNode.classList.remove("visible");
    this.popupDomNode.classList.remove("visible");
    this.isVisible = false;
  }

  //----------------------------------------------------------------------------

  this.show = function(){
    this.popupContainerDomNode.classList.add("visible");
    this.pointerDomNode.classList.add("visible");
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

    var rect = this.popupDomNode.getBoundingClientRect();
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
        popupOffsetTop = y;
        popupOffsetLeft = x - popupWidth - padding*2;
        pointerStr = (popupWidth-borderRadius) + ",0 " + (popupWidth+padding) + ",-" + padding + " " + popupWidth+ "," + borderRadius;
        break;
      case "nw":
        popupOffsetTop = y;
        popupOffsetLeft = x;
        pointerStr = "-" + padding + ",-" + padding + " " + borderRadius + ",0 0," + borderRadius;
        break;
      case "se":
        popupOffsetTop = y - popupHeight - padding*2;
        popupOffsetLeft = x - popupWidth - padding*2;
        pointerStr = (popupWidth + padding) + "," + (popupHeight + padding) + " " + (popupWidth-borderRadius)+"," + popupHeight;
        pointerStr += " " + popupWidth + "," + (popupHeight - borderRadius);
        break;
      case "sw":
        popupOffsetTop = y - popupHeight - padding*2;
        popupOffsetLeft = x;
        pointerStr = "-" + padding + "," + (popupHeight+padding) + " 0," + (popupHeight-borderRadius) + " " + borderRadius + "," + popupHeight;
        break;
      case "n":
        popupOffsetTop = y;
        popupOffsetLeft = mapMidX - popupMidX-padding;
        pointerOffset = x - (mapMidX - popupMidX );
        pointerStr = (pointerOffset-pointerWidth) + ",1 " + (pointerOffset + pointerWidth)+ ",1 " + pointerOffset + "," + (-padding);
        break;
      case "s":
        popupOffsetTop = y - popupHeight - padding*2;
        popupOffsetLeft = mapMidX - popupMidX-padding;
        pointerOffset = x - (mapMidX - popupMidX );
        pointerStr = (pointerOffset - pointerWidth) + "," + (popupHeight-1) + " " + (pointerOffset + pointerWidth) + ",";
        pointerStr += (popupHeight-1) + " " + pointerOffset + "," + (popupHeight + padding);
        break;
      case "e":
        popupOffsetTop = mapMidY - popupMidY-padding;
        popupOffsetLeft = x - popupWidth - padding*2;
        pointerOffset = y - (mapMidY - popupMidY );
        pointerStr = (popupWidth-1) + "," + (pointerOffset-pointerWidth) + " " + (popupWidth-1) + "," + (pointerOffset+pointerWidth) + " ";
        pointerStr += (popupWidth+padding) + "," + pointerOffset;
        break;
      case "w":
        popupOffsetTop = mapMidY - popupMidY-padding;
        popupOffsetLeft = x;
        pointerOffset = y - (mapMidY - popupMidY);
        pointerStr = "1," + (pointerOffset-pointerWidth) + " 1," + (pointerOffset+pointerWidth) + " " + (-padding) + "," + pointerOffset;
        break;
    }

    this.pointerDomNode.setAttribute("points", pointerStr);

    this.popupContainerDomNode.style.width = popupWidth.toString() + "px";
    this.popupContainerDomNode.style.height = popupHeight.toString() + "px";
    this.popupContainerDomNode.style.left = popupOffsetLeft.toString() + "px";
    this.popupContainerDomNode.style.top = popupOffsetTop.toString() + "px";

    this.popupDomNode.style.left = (popupOffsetLeft + padding).toString() + "px";
    this.popupDomNode.style.top = (popupOffsetTop + padding).toString() + "px";

    var popupBackground = document.getElementById("popup-background");
    popupBackground.setAttribute("rx", borderRadius);
    popupBackground.setAttribute("ry", borderRadius);

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
