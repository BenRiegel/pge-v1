
function AjaxService(fileName) {
  this.httpRequest = new XMLHttpRequest();
  this.httpRequest.open("GET", fileName, true);
  this.httpRequest.send();
};

AjaxService.prototype = {

  constructor: AjaxService,

  setCallback: function (callbackFunction) {
    if (this.httpRequest.readyState == 4 && this.httpRequest.status == 200) {
      callbackFunction(this.httpRequest.responseText);
    } else {
      this.httpRequest.onreadystatechange = () => {
        if (this.httpRequest.readyState == 4 && this.httpRequest.status == 200) {
          callbackFunction(this.httpRequest.responseText);
        }
      };
    }
  }

};
