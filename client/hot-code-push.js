//named reactive-dict are persisted across hot code push
hcp = new ReactiveDict("okgrow-hot-code-push");

var fakeStartPromise = {
  'then': function (actionFn) {
    hcp.set("okgrow-hot-code-push", true);
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
    window.addEventListener("load", function () {
      if( hcp.get("okgrow-hot-code-push") ){
        hcp.set("okgrow-hot-code-push", undefined);
        resolve(true);
      }
    });
  })
};
