Autoscroll for Iron Router
==========================

An [Iron Router](https://atmospherejs.com/iron/router) enhancement that improves navigation for pages that have more than one screen-ful of content.
It causes the page to scroll to the right place after changing routes (which people are often surprised to find doesn't happen by default with Iron Router).

"The right place" is:

1. The previous position if we're returning via the back button, or
2. The element whose id is specified in the URL hash (if present), or
3. The top of page otherwise


Why?
----

In The Old Days™ when you navigated to a new page the browser would unload the current page, load the new page, and position the viewport to the top of the page.
If the link had an anchor/hash (e.g. `#something`) the browser would scroll down to the top of the element with that id.

When changing routes using Iron Router the browser doesn't technically load a new page,
it just changes content in the existing page (as far as the browser is concerned) so it doesn't scroll to the top.
The viewport stays in the same place it was already.
So when navigating from a page that's scrolled down already this feels to the user like navigating to a new page and being scrolled partway down, which feels unnatural.

Installation
----------

`meteor add okgrow:iron-router-autoscroll`


Configuration
-----------

The animation speed defaults to 200 ms.
To change this use:

``` javascript
IronRouterAutoscroll.animationDuration = 100;
```

To navigate to a route and explicitly maintain scroll position, pass
`maintainScroll=1` in the hash:

Example:

```javascript
Router.go('newRoute', {}, {
  query: {q: 'newQuery'},
  hash: 'maintainScroll=1'
});
```

Known issues
-----------

After a hot code push it stops working due to [a bug in Iron Router](https://github.com/iron-meteor/iron-router/issues/1219).
Manually reloading the page fixes is a workaround in development.

There are a few edge cases which aren't supported yet (around navigation using the back button and pages which load dynamic content after the route change).
PR's are welcome.

Other notes
---------------

This package enhances Iron Router.
If Iron Router isn't already added to the app it does nothing (it doesn't automatically add Iron Router for you).
