Autoscroll for Iron Router
==========================

An [Iron Router](https://atmospherejs.com/iron/router) enhancement that improves navigation for pages that have more than one screen-ful of content.
It automatically scrolls to the top of the page after a route change,
or to an anchor/hash if one is present in the URL.

Why?
----

In The Old Days™ when you navigated to a new page the browser would unload the current page, load the new page, and position the viewport to the top of the page.
If the link had an anchor/hash (e.g. `#something`) the browser would scroll down to the top of the element with that id.

When changing routes using Iron Router the browser doesn't technically load a new page,
it just changes content in the existing page (as far as the browser is concerned) so it doesn't scroll to the top.
The viewport stays in the same place it was already.
So when navigating from a page that's scrolled down already this feels to the user like navigating to a new page and being scrolled partway down, which feels unnatural.


Other notes
---------------

This package enhances Iron Router.
If Iron Router isn't already added to the app it does nothing (it doesn't automatically add Iron Router for you).
