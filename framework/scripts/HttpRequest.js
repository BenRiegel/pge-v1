var NewHttpRequest = function(fileName, callbackFunction) {


  //private variables ----------------------------------------------------------

  var httpRequest;


  //init code ------------------------------------------------------------------

  httpRequest = new XMLHttpRequest();
  httpRequest.addEventListener("load", function(){
    callbackFunction(this.responseText);
  });
  httpRequest.open("GET", fileName, true);
  httpRequest.send();

};
