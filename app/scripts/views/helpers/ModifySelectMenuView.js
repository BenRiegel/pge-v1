var modifyDefaultSelectMenu = function(selectMenu){


  //new selectMenu open function -----------------------------------------------

  var open = function(){
    this.disable();
    this.rootNode.classList.add("open");
    var optionNodes = this.rootNode.querySelectorAll(".menu-row");

    var animation = NewAnimation();
    animation.addRunFunction(250, (totalProgress) => {
      optionNodes.forEach(function(node){
        if (node.classList.contains("selected") == false){
          node.style.height = `${25 * totalProgress}px`;
          node.style.lineHeight = `${25  * totalProgress}px`;
        }
      });
    });
    animation.addRunFunction(250, (totalProgress) => {
      optionNodes.forEach(function(node){
        if (node.classList.contains("selected") == false){
          node.style.opacity = `${totalProgress}`;
        }
      });
    });
    animation.setCallbackFunction( () => {
      this.enable();
      this.rootNode.classList.add("open-complete");
    });
    animation.run();
  };


  //new selectMenu close function ----------------------------------------------

  var close = function(){
    this.disable();
    var optionNodes = this.rootNode.querySelectorAll(".menu-row");
    var animation = NewAnimation();
    animation.addRunFunction(250, (totalProgress) => {
      optionNodes.forEach(function(node){
        if (node.classList.contains("selected") == false){
          node.style.opacity = `${1 - totalProgress}`;
        }
      });
    });
    animation.addRunFunction(250, (totalProgress) => {
      optionNodes.forEach(function(node){
        if (node.classList.contains("selected") == false){
          node.style.height = `${25 - 25 * totalProgress}px`;
          node.style.lineHeight = `${25 - 25 * totalProgress}px`;
        }
      });
    });
    animation.setCallbackFunction( () => {
      this.rootNode.classList.remove("open-complete");
      this.rootNode.classList.remove("open");
      this.enable();
    });
    animation.run();
  };


  //assign new functions -------------------------------------------------------

  selectMenu.open = open.bind(selectMenu);
  selectMenu.close = close.bind(selectMenu);

};
