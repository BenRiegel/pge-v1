
var AjaxService = function(fileName) {

  var readyEvent = new Event();
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      readyEvent.fire();
    }
  }
  httpRequest.open("GET", fileName, true);
  httpRequest.send();

  //event handlers -------------------------------------------------------------

  var getJSONData = function(){
    return JSON.parse(httpRequest.responseText);
  }

  //exposed variables ----------------------------------------------------------

  return {
    readyEvent: readyEvent,
    getJSONData: getJSONData
  };
};
