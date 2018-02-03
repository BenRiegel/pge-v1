var MenuView = function () {

  //private variables ----------------------------------------------------------

  var menu = document.getElementById("menu");
  var currentSelectedRow = null;

  var menuElementList = [
    {tagName: "All Sites", indentLevel:0},
    {tagName: "New 2017 Sites", indentLevel:0},
    {tagName: "Fossil Fuels", indentLevel:0},
    {tagName: "Coal", indentLevel:1},
    {tagName: "Natural Gas", indentLevel:1},
    {tagName: "Oil", indentLevel:1},
    {tagName: "Nuclear Energy", indentLevel:0},
    {tagName: "Renewables", indentLevel:0},
    {tagName: "Bioenergy", indentLevel:1},
    {tagName: "Hydroelectricity", indentLevel:1},
    {tagName: "Mining", indentLevel:0},
    {tagName: "Refining", indentLevel:0},
    {tagName: "Power Plants", indentLevel:0},
    {tagName: "Consumption", indentLevel:0},
    {tagName: "Energy Poverty", indentLevel:0}
  ];

  //public attributes ----------------------------------------------------------

  var selectNewTagEvent = new Event();
  var tagCountObjRequest = new Service();

  //private functions ----------------------------------------------------------

  var selectNewTag = function(newRow){
    currentSelectedRow.classList.toggle("selected");
    currentSelectedRow = newRow;
    currentSelectedRow.classList.toggle("selected");
    var newTagName = currentSelectedRow.dataset.tagname;
    selectNewTagEvent.fire(newTagName);
  }


  //public methods -------------------------------------------------------------

  var close = function(){
    menu.classList.remove("open");
  }

  var init = function(selectedTagName){
    var tagCountObj = tagCountObjRequest.get();
    var htmlStr = "";
    for (var i = 0; i < menuElementList.length; i++){
      var tagName = menuElementList[i].tagName;
      var indentLevel = menuElementList[i].indentLevel;
      var tagCount = tagCountObj[tagName];
      var selectedText = (tagName == selectedTagName)? "selected" : "";
      htmlStr += `
        <div class='menu-row no-highlight ${selectedText} indent-level-${indentLevel}' data-tagname='${tagName}'>
          <div class="icon-container"></div>
          <div class="tag-name">${tagName}</div>
          <div class="tag-count">${tagCount}</div>
        </div>`;
    }
    menu.innerHTML = htmlStr;
    currentSelectedRow = menu.querySelector(`[data-tagname="${selectedTagName}"]`);
  }

  //event listeners ------------------------------------------------------------

  menu.addEventListener("click", function(evt){
    var clickedRow = evt.target.parentNode;
    if (clickedRow != currentSelectedRow){
      selectNewTag(clickedRow);
    }
    menu.classList.toggle("open");
  });

  //public variables -----------------------------------------------------------

  return {
    selectNewTagEvent: selectNewTagEvent,
    tagCountObjRequest: tagCountObjRequest,
    init: init,
    close: close,
  };
};
