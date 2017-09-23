
var getSiteData = function(){

  var siteAttributesArray = [];
  var tagCountObj = new Object();

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "../assets/sites.xml", false);
  xmlhttp.send();
  xmlDoc = xmlhttp.responseXML;
  var sites = xmlDoc.getElementsByTagName("site");

  for (var i = 0; i < sites.length; i++){

    var currentSiteAttributes = new Object();
    currentSiteAttributes.projectName = sites[i].getElementsByTagName("projectName")[0].textContent;
    currentSiteAttributes.author = sites[i].getElementsByTagName("author")[0].textContent;
    currentSiteAttributes.university = sites[i].getElementsByTagName("university")[0].textContent;
    currentSiteAttributes.semester = sites[i].getElementsByTagName("semester")[0].textContent;
    currentSiteAttributes.lat = sites[i].getElementsByTagName("lat")[0].textContent;
    currentSiteAttributes.lon = sites[i].getElementsByTagName("lon")[0].textContent;
    currentSiteAttributes.introText = sites[i].getElementsByTagName("introText")[0].textContent;
    currentSiteAttributes.introImageLink = sites[i].getElementsByTagName("introImageLink")[0].textContent;
    currentSiteAttributes.link = sites[i].getElementsByTagName("link")[0].textContent;
    currentSiteAttributes.tagString = sites[i].getElementsByTagName("tags")[0].textContent;
    currentSiteAttributes.tagArray = [];

    var tags = currentSiteAttributes.tagString.split(',');
    for (var j = 0; j < tags.length; j++){
      currentSiteAttributes.tagArray.push(tags[j].trim());
    }
    siteAttributesArray.push(currentSiteAttributes);
  }

  for (var i = 0; i < siteAttributesArray.length; i++){
    var currentTagArray = siteAttributesArray[i].tagArray;
    for (var j = 0; j < currentTagArray.length; j++){
      currentTag = currentTagArray[j];
      if (!(currentTag in tagCountObj)){
        tagCountObj[currentTag] = 0;
      }
      tagCountObj[currentTag]++;
    }
  }

  return {siteAttributesArray: siteAttributesArray, tagCountObj: tagCountObj};
};

//------------------------------------------------------------------------------

function Menu(){

  this.domNode = document.getElementById("menu");
  this.isOpen = false;
  this.selectedRow;

  //----------------------------------------------------------------------------

  this.open = function(){
    this.domNode.classList.add("open");
    this.isOpen = true;
    var selectedRowNum = this.selectedRow.dataset.rownum;
    if (selectedRowNum > 12) {
      var newScrollPositon = 25*(selectedRowNum - 12);
      this.domNode.scrollTop = newScrollPositon;
    }
  }

  //----------------------------------------------------------------------------

  this.close = function(){
    this.domNode.classList.remove("open");
    this.isOpen = false;
  };

  //----------------------------------------------------------------------------

  this.selectRow = function(row){
    row.classList.add("selected");
    this.selectedRow = row;
  }
  //----------------------------------------------------------------------------

  this.unselectRow = function(){
    this.selectedRow.classList.remove("selected");
    this.selectedRow = null;
  }

  //----------------------------------------------------------------------------

  this.isNewSelection = function(clickedRow){
    return (this.selectedRow != clickedRow);
  }

  //----------------------------------------------------------------------------

  this.getSelectedTagName = function(){
    return this.selectedRow.dataset.tagname;
  }
  //----------------------------------------------------------------------------

  this.selectAndClose= function(clickedRow){

    if (this.isNewSelection(clickedRow)) {
      this.unselectRow();
      this.selectRow(clickedRow);
      var newTagName = this.getSelectedTagName();
      map.toggleGraphicsLayers(newTagName);        //in map.js
      popup.close();                               //in popup.js
    }
    this.close();
  }

 //----------------------------------------------------------------------------

  this.toggleOpen = function(clickedRow){
    if (this.isOpen){
      this.selectAndClose(clickedRow);
    } else{
      this.open();
    }
  };

  //----------------------------------------------------------------------------

  this.createRowHTML = function(num, tagName, tagCount){

    var allSitesText = (num == 0)? " all-sites" : "";

    var htmlStr =
        '<div class ="menu-row" data-rownum="' + num + '" data-tagname="' + tagName +'">'
    +   '  <div class="icon-container"></div>'
    +   '  <div class="tag-name' + allSitesText + '">' + tagName + '</div>'
    +   '  <div class="tag-count">' + tagCount + '</div>'
    +   '</div>'
    ;

    return htmlStr;
  };

  //----------------------------------------------------------------------------


  var self = this;

  this.domNode.addEventListener("click", function(evt){
    var target = (evt.target.classList.contains("menu-row"))? evt.target : evt.target.parentNode;
    self.toggleOpen(target);
  });

  window.addEventListener("click", function(evt){
    var clickedMenu =  (evt.target.classList.contains("menu-row"))? true : false;
    clickedMenu = (evt.target.parentNode.classList.contains("menu-row"))? true : clickedMenu;
    if (!clickedMenu) {
      if (self.isOpen){
        self.close();
      }
    }
  });

  //----------------------------------------------------------------------------

  var tagArray = Object.keys(siteDataObj.tagCountObj);
  tagArray.sort();
  tagArray.unshift("All Sites");

  for (var i = 0; i < tagArray.length; i++){
   var tagCount = (i == 0)? siteDataObj.siteAttributesArray.length : siteDataObj.tagCountObj[tagArray[i]];
   this.domNode.innerHTML += this.createRowHTML(i, tagArray[i], tagCount);
  }

  //calculates the max width of the div elements and reassigns the max width to all of them
  //not happy with this and buggy; find better way to do this
  var maxWidth = 0;
  var tagNames = this.domNode.getElementsByClassName("tag-name");
  for (var i = 0; i < tagNames.length; i++){
    if (tagNames[i].offsetWidth > maxWidth){
      maxWidth = tagNames[i].offsetWidth;
    }
  }
  console.log(maxWidth);

  var tagNames = this.domNode.getElementsByClassName("tag-name");
  for (var i = 0; i < tagNames.length; i++){
    tagNames[i].style.width = maxWidth.toString()+"px";
  }

  var allSitesRow = document.getElementsByClassName("menu-row")[0];
  this.selectRow(allSitesRow);
  this.close();
  this.domNode.style.visibility = "visible";
}
