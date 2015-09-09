//named reactive-dict are persisted across hot code push
hcp = new ReactiveDict("okgrow-hot-code-push");

var fakeStartPromise = {
  'then': function (actionFn) {
    //debug("scheduled begin and end hook")
    hcp.set("has-hcp-hook", true);
    Reload._onMigrate(function () {
      try {
        actionFn()
      } catch(ex) {;}
      return [true];
    });
    return fakeStartPromise;
  }
};

HotCodePush = {
  start: fakeStartPromise,
  end: new Promise(function (resolve) {
    hcp.set("has-hcp-hook", true);
    window.addEventListener("load", function () {
      //debug("detected window load")
      if( hcp.get("has-hcp-hook") ){
        //debug("HotCodePush.end promise resolving");
        hcp.set("has-hcp-hook", undefined);
        resolve(true);
      }
    });
  })
};

function debug(msg) {
  console.info(msg);
}
