var modifyDefaultMapPopup = function(popup){


  //private variables ----------------------------------------------------------

  var state = "enabled";
  var projectInfoNode,
      projectTitleNode,
      projectAuthorNode,
      projectImageNode,
      projectTextNode,
      iframeNode,
      menuNode,
      readMoreButtonTextNode;
  var initPopupMeasurements;


  //private functions ----------------------------------------------------------

  //refactor all this garbage

  var recordPopupMeasurements = function(){
    var rect = projectInfoNode.getBoundingClientRect();
    initPopupMeasurements = {
      initTop: this.node.offsetTop,
      initLeft: this.node.offsetLeft,
      projectInfoWidth: 420,
      projectInfoHeight: rect.height,
    };
  }

  var animatePopupExpansion = function(){

    var initTop = this.node.offsetTop;
    var endTop = 15;
    var diffTop = endTop - initTop;

    var initLeft = this.node.offsetLeft;
    var endLeft = 15;
    var diffLeft = endLeft - initLeft;

    //only have to do once
    var node = document.getElementById("map");
    var rect = node.getBoundingClientRect();
    var viewportWidth = rect.width;
    var viewportHeight = rect.height;
    var expandWidth = viewportWidth - 30 - 30;
    var expandHeight = viewportHeight - 30 - 50-15;

    var rect = projectInfoNode.getBoundingClientRect();
    var projectInfoHeight = rect.height;
    var projectInfoWidth = 420;

    var diffHeight = expandHeight - projectInfoHeight;
    var diffWidth = expandWidth - projectInfoWidth;

    iframeNode.style.height = `${projectInfoHeight}px`;
    iframeNode.style.width = `${projectInfoWidth}px`;
    this.node.classList.toggle("expanded");

    new Animation(250, "expansionComplete", (totalProgress) => {
      var newHeight = projectInfoHeight + totalProgress * diffHeight;
      var newWidth = projectInfoWidth + totalProgress * diffWidth;
      projectIframe.style.height = `${newHeight}px`;
      projectIframe.style.width = `${newWidth}px`;
      var newTop = initTop + totalProgress * diffTop;
      var newLeft = initLeft + totalProgress * diffLeft;
      this.node.style.top = `${newTop}px`;
      this.node.style.left = `${newLeft}px`;
    });

  }

  var animatePopupContraction = function(){
    var initTop = 15;
    var endTop = initPopupMeasurements.initTop;
    var diffTop = endTop - initTop;

    var initLeft = 15;
    var endLeft = initPopupMeasurements.initLeft;
    var diffLeft = endLeft - initLeft;

    var rect = iframeNode.getBoundingClientRect();
    var initHeight = rect.height;
    var initWidth = rect.width;
    var diffHeight = initPopupMeasurements.projectInfoHeight - rect.height;
    var diffWidth = initPopupMeasurements.projectInfoWidth - rect.width;

    var animation = new Animation(250, "contractionComplete", (totalProgress) => {
      var newHeight = initHeight + totalProgress * diffHeight;
      var newWidth = initWidth + totalProgress * diffWidth;
      iframeNode.style.height = newHeight.toString() + "px";
      iframeNode.style.width = newWidth.toString() + "px";
      var newTop = initTop + totalProgress * diffTop;
      var newLeft = initLeft + totalProgress * diffLeft;
      this.node.style.top = newTop.toString() + "px";
      this.node.style.left = newLeft.toString() + "px";
    });
  }

  var animatePopupContentFade = function(direction){
    if (direction == "down"){
      new Animation(250, "fadeDownComplete", function(totalProgress){
        projectInfoNode.style.opacity = `${1-totalProgress}`;
      });
    } else {
      new Animation(250, "fadeUpComplete", function(totalProgress){
        projectInfoNode.style.opacity = `${totalProgress}`;
      });
    }
  };

  var loadIframeContent = function(url){
    iframeNode.dataset.status = "loaded";
    iframeNode.src = url;
  }

  var removeIframeContent = function(){
    iframeNode.dataset.status = "unloaded";
    iframeNode.src = "";
  };

  var animateIframeFadeIn = function(){
    new Animation(250, "iframeFadeInComplete", function(totalProgress){
      iframeNode.style.opacity = `${totalProgress}`;
    });
  }

  var animateIframeFadeOut = function(){
    new Animation(250, "iframeFadeOutComplete", function(totalProgress){
      iframeNode.style.opacity = `${1-totalProgress}`;
    });
  }

  var toggleReadMoreButton = function(){
    if (this.node.classList.contains("expanded")){
      readMoreButtonTextNode.textContent = "Return to Map";
    } else {
      readMoreButtonTextNode.textContent = "Read More";
    }
  };

  var getMenuOptionId = function(initNode){
    var currentNode = initNode;
    while (currentNode){
      if (currentNode.classList.contains("popup-menu-item")){
        return currentNode.id;
      }
      currentNode = currentNode.parentNode;
    }
    return "";
  };

  var menuClickEventHandler = function(evt){
    if (state == "enabled"){
      var menuOptionId = getMenuOptionId(evt.target);
      switch (menuOptionId){
        case "zoom-button":
          eventDispatcher.broadcast("ZoomTo");
          break;
        case "read-more-button":
          eventDispatcher.broadcast("readMoreButtonClicked");
          break;
        case "close-button":
          eventDispatcher.broadcast("closePopupWindow");
          break;
      }
    }
  }

  //this probably won't work
  var iframeLoadEventHandler = function(){
    if (this.dataset.status == "loaded"){
      eventDispatcher.broadcast("iframeLoaded");
    } else {
      eventDispatcher.broadcast("iframeUnloaded");
    }
  };

  var loadNodePointers = function(){
    projectInfoNode = document.getElementById("project-info");
    projectTitleNode = document.getElementById("project-title");
    projectAuthorNode = document.getElementById("project-author");
    projectImageNode = document.getElementById("project-image");
    projectTextNode = document.getElementById("project-text");
    iframeNode = document.getElementById("project-iframe");
    menuNode = document.getElementById("popup-menu");
    readMoreButtonTextNode = document.getElementById("read-more-button").childNodes[3];
  };


  //new popup close method -----------------------------------------------------

  var close = function(){
    state = "disabled";
    var animation = NewAnimation();
    animation.addRunFunction(250, (totalProgress) => {
      this.node.style.opacity = `${1 - totalProgress}`;
    });
    animation.setCallbackFunction( () => {
      this.node.classList.remove("visible");
      if (this.node.classList.contains("expanded")){
        iframeNode.src = "";  //should this cause the event listener to fire?
        iframeNode.style.height = initPopupMeasurements.projectInfoHeight.toString()+"px";
        iframeNode.style.width = initPopupMeasurements.projectInfoWidth.toString()+"px";
        this.node.style.top = initPopupMeasurements.initTop.toString() + "px";
        this.node.style.left = initPopupMeasurements.initLeft.toString() + "px";
        projectInfoNode.style.opacity = 1;
        this.node.classList.toggle("expanded");
        toggleReadMoreButton.call(this);
      }
      state = "enabled";
    });
    animation.run();
  };


  //new popup loadContent method ----------------------------------------------

  var loadContent = function(project){
    projectTitleNode.textContent = project.projectName;
    if (project.author){
      projectAuthorNode.textContent = `by ${project.author}, ${project.university} University, ${project.year}`;
    } else {
      projectAuthorNode.textContent = `written at ${project.university} University in ${project.year}`;
    }
    projectImageNode.src = project.introImageUrl;
    projectImageNode.style.display = (project.introImageUrl) ? "inline" : "none";
    projectTextNode.textContent = project.introText;
  };


  //new popup loadContentTemplate method ---------------------------------------

  var loadContentTemplate = function(htmlStr){
    this.node.innerHTML = htmlStr;
    loadNodePointers();
    menuNode.addEventListener("click", menuClickEventHandler);
    iframeNode.addEventListener("load", iframeLoadEventHandler);
  };


  //init code ------------------------------------------------------------------

  state = "enabled";


  //assign new functions -------------------------------------------------------

  popup.close = close.bind(popup);
  popup.loadContent = loadContent;
  popup.loadContentTemplate = loadContentTemplate.bind(popup);


  //this all needs to go

  return {
    togglePopupWindow: function(project){
      state = "disabled";
      if (this.node.classList.contains("expanded")){
        animateIframeFadeOut();
        eventDispatcher.listen("iframeFadeOutComplete", ()=>{
          removeIframeContent();
        });
        eventDispatcher.listen("iframeUnloaded", ()=>{
          animatePopupContraction.call(this);
          eventDispatcher.delete("iframeUnloaded");
        });
        eventDispatcher.listen("contractionComplete", ()=>{
          this.node.classList.toggle("expanded");
          toggleReadMoreButton.call(this);
          animatePopupContentFade("up");
        });
        eventDispatcher.listen("fadeUpComplete", ()=>{
          state = "enabled";
        });
      } else {



        recordPopupMeasurements.call(this);
        prepPopupExpansion.call(this);

        var animation = Animation();
        animation.addRunFunction(250, function(totalProgress){
          projectInfoNode.style.opacity = `${1-totalProgress}`;
        });
      /*  animation.addRunFunction(250, function(totalProgress){

      });*/
        animation.run();



      //  animatePopupContentFade("down");
        eventDispatcher.listen("fadeDownComplete", ()=>{
          animatePopupExpansion.call(this);
        });
        eventDispatcher.listen("expansionComplete", ()=>{
          this.node.classList.add("loading");
          toggleReadMoreButton.call(this);
          loadIframeContent(project.url);
        });
        eventDispatcher.listen("iframeLoaded", ()=>{
          this.node.classList.remove("loading");
          animateIframeFadeIn();
          state = "enabled";
        });
      }
    },


  };

};
