IronRouterAutoscroll = {
  animationDuration: 200,
};

var scrollPositions = {};
var backToPosition;

// Keep track of the last position for every page in case we return to it
// via the back button or history.
// TODO we should probably be keeping this in history.state rather than having
// a scrollPositions object
var saveScrollPosition = function () {
  scrollPositions[window.location] = $(window).scrollTop();
};

window.onpopstate = function(event) {
  // We used the back button, find the position we were at on that page
  // last time
  backToPosition = scrollPositions[window.location];
};

// Scroll to the right place after changing routes. "The right place" is:
// 1. The previous position if we're returning via the back button
// 2. The element whose id is specified in the URL hash
// 3. The top of page otherwise
var smartlyScroll = function () {
  var self = this;

  if (Package['iron:router']) {
    // XXX why do we need to call next() here ?
    self.next();
    // XXX why do we abort if not ready, shouldn't we try once ready?
    if( !self.ready()) return;
  }

  // defer until after the DOM update so that the position can be correct
  Tracker.afterFlush(function () {
    var hash = window.location.hash;
    if(hash.indexOf('maintainScroll=1') > -1) return;

    var position;

    if (backToPosition) {
      position = backToPosition;
      backToPosition = null;
    } else if ($(hash).length) {
      position = $(hash).offset().top;
    }
    else {
      position = 0;
    }

    $('body,html').animate({
      scrollTop: position
    }, IronRouterAutoscroll.animationDuration);
  });

};

if (Package['iron:router']) {
  Package['iron:router'].Router.onStop(saveScrollPosition);
  Package['iron:router'].Router.onRun(smartlyScroll);
}

if (Package["kadira:flow-router"]) {
  Package["kadira:flow-router"].FlowRouter.triggers.enter([smartlyScroll]);
  Package["kadira:flow-router"].FlowRouter.triggers.exit([saveScrollPosition]);

}
