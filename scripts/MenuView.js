var MenuView = function () {

  var tagCountRequest = new Event();
  var selectNewTagEvent = new Event();

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

  var selectNewTag = function(newRow){
    currentSelectedRow.classList.toggle("selected");
    currentSelectedRow = newRow;
    currentSelectedRow.classList.toggle("selected");
    var newTagName = currentSelectedRow.dataset.tagname;
    selectNewTagEvent.fire(newTagName);
  }

  var init = function(selectedTagName){
    var htmlStr = "";
    for (var i = 0; i < menuElementList.length; i++){
      var tagName = menuElementList[i].tagName;
      var indentLevel = menuElementList[i].indentLevel;
      var tagCount = tagCountRequest.fire(tagName);
      var selectedText = (tagName == selectedTagName)? "selected" : "";
      htmlStr += `
        <div class='menu-row no-select ${selectedText} indent-level-${indentLevel}' data-tagname='${tagName}'>
          <div class="icon-container"></div>
          <div class="tag-name">${tagName}</div>
          <div class="tag-count">${tagCount}</div>
        </div>`;
    }
    menu.innerHTML = htmlStr;
    currentSelectedRow = menu.querySelector(`[data-tagname="${selectedTagName}"]`);
    selectNewTagEvent.fire(selectedTagName);
  }

  menu.addEventListener("click", function(evt){
    var clickedRow = evt.target.parentNode;
    if (clickedRow != currentSelectedRow){
      selectNewTag(clickedRow);
    }
    menu.classList.toggle("open");
  });

  //exposed variables ----------------------------------------------------------

  return {
    tagCountRequest: tagCountRequest,
    selectNewTagEvent: selectNewTagEvent,
    init: init,
  };
};
