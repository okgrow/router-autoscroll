FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "blogHome"});
  }
});

FlowRouter.route('/links', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "links"});
  }
});
FlowRouter.route('/tables', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "tables"});
  }
});

FlowRouter.route('/:postId', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "blogPost"});
  }
});
