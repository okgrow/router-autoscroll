RouterAutoscroll = {
  animationDuration: 200,
  marginTop: 0
};

var backToPosition;
// Saved positions will survive a hot code push
var scrollPositions = new ReactiveDict("okgrow-router-autoscroll");

// local variable for accessing jquery, if available
var _jQuery = false;

if (Package["jquery"]) {
  _jQuery = Package["jquery"].jQuery;
}

function saveScrollPosition () {
  scrollPositions.set(window.location.href, scrollTop());
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

  if(hash.indexOf('maintainScroll=1') > -1)
    return undefined;

  if (_jQuery) {
    try {
      //HTML5 allows all kinds of ids, so we can't whitelist characters, only
      //decide the hash doesn't represent a DOM id if we fail
      $hash = _jQuery(hash);
    } catch (ex) {
      $hash = [];
    }

    if ($hash.length)
      return $hash.offset().top;
  } else {
    try {
      $hash = document.querySelector(hash);
    } catch (ex) {
      $hash = false;
    }

    if ($hash)
      return $hash.getBoundingClientRect().top + scrollTop();
  }

  return 0;
}

//Do the scroll, after the DOM update so that the position can be correct
var scheduleScroll = function () {
  Tracker.afterFlush(function () {
    Meteor.defer(function () {
      var position = getScrollToPosition();
      scrollTo(position);
    });
  });
};

var flowScroll = function (newRoute) {
  var path = (newRoute.context && newRoute.context.pathname) || newRoute.path;
  if (path.indexOf("#") == -1)
    scrollTo(0);
  else
    scheduleScroll();
};

function ironWhenReady (callFn) {
  return function () {
    var self = this;
    self.next();
    // XXX in iron, why do we abort if not ready, shouldn't we try once ready?
    if (self.ready()) callFn();
  }
}

// use _jQuery if available, otherwise support IE9+
var scrollTop = function () {
  if (_jQuery) {
    return _jQuery(window).scrollTop();
  } else {
    // uses solution from http://stackoverflow.com/questions/871399/cross-browser-method-for-detecting-the-scrolltop-of-the-browser-window
    return document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
  }
}

var scrollTo = function (position) {
  if (_jQuery) {
    _jQuery('body,html').animate({
      scrollTop: position - RouterAutoscroll.marginTop
    }, RouterAutoscroll.animationDuration);
  } else {
    window.scroll(0, position - RouterAutoscroll.marginTop);
  }
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
  var currentScroll = scrollTop();
  scrollPositions.set("HotCodePushScrollPosition", currentScroll);
});

HotCodePush.end.then(function () {
  backToPosition = scrollPositions.get("HotCodePushScrollPosition");
  if (backToPosition) {
    scheduleScroll();
  }
});

RouterAutoscroll.scrollPositions = scrollPositions;
