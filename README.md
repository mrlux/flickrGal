# flickrGal

flickrGal is a simple, easy to use gallery utilising the flickr api. It pulls specified image collections from a flikr account. 

Written in pure javascript, with no external dependencies. 

# Usage

To get going with flickrGal, set `flickrApiKey`, `flickrApiSecret`, and `flickrUserId` in flickrgal.js to the values obtained by requesting your flickr api key. See [Here](https://www.flickr.com/services/apps/create) for info on how to request one.

``` javascript
var flickrApiKey = '35ca9893a15649318240594ad7dd98e7'; // Change to your flickr api key
var flickrApiSecret = 'c440757b04345ffe'; // Change to your flickr api secret
var flickrUserId = '141088533@N02'; // Change to your flickr User ID
```

Then simply add the flickrGal div somewhere on your page.
``` html
<div id="flickrgal" collections='["all"]'></div>
```

Use collections data attribute to specify which collections you want to load. `all` will load every photoset from every collection, and collections can be specified manually like so:

``` html
<div id="flickrgal" collections='["My Collection", "Another Collection"]'></div>
```

> Note - remember not to use your api key for anything important in production, I haven't provided any method for storing api keys here. That bit's up to you.

# Configuration
### Image Ratio