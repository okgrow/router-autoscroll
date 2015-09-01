RouterAutoscroll = {
  animationDuration: 200,
};

var backToPosition;
//TODO survive a hot code push using a ReactiveDict
RouterAutoscroll.scrollPositions = {};

function saveScrollPosition () {
  RouterAutoscroll.scrollPositions[window.location.href] = $(window).scrollTop();
};

//TODO use history state so we don't litter
window.onpopstate = function () {
  backToPosition = RouterAutoscroll.scrollPositions[window.location.href];
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

  var hash = window.location.hash,
      $hash = $(hash);

  if(hash.indexOf('maintainScroll=1') > -1)
    return undefined;

  if ($hash.length)
    return $hash.offset().top;

  return 0;
}

//Do the scroll, after the DOM update so that the position can be correct
var smartlyScroll = function () {
  Tracker.afterFlush(function () {
    var position = getScrollToPosition();
    scrollTo(position);
  });
};

function ironRouterSmartScroll () {
  var self = this;
  self.next();
  // XXX why do we abort if not ready, shouldn't we try once ready?
  if (self.ready()) smartlyScroll();
}

function scrollTo (position) {
  $('body,html').animate({
    scrollTop: position
  }, RouterAutoscroll.animationDuration);
}

if (Package['iron:router']) {
  Package['iron:router'].Router.onStop(saveScrollPosition);
  Package['iron:router'].Router.onRun(ironRouterSmartScroll);
}

if (Package["kadira:flow-router"]) {
  Package["kadira:flow-router"].FlowRouter.triggers.enter([smartlyScroll]);
  Package["kadira:flow-router"].FlowRouter.triggers.exit([saveScrollPosition]);
}
