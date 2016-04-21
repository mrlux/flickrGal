# flickrGal

flickrGal is a fully responsive, easy to use gallery utilising the flickr api. It pulls specified image collections from a flickr account.

Written purely in javascript, with no external dependencies.

[Download flickGal](https://raw.githubusercontent.com/bluefantail/flickrGal/master/flickrgal.zip)

[View Demo](http://bluefantail.github.io/flickrGal)

# Usage

To get going with flickrGal, set `flickrApiKey`, `flickrApiSecret`, and `flickrUserId` in flickrgal.js to the values obtained by requesting your flickr api key. See [flickr's instructions](https://www.flickr.com/services/apps/create) for info on how to request that.

``` javascript
var flickrApiKey = '35ca9893a15649318240594ad7dd98e7'; // Change to your flickr api key
var flickrApiSecret = 'c440757b04345ffe'; // Change to your flickr api secret
var flickrUserId = '141088533@N02'; // Change to your flickr User ID
```

> Note - remember not to use your api key for anything important in production, I haven't provided any method for storing api keys here. That bit's up to you.

Then simply add the flickrGal div somewhere on your page.
``` html
<div id="flickrgal" data-collections='["all"]'></div>
```

Use the collections data attribute to specify which collections you want to load. `all` will load every photoset from every collection.
Collections can also be specified individually like so:

``` html
<div id="flickrgal" data-collections='["My Collection", "Another Collection"]'></div>
```

The gallery will expand to the full width of whatever container it's inside, and behave according to the defined grid and breakpoints (more about those in configuration). 

# Configuration

## CSS

If you're using the included sass in your project, various aspects of the flickrGal layout and style are easy to configure. Important ones are at the top of [flickrgal.scss](https://github.com/bluefantail/flickrGal/blob/master/_sass/flickrgal.scss)

### Image Ratio

Images maintain a constant ratio in the grid, and re-flow accordingly. Ratio's can be set using fraction's in replace of ratio's. E.g. 16:9 would be 16/9.

``` scss
$aspect-ratio: 4/3; // e.g. 4/3 == 4:3
```

### Image padding

Padding, or space between images can be adjusted using the `$image-padding` variable.

``` scss
$image-padding: 5px;
```

### Colours

Colours can be set using the following variables:

``` scss
// Colours
$primary-accent: #0076E3; // Main gallery accent colour
$secondary-accent: #ff1981; 
$lightbox: #000B10;
```

### Breakpoints
### Grid
# Browser Compatibility
# Development