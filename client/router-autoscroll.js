RouterAutoscroll = {
  animationDuration: 200,
};

var backToPosition;
// Saved positions will survive a hot code push
var scrollPositions = new ReactiveDict("okgrow-router-autoscroll");

function saveScrollPosition () {
  scrollPositions.set(window.location.href, $(window).scrollTop());
};

//TODO use history state so we don't litter
window.onpopstate = function () {
  backToPosition = scrollPositions.get(window.location.href);
};

// Scroll to the right place after changing routes. "The right place" is:
// 1. The previous position if we're returning via the back button
// 2. The element whose id is specified in the URL hash
// 3. The top of page otherwise
function getScrollToPosition () {
  if (backToPosition) {
    var oldPosition = backToPosition;
    backToPosition = undefined;
    return oldPosition;
  }

  var hash = window.location.hash;
  var $hash;
  try{
    //HTML5 allows all kinds of ids, so we can't whitelist characters, only
    //decide the hash doesn't represent a DOM id if we fail
    $hash = $(hash);
  } catch (ex) {
    $hash = [];
  }

  if(hash.indexOf('maintainScroll=1') > -1)
    return undefined;

  if ($hash.length)
    return $hash.offset().top;

  return 0;
}

//Do the scroll, after the DOM update so that the position can be correct
var scheduleScroll = function () {
  Tracker.afterFlush(function () {
    var position = getScrollToPosition();
    scrollTo(position);
  });
};

var flowScroll = function (newRoute) {
  if(newRoute.queryParams.maintainScroll)
    return; // flow router does not support #
  else if(newRoute.context.pathname.indexOf("#") == -1)
    scrollTo(0);
  else
    scheduleScroll();
}

function ironWhenReady (callFn) {
  return function () {
    var self = this;
    self.next();
    // XXX in iron, why do we abort if not ready, shouldn't we try once ready?
    if (self.ready()) callFn();
  }
}

function scrollTo (position) {
  $('body,html').animate({
    scrollTop: position
  }, RouterAutoscroll.animationDuration);
}

if (Package['iron:router']) {
  Package['iron:router'].Router.onRun(ironWhenReady(scheduleScroll));
  Package['iron:router'].Router.onStop(saveScrollPosition);
}

if (Package["kadira:flow-router"]) {
  Package["kadira:flow-router"].FlowRouter.triggers.enter([flowScroll]);
  Package["kadira:flow-router"].FlowRouter.triggers.exit([saveScrollPosition]);
}

if (Package["kadira:flow-router-ssr"]) {
  Package["kadira:flow-router-ssr"].FlowRouter.triggers.enter([flowScroll]);
  Package["kadira:flow-router-ssr"].FlowRouter.triggers.exit([saveScrollPosition]);
}

if (Package["meteorhacks:flow-router"]) {
  Package["meteorhacks:flow-router"].FlowRouter.triggers.enter([flowScroll]);
  Package["meteorhacks:flow-router"].FlowRouter.triggers.exit([saveScrollPosition]);
}

if (Package["meteorhacks:flow-router-ssr"]) {
  Package["meteorhacks:flow-router-ssr"].FlowRouter.triggers.enter([flowScroll]);
  Package["meteorhacks:flow-router-ssr"].FlowRouter.triggers.exit([saveScrollPosition]);
}

HotCodePush.start.then(function () {
  var currentScroll = $(window).scrollTop();
  scrollPositions.set("HotCodePushScrollPosition", currentScroll);
});

HotCodePush.end.then(function () {
  backToPosition = scrollPositions.get("HotCodePushScrollPosition");
  if (backToPosition) {
    scheduleScroll();
  }
})

RouterAutoscroll.scrollPositions = scrollPositions;
