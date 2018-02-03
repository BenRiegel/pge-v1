function SelectMenu(nodeId) {

  //public attributes ----------------------------------------------------------

  this.node = document.getElementById(nodeId);
  this.currentSelectedOptionName = "";
  this.getOptionNameFunction = null;
  this.selectNewOptionEvent = null;


  //public methods -------------------------------------------------------------

  this.close = function(){
    this.node.classList.remove("open");
  }

  this.loadOptionsHTML = function(htmlStr){
    this.node.innerHTML = htmlStr;
  }

  this.setGetOptionNameFunction = function(getOptionNameFunction){
    this.getOptionNameFunction = getOptionNameFunction;
  }

  this.setNewOptionEvent = function(evt){
    this.selectNewOptionEvent = evt;
  }

  this.toggleSelectedNode = function(nodeName){
    var optionNode = this.node.querySelector(`[data-name="${nodeName}"]`);
    if (optionNode) {
      optionNode.classList.toggle("selected");
    }
  }

  this.selectNewOption = function(newOptionName){
    this.toggleSelectedNode(this.currentSelectedOptionName);
    this.toggleSelectedNode(newOptionName);
    this.currentSelectedOptionName = newOptionName;
    if (this.selectNewOptionEvent){
      this.selectNewOptionEvent.notify(newOptionName);
    }
  }


  //event listeners ------------------------------------------------------------

  this.node.addEventListener("click", (evt)=>{
    var clickedOptionName = this.getOptionNameFunction(evt);
    if (clickedOptionName != this.currentSelectedOptionName){
      this.selectNewOption(clickedOptionName);
    }
    this.node.classList.toggle("open");
  });

};
