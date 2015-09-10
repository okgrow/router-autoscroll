FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "One"});
  }
});

FlowRouter.route('/one', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "One"});
  }
});
FlowRouter.route('/two', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "Two"});
  }
});
