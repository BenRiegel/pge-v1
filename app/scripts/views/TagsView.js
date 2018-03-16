"use strict";


var NewTagsView = function(eventDispatcher){

  //private, configurable constants --------------------------------------------

  const selectMenuTemplate = [
    {name:"All Sites",         type:"primary"},
    {name:"New 2017 Sites",    type:"primary"},
    {name:"Fossil Fuels",      type:"primary"},
    {name:"Coal",              type:"secondary"},
    {name:"Natural Gas",       type:"secondary"},
    {name:"Oil",               type:"secondary"},
    {name:"Nuclear Energy",    type:"primary"},
    {name:"Renewables",        type:"primary"},
    {name:"Bioenergy",         type:"secondary"},
    {name:"Hydroelectricity",  type:"secondary"},
    {name:"Mining",            type:"primary"},
    {name:"Refining",          type:"primary"},
    {name:"Power Plants",      type:"primary"},
    {name:"Consumption",       type:"primary"},
    {name:"Energy Poverty",    type:"primary"}
  ];


  //private functions ----------------------------------------------------------

  var createTagCountHash = function(menuTemplate, projectsList){
    var tagCountHash = {};
    menuTemplate.forEach(function(option){
      tagCountHash[option.name] = {
        type: option.type,
        count: 0}
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
        <div class="option no-highlight" data-name="${optionName}">
          <div class="icon-container"></div>
          <div class="tag-name ${optionIndent}">${optionName}</div>
          <div class="tag-count">${tagCount}</div>
        </div>`;
    });
    return htmlStr;
  };


  //public properties and methods ----------------------------------------------

  return {

    optionsHTMLStr: "",

    createOptionsHTML: function(projects){
      var tagCountHash = createTagCountHash(selectMenuTemplate, projects);
      this.optionsHTMLStr = createOptionsHTML(tagCountHash);
      eventDispatcher.broadcast("menuOptionsHTMLReady");
    },

  };

};
