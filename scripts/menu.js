

//------------------------------------------------------------------------------

function Menu(){

  this.domNode = document.getElementById("menu");
  this.isOpen = false;
  this.selectedRow;

  //----------------------------------------------------------------------------

  this.open = function(){
    this.domNode.classList.add("open");
    this.isOpen = true;
    /*var selectedRowNum = this.selectedRow.dataset.rownum;
    if (selectedRowNum > 12) {
      var newScrollPositon = 25*(selectedRowNum - 12);
      this.domNode.scrollTop = newScrollPositon;
    }*/
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

  /*this.createRowHTML = function(num, tagName, tagCount){

    var allSitesText = (num == 0)? " all-sites" : "";

    var htmlStr =
        '<div class ="menu-row" data-rownum="' + num + '" data-tagname="' + tagName +'">'
    +   '  <div class="icon-container"></div>'
    +   '  <div class="tag-name' + allSitesText + '">' + tagName + '</div>'
    +   '  <div class="tag-count">' + tagCount + '</div>'
    +   '</div>'
    ;

    return htmlStr;
  };*/

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


  document.getElementById("menu").innerHTML = tempSiteDataObj.createMenuRowHTML();



  //calculates the max width of the div elements and reassigns the max width to all of them
  //not happy with this and buggy; find better way to do this
  var maxWidth = 0;
  var tagNames = this.domNode.getElementsByClassName("tag-name");
  for (var i = 0; i < tagNames.length; i++){
//    console.log(tagNames[i].textContent + " " + tagNames[i].offsetWidth);
    if (tagNames[i].offsetWidth > maxWidth){
      maxWidth = tagNames[i].offsetWidth;
    }
  }
  console.log(maxWidth);

  /*var tagNames = this.domNode.getElementsByClassName("tag-name");
  for (var i = 0; i < tagNames.length; i++){
    tagNames[i].style.width = maxWidth.toString()+"px";
  }*/

  var allSitesRow = document.getElementsByClassName("menu-row")[0];
  this.selectRow(allSitesRow);
  this.close();
  this.domNode.style.visibility = "visible";
}
