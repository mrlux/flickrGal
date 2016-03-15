var flickrApiKey = '35ca9893a15649318240594ad7dd98e7';
var flickrApiSecret = 'c440757b04345ffe';
var flickrUserId = '141088533@N02';

// Endpoint url and params
var endpoint = 'https://api.flickr.com/services/rest/?method=';
var params = '&api_key=' 
	+ flickrApiKey 
	+ '&user_id=' 
	+ flickrUserId;

// Request methods
var methodCollection = 'flickr.collections.getTree';
var methodPhotos = 'flickr.photosets.getPhotos';

var lightboxSet = []; // Stores the set of images open in lightbox
var prevState = []; // Stores objects to be re-inserted later
var albums = []; // Stores full photoset information

// Lightbox Template
var lightboxTemplate = document.createElement('div');
	lightboxTemplate.id = 'lightbox';
	lightboxTemplate.className = 'hide';
var lightboxUi = document.createElement('div');
	lightboxUi.id = 'lightbox-ui';
var imageStageEl = document.createElement('div');
	imageStageEl.id = 'stage';

var	lightboxControls = '<div class="close" title="Close (Esc)"></div>'
	+ '<div id="controls"><div id="arrow-left" class="prev" title="Prev"></div>'
	+ '<div id="arrow-right" class="next" title="Next"></div></div>'; 
var	infoEl = '<div id="info_container"><div id="info"><div id="title"></div>'
	+ '<div id="description"></div></div></div>';
var imageBoxEl = '<div id="image-box-container"><div><div id="image-box"></div></div></div>';

lightboxUi.innerHTML = lightboxControls + infoEl;
imageStageEl.innerHTML = imageBoxEl;
lightboxTemplate.appendChild(lightboxUi);
lightboxTemplate.appendChild(imageStageEl);
// End Lightbox Template

// FUNCTIONS
//Event Handlers
function handle_click(event){
	var el = event.currentTarget;
	var type = el.className;
	switch(type){
		case 'album':
			var requestedAlbum = el.id;
			gallery.innerHTML = "";
			backButton.classList.remove('hide');
			build_images(requestedAlbum);
			break;
		case 'image': 
			var	requestedImage = el.id;
			var album = el.getAttribute('album-id');
			lightbox.classList.remove('hide');
			build_lightbox(requestedImage, album);
			break;
		case 'navigate-back':
			gallery.innerHTML = "";
			for(var node in prevState){
				element = prevState[node];
				gallery.appendChild(element);
			}			
			backButton.classList.add('hide');
			loadingMessage.style.display = 'none';
			break;
		case 'close':
			lightbox.classList.add('hide');
			break;
		case 'prev':
			prev();
			break;
		case 'next':
			next();
			break;
	}
}
function handle_keys(event){
	var key = event.keyCode;
	switch(key){
		case 39:
			next();
			break;
		case 37:
			prev();
			break;
		case 27:
			lightbox.classList.add('hide');
			break;
	}
}
//End Event Handlers
function prev(){
	document.getElementById(lightboxSet[0]).classList.add('hide', 'hide-stage-image');
	var move = lightboxSet.pop();
	lightboxSet.unshift(move);
	document.getElementById(lightboxSet[0]).classList.remove('hide', 'hide-stage-image');
}
function next(){
	document.getElementById(lightboxSet[0]).classList.add('hide', 'hide-stage-image');
	var move = lightboxSet.shift();
	lightboxSet.push(move);
	document.getElementById(lightboxSet[0]).classList.remove('hide', 'hide-stage-image');
}
// Create New blank elements
function Element(type){
	this.el = document.createElement('div'); 
	this.el.className = type;
	this.loading = document.createElement('div'); 
	this.loading.className = 'image-loading';
	this.inner = document.createElement('div'); 
	this.inner.className = 'inner';
	this.dummy = document.createElement('div'); 
	this.dummy.className = 'dummy';
	this.title = document.createElement('div');	
	this.desc = document.createElement('div');	
}
// Send new requests to flickr
function make_request(requestUrl, type, id){
	var flickrRequest = new XMLHttpRequest();
		flickrRequest.open('GET', requestUrl, true);
		flickrRequest.requestType = type;
		flickrRequest.requestID = id;
		flickrRequest.onload = handle_request;
		flickrRequest.send();
}
// Handle flickr requests
function handle_request(event) {
	// Todo - convert this request to Json
	var response = event.target;
	var	responseData = document.createElement('div');
		responseData.innerHTML = response.responseText;
	var	type = response.requestType;
	var	targetID = response.requestID;
	if (response.readyState === XMLHttpRequest.DONE) {
		if (response.status === 200) {
			console.log('Flickr ' + type + ' request succeed');
			console.log('Response Data:');
			console.log('XML Object:');
			console.log(responseData);

			switch (type){
				case 'collections':
					build_collections(responseData);
					break;
				case 'photosets':
					set_cover(responseData, targetID);
					break;
				case 'photo':
					break;
			}
		}else{
			console.log('Flickr ' + requestType + ' request failed!');
		}
	}
};
// Finds position in albums array for a given id
function get_album_pos(id){	
	var position = "";
	for (var album in albums){
		albums[album].album_id == id ? position = album : false 
	}
	return position;
}
// Appends background images and fades them in
function fade_in_image(id, url){
	var newElement = document.getElementById(id);
		newElement.style.backgroundImage = 'url(' + url + ')';
	var isLoading = newElement.querySelector('.image-loading');
		isLoading ? isLoading.style.opacity = 0 : false;
}
// 	Builds collections of albums from flickr 'photosets'
function build_collections(data) {
	// Build the albums for a collection
	var photosets = data.querySelectorAll('set');
	console.log('Image Sets:');

	loadingMessage.style.display = 'none';

	Array.prototype.forEach.call(photosets, function(photoset) {
		var newAlbum = new Element('album');		
		var albumID = photoset.id;

		albumTitle = photoset.getAttribute('title');
		// setDesc = photoSet.getAttribute('description'); // Not wired up

		newAlbum.el.id = albumID;
		newAlbum.title.innerHTML = albumTitle;

		newAlbum.inner.appendChild(newAlbum.title);
		newAlbum.el.appendChild(newAlbum.loading);
		newAlbum.el.appendChild(newAlbum.dummy);
		newAlbum.el.appendChild(newAlbum.inner);
		newAlbum.el.addEventListener('click', handle_click);
		gallery.appendChild(newAlbum.el);
		
		prevState.push(newAlbum.el);
	});
	// Request cover images for albums
	Array.prototype.forEach.call(photosets, function(photoset) {
		var url = endpoint 
			+ methodPhotos 
			+ '&photoset_id=' 
			+ photoset.id 
			+ params;

		make_request(url, 'photosets', photoset.id);
		albums.push({ album_id: photoset.id, images: [] });
	});
	console.log('Albums:');
	console.log(albums);

	// Initial gallery fade in
	gallery.classList.remove('hide');
};
function set_cover(data, id){
	// Organise and push image data to albums array
	var position = get_album_pos(id);
	var allImages = data.querySelectorAll('photo'); // Find photo tags in the xml
	Array.prototype.forEach.call(allImages, function(image) {
		var imageObject = {};
		imageObject.image_id = image.attributes.id.value;
		imageObject.farm = image.attributes.farm.value;
		imageObject.server = image.attributes.server.value;
		imageObject.secret = image.attributes.secret.value;
		imageObject.title = image.attributes.title.value;
		imageObject.is_primary = image.attributes.isprimary.value;
		albums[position].images.push(imageObject);

		if (imageObject.is_primary == 1) {
			var size = 'z';			
			var primaryImageUrl = 'https://farm' 
				+ imageObject.farm
				+ '.staticflickr.com/' 
				+ imageObject.server 
				+ '/' 
				+ imageObject.image_id 
				+ '_' 
				+ imageObject.secret
				+ '_' 
				+ size
				+ '.jpg';
			
			// Append image and fade it in
			fade_in_image(id, primaryImageUrl);
		}
	});
}
function build_images(id){
	var position = get_album_pos(id);
	var images = albums[position].images
	var size = 'z';
	
	Array.prototype.forEach.call(images, function(image) {
		var imageUrl = 'https://farm' 
		+ image.farm
		+ '.staticflickr.com/' 
		+ image.server 
		+ '/' 
		+ image.image_id 
		+ '_' 
		+ image.secret 
		+ '_' 
		+ size 
		+ '.jpg';

		var newImage = new Element('image');
		var imageID = image.image_id;

		newImage.el.id = imageID;
		newImage.el.setAttribute('album-id', id);

		// newImage.el.appendChild(newImage.loading);
		newImage.el.appendChild(newImage.dummy);
		newImage.el.appendChild(newImage.inner);
		newImage.el.addEventListener('click', handle_click);
		gallery.appendChild(newImage.el);
		
		// Append image and fade it in
		fade_in_image(imageID, imageUrl);
	});
}
function build_lightbox(id, album){	
	lightboxSet = [];
	var position = get_album_pos(album);
	var callingAlbum = albums[position].images;
	var stageID = 'stage-' + id;

	imageBox.innerHTML = '';
	Array.prototype.forEach.call(callingAlbum, function(image) {	
		var currentImage = document.getElementById(image.image_id);
		var initialUrl = currentImage.style.backgroundImage;
		var newImage = document.createElement('div');
			newImage.id = 'stage-' + image.image_id;
			newImage.classList.add('hide', 'hide-stage-image');
			newImage.style.backgroundImage = initialUrl;
			imageBox.appendChild(newImage);
			lightboxSet.push(newImage.id);
	});

	var activePos = lightboxSet.indexOf(stageID);
	var top = lightboxSet.slice(activePos);
	var bottom = lightboxSet.slice(0, activePos);

	lightboxSet = top.concat(bottom);

	document.getElementById(stageID).classList.remove('hide', 'hide-stage-image');
}

var gallery = document.querySelector('#gallery'); 
	gallery.className = 'hide';
var	galleryNavigation = '<div id="navigation-container"><div class="navigate-back hide"><div>Back</div></div></div>';
var	loadingGallery = '<div id="loading-gallery"><div>Loading...</div></div>';

if (gallery) {
	// Get the collection names
	var collectionNames = gallery.getAttribute('collections');
	var collectionNames = JSON.parse(collectionNames);

	// Defining vars and events for all elements inserted dynamically on page load
	gallery.insertAdjacentHTML('beforebegin', galleryNavigation);
	gallery.insertAdjacentHTML('beforebegin', loadingGallery);
	gallery.parentNode.appendChild(lightboxTemplate);
	var lightbox = document.querySelector('#lightbox');
	var imageBox = document.querySelector('#image-box');
	var loadingMessage = document.querySelector('#loading-gallery');
	
	var closeButton = document.querySelector('.close')
	var backButton = document.querySelector('.navigate-back');
	var prevButton = document.querySelector('.prev');
	var nextButton = document.querySelector('.next');
	
	closeButton.addEventListener('click', handle_click);
	backButton.addEventListener('click', handle_click);
	prevButton.addEventListener('click', handle_click);
	nextButton.addEventListener('click', handle_click);

	window.addEventListener('keydown', handle_keys);

	// Start Loading the gallery
	if (!collectionNames.indexOf("all")) {
		// Loads all the collections if 'all' is specified in collections data attribute
		console.log('Get all the collections');
	}else{
		console.log('Defined Collections: ' + collectionNames);
		// Make a collection request
		var url = endpoint
			+ methodCollection
			+ params;

		make_request(url, 'collections');
	}
}