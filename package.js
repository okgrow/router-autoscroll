Package.describe({
  name: 'okgrow:router-autoscroll',
  version: '0.0.10',
  summary: 'Smart management of scroll position across route changes for Iron and Flow Router',
  git: 'https://github.com/okgrow/router-autoscroll',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.use(['tracker', 'reactive-dict', 'reload']);
  api.use('iron:router@1.0.7', 'client', {weak: true});
  api.use('kadira:flow-router@2.4.0', 'client', {weak: true});
  api.addFiles('client/router-autoscroll.js', 'client');
  api.export('RouterAutoscroll', 'client');
});

// TODO
// Package.onTest(function(api) {
//   api.use('tinytest');
//   api.use('router-autoscroll');
//   api.addFiles('test/client/router-autoscroll-tests.js');
// });
