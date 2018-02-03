var Tags = function(){

  //private constants ----------------------------------------------------------

  const menuNodeId = "menu";

  const menuNode = document.getElementById(menuNodeId);         //not sure about this one

  const optionsInfoList = [
    {tagName:"All Sites",         tagType:"primary"},
    {tagName:"New 2017 Sites",    tagType:"primary"},
    {tagName:"Fossil Fuels",      tagType:"primary"},
    {tagName:"Coal",              tagType:"secondary"},
    {tagName:"Natural Gas",       tagType:"secondary"},
    {tagName:"Oil",               tagType:"secondary"},
    {tagName:"Nuclear Energy",    tagType:"primary"},
    {tagName:"Renewables",        tagType:"primary"},
    {tagName:"Bioenergy",         tagType:"secondary"},
    {tagName:"Hydroelectricity",  tagType:"secondary"},
    {tagName:"Mining",            tagType:"primary"},
    {tagName:"Refining",          tagType:"primary"},
    {tagName:"Power Plants",      tagType:"primary"},
    {tagName:"Consumption",       tagType:"primary"},
    {tagName:"Energy Poverty",    tagType:"primary"}
  ];

  const defaultSelectedOptionName = "All Sites";


  //public attributes ----------------------------------------------------------

  var newTagSelectedEvent = new Event();


  //local functions ------------------------------------------------------------

  var createTagCountLookupHash = function(projects){
    var tagCountLookupHash = {};
    projects.forEach(function(project, i){
      project.tags.forEach(function(tagName, j){
        if (tagName in tagCountLookupHash){
          tagCountLookupHash[tagName] += 1;
        } else {
          tagCountLookupHash[tagName] = 1;
        }
      });
    });
    return tagCountLookupHash;
  }

  var clickOptionHandler = function(clickedOptionNode){
    var currentSelectedOptionNode = menuNode.querySelector('.selected');
    if (clickedOptionNode != currentSelectedOptionNode){
      currentSelectedOptionNode.classList.toggle('selected');
      clickedOptionNode.classList.toggle('selected');
      var newOptionName = clickedOptionNode.dataset.name;
      newTagSelectedEvent.notify(newOptionName);
    }
    menuNode.classList.toggle("open");
  }


  //public methods -------------------------------------------------------------

  var openSelectMenu = function(){
    menuNode.classList.add("open");
  }

  var closeSelectMenu = function(){
    menuNode.classList.remove("open");
  }

  var initSelectMenu = function(projects){
    var tagCountLookupHash = createTagCountLookupHash(projects)
    var htmlStr = "";
    optionsInfoList.forEach(function(optionInfo){
      var optionName = optionInfo.tagName;
      var optionSelectedStatus = (optionName == defaultSelectedOptionName) ? "selected" : "";
      var optionIndentLevel = (optionInfo.tagType == "primary") ? 0 : 1;
      var tagCount = tagCountLookupHash[optionInfo.tagName];
      htmlStr += `
        <div class='menu-row no-highlight ${optionSelectedStatus} indent-level-${optionIndentLevel}' data-name='${optionName}'>
          <div class="icon-container"></div>
          <div class="tag-name">${optionName}</div>
          <div class="tag-count">${tagCount}</div>
        </div>`;
    });
    menuNode.innerHTML = htmlStr;
    newTagSelectedEvent.notify(defaultSelectedOptionName);
  }


  //init code ------------------------------------------------------------------

  menuNode.addEventListener("click", (evt)=>{
    var clickedOptionNode = evt.target.parentNode;
    clickOptionHandler(clickedOptionNode);
  });


  //----------------------------------------------------------------------------

  return {
    initSelectMenu: initSelectMenu,
    openSelectMenu: openSelectMenu,
    closeSelectMenu: closeSelectMenu,
    newTagSelectedEvent: newTagSelectedEvent,
  };
}
