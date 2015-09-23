LayoutEngine = (typeof BlazeLayout === "undefined") ? FlowLayout : BlazeLayout;

FlowRouter.route('/', {
  action: function() {
    LayoutEngine.render("mainLayout", {content: "One"});
  }
});

FlowRouter.route('/one', {
  action: function() {
    LayoutEngine.render("mainLayout", {content: "One"});
  }
});
FlowRouter.route('/two', {
  action: function() {
    LayoutEngine.render("mainLayout", {content: "Two"});
  }
});
