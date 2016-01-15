'use strict';

const config = require('./config');

let storedScrollTop;
let getScrollTop = function() {
  return document.body.scrollTop;
};

Object.keys(config.servers).forEach((key) => {
  let router = key;
  let server = config.servers[key];

  Object.assign(module.exports, {
    [ router + ': scroll to a lower section by ID' ]: client => client
      .url(server)
      .resizeWindow(config.viewport.width, config.viewport.height)
      .waitForElementVisible('#one-html-visible', config.timeout)
      .click('#in-page-anchor')
      .pause(config.animationDuration)
      .verify.urlContains('#anchor-2')
      .getLocationInView('#anchor-2', function(res) {
        this.verify.equal(res.value.y, 0, 'anchor is at the top of the viewport');
      })
      .execute(getScrollTop, function(res) {
        // storing for later
        storedScrollTop = res.value;
      }),
    [ router + ': go to another route (you should arrive at the top)' ]: client => client
      .click('#other-page-without-anchor')
      .waitForElementVisible('#two-html-visible', config.timeout)
      .pause(config.animationDuration)
      .verify.urlContains('two')
      .execute(getScrollTop, function(res) {
        this.verify.equal(res.value, 0, 'viewport at top of page');
      }),
    [ router + ': go back (you should remain scrolled)' ]: client => client
      .click('#go-back')
      .waitForElementVisible('#one-html-visible', config.timeout)
      .pause(config.animationDuration)
      .verify.urlContains('#anchor-2')
      .execute(getScrollTop, function(res) {
        this.verify.equal(res.value, storedScrollTop, 'scroll is restored to where the user left off');
      })
  });

  if (router === 'iron-router') {
    module.exports.finish = client => client.end();
  } else {
    Object.assign(module.exports, {
      [ router + ': go to another page\'s middle' ]: client => client
        .click('#other-page-with-anchor')
        .waitForElementVisible('#two-html-visible', config.timeout)
        .pause(config.animationDuration)
        .verify.urlContains('two')
        .getLocationInView('#anchor-2', function(res) {
          this.verify.equal(res.value.y, 0, 'anchor is at the top of the viewport');
        }),
      [ router + ': go to page 2\'s top' ]: client => client
        .click('#go-to-top')
        .pause(config.animationDuration)
        .verify.urlContains('two#')
        .execute(getScrollTop, function(res) {
          this.verify.equal(res.value, 0, 'viewport at top of page');
        })
        .end()
    });
  }
});
