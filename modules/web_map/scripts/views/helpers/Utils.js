var Utils = (function(){


  //public attributes and methods ----------------------------------------------

  return {

    loadHTMLContent: function(node, htmlStr){
      var tempNode = document.createElement("div");
      tempNode.innerHTML = htmlStr;
      while (tempNode.firstChild) {
        node.appendChild(tempNode.firstChild);
      }
    },
    
  };

})();
