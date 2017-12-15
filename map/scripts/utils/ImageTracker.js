

function ImageTracker() {

  var tilesObj = {};
  var trackList = [];
  var doneTracking = false;

  this.callbackFunction = null;

  this.checkTrackList = function(){
    if (doneTracking == false){
      return false;
    } else {
      var done = true;
      for (var i = 0; i < trackList.length; i++){
        var indicesStr = trackList[i];
        if (tilesObj[indicesStr] == false){
          done = false;
        }
      }
      return done;
    }
  }

  this.register = function(x, y){
    var str = x.toString() + " " + y.toString();
    if (!(str in tilesObj)){
      tilesObj[str] = false;
    }
  }

  this.report = function(x, y){
    var str = x.toString() + " " + y.toString();
    tilesObj[str] = true;
    if (this.checkTrackList()){
      this.callbackFunction();
    }
  }

  this.track = function(x, y){
    var str = x.toString() + " " + y.toString();
    trackList.push(str);
  }

  this.finishTracking = function(){
    doneTracking = true;
    if (this.checkTrackList()){
      this.callbackFunction();
    }
  }

  this.isRegistered = function(x, y){
    var str = x.toString() + " " + y.toString();
    return (str in tilesObj);
  }

  this.resetTrackList = function(){
    trackList = [];
    doneTracking = false;
  }

}
