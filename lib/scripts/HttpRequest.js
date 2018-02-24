"use strict";


var NewHttpRequest = function(fileName, callbackFunction) {


  //private variables ----------------------------------------------------------

  var httpRequest;


  //private code block ---------------------------------------------------------

  httpRequest = new XMLHttpRequest();
  httpRequest.addEventListener("load", function(){
    callbackFunction(this.responseText);
  });
  httpRequest.open("GET", fileName, true);
  httpRequest.send();

};
