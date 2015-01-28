// Scroll up to the top of page or to hash after changing routes.
scrollToTop = function () {
  var self = this;

  if (self.ready()) {
    // defer until after the DOM update so that the position can be correct
    Tracker.afterFlush(function () {
      var current = self.route.name;
      var hash = window.location.hash;
      var position;
      var animationTime = 200;

      if ($(hash).length) {
        position = $(hash).offset().top;
      }
      else {
        position = 0;
      }

      $('body').animate({
        scrollTop: position
      }, animationTime);
    });
  }
};

if (Meteor.isClient) {
  if (Package['iron:router']) {
    Package['iron:router'].Router.onAfterAction(scrollToTop);
  }
}
