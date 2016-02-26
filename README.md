Autoscroll for Meteor
==========================

An [Iron Router](https://atmospherejs.com/iron/router) and [Flow Router](https://atmospherejs.com/kadira/flow-router) enhancement that improves navigation for pages that have more than one screen-full of content.
It causes the page to scroll to the right place after changing routes (which people are often surprised to find doesn't happen by default).

"The right place" is:

1. The previous position if we're returning via the back button, or
2. The element whose id is specified in the URL hash (if present), or
3. The top of page otherwise

Demo Sites
==========

You can see the behavior of each of the example sites at:

* http://flow-router-autoscroll.meteor.com/
* http://iron-router-autoscroll.meteor.com/

Why?
----

In The Old Days™ when you navigated to a new page the browser would unload the current page, load the new page, and position the viewport to the top of the page.
If the link had an anchor/hash (e.g. `#something`) the browser would scroll down to the top of the element with that id.

When changing routes using modern apps with client-side routers the browser doesn't technically load a new page,
it just changes content in the existing page (as far as the browser is concerned) so it doesn't scroll to the top.
The viewport stays in the same place it was already.
So when navigating from a page that's scrolled down already this feels to the user like navigating to a new page and being scrolled partway down, which feels unnatural.

Installation
----------

`meteor add okgrow:router-autoscroll`


Configuration
-----------

The animation speed defaults to 200 ms.
To change this use:

``` javascript
RouterAutoscroll.animationDuration = 100;
```

For some cases (top fixed elements), margins are needed.
To set this use:

``` javascript
RouterAutoscroll.marginTop = 50;
```

To navigate to a route and explicitly maintain scroll position, pass
`maintainScroll=1` in the hash:

Example (for `iron:router`):

```javascript
Router.go('newRoute', {}, {
  query: {q: 'newQuery'},
  hash: 'maintainScroll=1'
});
```

Hot Code Push
-----------

The scroll position will be restored after a hot code push.

Hot code pushes actually do a `window.location.reload()`, breaking
from the single-page-app (SPA) paradigm, but we use the HotCodePush
module to set up the saving/restoring of scroll position.

Known issues
------------

1. At present, this package cannot be used in combination with both `iron:router`
and `appcache`. The combination of the two packages does weird things to the
hashes in the URLs, and breaks routing completely. There seem to be no problems
when using `flow-router`. A PR that fixes this issue is very welcome.
1. There are a few edge cases which aren't supported yet (around navigation using the back button and pages which load dynamic content after the route change).
PR's are welcome.

Contributing
------------

Issues and Pull Requests are always welcome. Please read our [contribution guidelines](https://github.com/okgrow/guides/blob/master/contributing.md).

Other notes
---------------

This package enhances Iron Router, or Flow Router, whichever it detects, but it
does not force an install of either package since its dependency is declared as `{weak: true}`.

Running the Acceptance Tests
-----------

Requires Node version 4 or above. From the root folder of the project, run:

```
npm install
npm test
```

The required selenium server and chromedriver dependencies will be automatically installed inside the `node_modules` folder.
