var NewSelectMenuController = function(){


  //private, configurable constants --------------------------------------------

  const initialSelectedOptionName = "All Sites";


  //private functions ----------------------------------------------------------

  var createTagCountHash = function(tagsList, projectsList){
    var tagCountHash = {}
    tagsList.forEach(function(tag){
      tagCountHash[tag.name] = {type:tag.type, count:0}
    });
    projectsList.forEach( function(project){
      project.tags.forEach ( function(tagName){
        tagCountHash[tagName].count++;
      });
    });
    return tagCountHash;
  };

  var createOptionsHTML = function(tagCountHash){
    var htmlStr = "";
    var tagNameList = Object.keys(tagCountHash);
    tagNameList.forEach(function(tagName){
      var optionName = tagName;
      var optionIndent = (tagCountHash[tagName].type == "secondary") ? "indent" : "";
      var tagCount = tagCountHash[tagName].count;
      htmlStr += `
        <div class="menu-row no-highlight" data-name="${optionName}">
          <div class="icon-container"></div>
          <div class="tag-name ${optionIndent}">${optionName}</div>
          <div class="tag-count">${tagCount}</div>
        </div>`;
    });
    return htmlStr;
  };


  //public attributes and methods ----------------------------------------------

  return {

    run: function(){

      this.eventDispatcher.listen("modelsReady && menuContainerReady", () => {
        var tagCountHash = createTagCountHash(this.models.tags.list, this.models.projects.list);
        var htmlStr = createOptionsHTML(tagCountHash);
        this.views.selectMenu.selectMenu.loadContent(htmlStr);
        this.views.selectMenu.selectMenu.selectOption(initialSelectedOptionName);
      });
    },

  };

};
