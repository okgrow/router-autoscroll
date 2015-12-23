Package.describe({
  name: 'okgrow:router-autoscroll',
  version: '0.1.6',
  summary: 'Smart management of scroll position across route changes for Iron and Flow Router',
  git: 'https://github.com/okgrow/router-autoscroll',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.use('promise@0.4.1');
  api.use('reactive-dict');
  api.use('reload');
  api.use('iron:router@1.0.7', 'client', {weak: true});
  api.use('kadira:flow-router@2.6.2', 'client', {weak: true});
  api.addFiles('client/hot-code-push.js', 'client');
  api.addFiles('client/router-autoscroll.js', 'client');
  api.export('RouterAutoscroll', 'client');
});
/* Package updated by okgrow:package-linter */

// TODO
// Package.onTest(function(api) {
//   api.use('tinytest');
//   api.use('router-autoscroll');
//   api.addFiles('test/client/router-autoscroll-tests.js');
// });
