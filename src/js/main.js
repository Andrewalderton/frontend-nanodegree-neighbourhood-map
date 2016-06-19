"use strict";


// *******************************
// *         DATA MODEL          *
// *******************************


var places = [
	{
		id: '1',
		name: 'Brit Bar',
		address: '118 High St, Weston-super-Mare',
		lat: 51.35045615524592,
		lng: -2.9788606936460815,
		info: 'Amazing beer, some of which is brewed in the pub!',
		tags: ['bars', 'pubs', 'nightlife']
	},
	{
		id: '2',
		name: 'The Imperial Brasserie',
		address: '14 S Parade, Weston-super-Mare',
		lat: 51.35009059655817,
		lng: -2.9801435218494827,
		info: 'Popular pub and restaurant with live music',
		tags: ['bars', 'pubs', 'restaurant']
	},
	{
		id: '3',
		name: 'Yates\'s',
		address: '12-20 Regent St, Weston-super-Mare',
		lat: 51.347643,
		lng: -2.979869842529297,
		info: 'Lively chain venue with typical English decor, a menu of pub classics and regular promotions',
		tags: ['bars', 'pub', 'restaurant', 'nightlife']
	},
	{
		id: '4',
		name: 'Cabot Court Hotel',
		address: '1 Knightstone Rd, Weston-super-Mare',
		lat: 51.35040093628007,
		lng: -2.9824093625121386,
		info: 'Down-to-earth rooms in a Regency property with original period features and free Wi-Fi',
		tags: ['hotel', 'bars', 'pubs', 'restaurant', 'nightlife']
	},
	{
		id: '5',
		name: 'Tavern Inn The Town',
		address: '57-59 Regent St, Weston-super-Mare',
		lat: 51.34748360652798,
		lng: -2.9772897607097013,
		info: 'Pub',
		tags: ['pubs', 'bars']
	},
	{
		id: '6',
		name: 'Grand Pier',
		address: 'Marine Parade, Weston-super-Mare',
		lat: 51.3477831763546,
		lng: -2.9860496520996094,
		info: 'Seaside pier with land train, indoor rides, arcade machines plus candy floss, ice cream and tearoom.',
		tags: ['attractions', 'pier', 'family']
	},
	{
		id: '7',
		name: 'SeaQuarium',
		address: '7 Marine Parade, Weston-super-Mare',
		lat: 51.342676890571425,
		lng: -2.981543956657001,
		info: 'Aquarium on its own pier, with a touch pool and species including jellyfish, piranhas, puffer fish.',
		tags: ['aquarium', 'attractions', 'family']
	},
	{
		id: '8',
		name: 'Puxton Park',
		address: 'Cowslip Ln, Hewish',
		lat: 51.36167545078643,
		lng: -2.8707474652563634,
		info: 'All-weather adventure park with soft play, aerial climbing and slides in 40 acres of countryside. ',
		tags: ['farm', 'attractions', 'family', 'adventure']
	},
	{
		id: '9',
		name: 'Weston-Super-Mare Railway Station (WSM)',
		address: 'Station Approach, Weston-super-Mare',
		lat: 51.34432029845645,
		lng: -2.971680685877802,
		info: 'Railway Station',
		tags: ['trains', 'stations', 'railway']
	},
	{
		id: '10',
		name: 'Weston Milton Railway Station (WNM)',
		address: 'Saville Rd., Weston-super-Mare',
		lat: 51.34847052431751,
		lng: -2.9424023628234885,
		info: 'Weston Milton railway station serves the Milton and Locking Castle areas of Weston-super-Mare in North Somerset, England.',
		tags: ['trains', 'stations', 'railway']
	},
	{
		id: '11',
		name: 'Worle Railway Station (WOR)',
		address: 'Park Way, Weston-super-Mare',
		lat: 51.35794719120777,
		lng: -2.909366341787722,
		info: 'Worle railway station, on the Bristol to Exeter Line, serves the Worle, West Wick and St Georges suburbs of Weston-super-Mare in North Somerset, England.',
		tags: ['trains', 'stations', 'railway']
	}
];




// *******************************
// *         MAP         *
// *******************************


var map;
function initMap() {
	// Map styling adapted from snazzymaps.com
	var mapOptions = [{"featureType": "landscape", "stylers": [{"hue":"#FFBB00"}, { "saturation": 43.400000000000006 }, {"lightness": 37.599999999999994 }, {"gamma": 1 }]}, {"featureType": "road.highway", "stylers": [{ "hue": "#FFC200"}, {"saturation": -61.8}, {"lightness": 45.599999999999994}, {"gamma": 1}]}, {"featureType": "road.arterial","stylers":[{"hue": "#FF0300"}, {"saturation": -100}, {"lightness": 51.19999999999999}, {"gamma": 1}]}, {"featureType": "road.local","stylers":[{"hue": "#FF0300"}, {"saturation":-100}, {"lightness": 52}, {"gamma": 1}]}, {"featureType": "water", "stylers":[{"hue": "#0078FF"}, {"saturation": -13.200000000000003}, {"lightness": 2.4000000000000057}, {"gamma": 1}]}, {"featureType": "poi", "stylers":[{"hue": "#00FF6A"}, {"saturation": -1.0989010989011234}, {"lightness": 11.200000000000017}, {"gamma": 1}]}]
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 51.3517278, lng: -2.9497165},
        scrollwheel: false,
        zoom: 12,
        styles: mapOptions
    });

	ko.applyBindings(new KoViewModel());
}

// Error handling function for Google Map
function googleError() {
	alert('Error: Your Google Map has failed to load');
}




// *******************************
// *          VIEW MODEL         *
// *******************************


var KoViewModel = function() {
    var self = this;

	// Animate the scroll when #main-header is clicked.
	self.click = function() {
		$('html, body').animate({
        	scrollTop: $("#list-view").offset().top }, 'slow'
        );
	};

	// Place Object
	var Place = function(place) {
		// Information used from the provided data model.
		this.id = place.id;
		this.name = place.name;
		this.address = place.address;
		this.lat = place.lat;
		this.lng = place.lng;
		this.tags = place.tags;
		this.info = place.info;
		this.latLng = {lat: place.lat, lng: place.lng};
	};

	var infowindow = new google.maps.InfoWindow();

	self.activeClick = ko.observable();
	self.collapsed = ko.observable(false);

	self.venueUrl = ko.observable();
    self.venuePhone = ko.observable();
    self.infoArray = ko.observableArray();

	self.infoError = ko.observable(false);
	self.ajaxError = ko.observable(false);
	self.visiblePhotos = ko.observableArray();
	self.flickrImg = ko.observable();
	self.ownerId = ko.observable();

	// Create observable array to hold each place from the data model.
    self.allPlaces = ko.observableArray();

	places.forEach(function(place) {
	    self.allPlaces().push(new Place(place));
	});

    // Build Markers via the Maps API and place them on the map.
    self.allPlaces().forEach(function(place) {
	    var markerOptions = {
	      position: place.latLng,
	      map : map,
		  animation: google.maps.Animation.DROP
	    };

	   place.marker = new google.maps.Marker(markerOptions);

	    // Open infowindow and trigger marker animation when clicked.
	    place.marker.addListener('click', function() {
		 	infowindow.open(map, place.marker);
		 	place.marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){place.marker.setAnimation(null);}, 1450);
			// Get data for the infowindow.
			self.listClick(place);
			self.infoRequest(place);
			self.photoRequest(place);
		});
    });

	self.visiblePlaces = ko.observableArray();
	// Push places into visiblePlaces array, so all markers are visible when page loads.
	self.allPlaces().forEach(function(place) {
	    self.visiblePlaces.push(place);
	});

	// Keep constant awareness of user input along with data-bind on <input> element.
	self.userInput = ko.observable('');

	// Create array of place names for use with autocomplete plugin.
	var filterNames = [];
	self.allPlaces().forEach(function(place) {
		filterNames.push(place.name);
	});

	// Auto-complete jquery plugin.
	$(function() {
		$( "#filter" ).autocomplete({
		    source: filterNames,
		    autoFocus: true,
		});
	});

	// Run the filterInput function when enter key is pressed.
	self.enterKey = function(data, event) {
		if (event.keyCode == "13") {
			self.filterInput();
		} else {
		self.filterMarkers();
		}
	};

	// Function to run whenever 'enter' key pressed, or search icon is clicked.
	self.filterInput = function() {
		// Update the userInput, as the input binding does not
		// recognise when an autocomplete suggestion is clicked.
		var filterInput = $('#filter').val();
		self.userInput(filterInput);
		self.filterMarkers();
		// Clear the search bar after list-view and markers have been filtered.
		self.userInput(undefined);
	};

	// Check user input string against place names and tags.
	self.filterMarkers = function() {
		// Clear current places from the view.
	    self.visiblePlaces.removeAll();
	    infowindow.close();
	    self.collapsed(false);
		self.activeClick(false);

	    var searchInput = self.userInput().toLowerCase();

	    // Look at place names and tags to determine if the user input matches.
	    self.allPlaces().forEach(function(place) {
	        place.marker.setVisible(false);
	        if ((place.name.toLowerCase().indexOf(searchInput) !== -1) || (place.tags.indexOf(searchInput) !== -1)) {
	            self.visiblePlaces.push(place);
	        }
	    });

	    // Set any matching markers to appear on the map.
	    if (self.visiblePlaces().length > 0) {
	    	self.visiblePlaces().forEach(function(place) {
	        	place.marker.setVisible(true);
	    	});
		}
	};

	// Filter locations by tags when navbar buttons clicked.
	self.filterPlaces = function(type) {
		infowindow.close();
		self.visiblePlaces.removeAll();
		self.collapsed(false);
		self.activeClick(false);

		self.allPlaces().forEach(function(place) {
			place.marker.setVisible(false);
			if (place.tags.indexOf(type) !== -1) {
				self.visiblePlaces.push(place);
			}
		});

		if (self.visiblePlaces().length > 0) {
	    	self.visiblePlaces().forEach(function(place) {
	        	place.marker.setVisible(true);
	    	});
		}
	};

	// Toggle 'active' class for filter buttons.
	self.toggle = function(id) {
		var el = document.getElementById(id);
		var elementList = document.querySelectorAll('li');
		elementList.forEach(function(element) {
			element.classList.remove('active');
		});
		el.classList.add('active');
	};

	// Reset the view when reset button or navbar header are clicked.
	self.showAllPlaces = function() {
		infowindow.close();
		self.visiblePlaces.removeAll();
		self.collapsed(false);
		self.activeClick(false);

		self.allPlaces().forEach(function(place) {
	    	self.visiblePlaces.push(place);
		});
		self.visiblePlaces().forEach(function(place) {
	        place.marker.setVisible(true);
	    });
	};

	// Activate infowindow when list item is clicked.
	self.markerTrigger = function(data) {
    	google.maps.event.trigger(data.marker, 'click');
	};

	// Toggle visibility of list item information when a marker is clicked.
    self.listClick = function(data) {
        self.activeClick(data.id);
		data.collapsed = ko.computed(function() {
        	return (self.collapsed(false) ) ? 'collapse in' + self.activeClick() : 'collapsed' + self.activeClick() ;
    	}, self);
		self.collapsed(data.collapsed());
	};




	// *******************************
	// *       AJAX REQUESTS         *
	// *******************************


	// Trigger Foursquare Ajax request.
	self.infoRequest = function(place) {
		// reset error status
		self.ajaxError(false);
		self.infoError(false);

		// Clear current url and phone number.
		self.venueUrl(null);
    	self.venuePhone(null);
    	self.infoArray(null);

        var venue = ko.observable();
        place.url = ko.observable(place.url);
        place.phone = ko.observable(place.phone);
        var infoArray = [];

        var foursquareUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +place.lat+ ',' +place.lng+ '&intent=match&name='+place.name+'&client_id=OXYOWWZSQILOKF21ZNLDZ0050FIJMRRBG0RPKSH2ZEEVUDEV&client_secret=UNWECJ2HMPBYHOWT4ZK0MK4ZDOFE5CRQYQIT514ZNU3V2DCP&v=20160519';

        $.getJSON(foursquareUrl, function(data) {
	    	venue = data.response.venues[0];

			if ((venue !== undefined) && (venue.hasOwnProperty('url'))) {
				self.venueUrl('<a href="' + venue.url + '">' + venue.url + '</a>');
				infoArray.push('<h6>Contact:</h6><a href="' + venue.url + '">' + venue.url + '</a><br>');
			}
			if ((venue !== undefined) && (venue.hasOwnProperty('contact')) && (venue.contact.hasOwnProperty('formattedPhone'))) {
				self.venuePhone(venue.contact.formattedPhone);
				infoArray.push(venue.contact.formattedPhone + '<br>');
			}

			if (infoArray[0] === undefined) {
				// Set content for when information not available.
				self.infoArray('<h5>' + place.name + '</h5><br>' + '<h6>Address: </h6>' + place.address + '<br><p class="info-error"><br>Phone and Website information currently unavailable.</p>');
				self.infoError(true);
			} else {
				self.infoArray('<h5>' + place.name + '</h5><br>' + infoArray.join("") + '<p class="info-error"><em>provided by Foursquare</em></p><h6>Address: </h6>' + place.address);
			}

		}).fail(function() {
        	self.ajaxError(true);
            self.infoArray('<h5>' + place.name + '</h5><br>' + '<h6>Address: </h6>' + place.address + '<br><p class="info-error"><br>Phone and Website information currently unavailable.</p>');
        });
	};

	// Flickr photo API request.
	self.photoRequest = function(place) {
		place.apiTimeout = setTimeout(function() {
	        self.ajaxError(true);
	    }, 5000);

		// Reset error status.
		self.ajaxError(false);
		self.visiblePhotos(null);
		var photoArray = [];
		var flickrKey = '153430b4e3a967170f237d09583ee9f1';
	    var placeName = place.name;
	    var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
	    place.apiTimeout;

	    $.getJSON(flickrAPI, {
	        api_key: flickrKey,
	        extras: "geo",
	        has_geo: 1,
	        per_page: 3,
	        tags: placeName,
	        tagmode: "all",
	        format: "json",
	        nojsoncallback: 1
	    }).done(function(data) {
	    	if (data.photos.total != '0') {
	    		clearTimeout(place.apiTimeout);
	            var allPhotos = data.photos.photo;

	            allPhotos.forEach(function(photo){
	                // Build the url of the photo in order to link to it.
	     			self.flickrImg('src="http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_z.jpg">');
	  				photoArray.push('<img ' + self.flickrImg());
	  				// Get the user ID to be used for flickr attribution.
	  				self.ownerId('<br><em><p class="info-error">flickr photo from <a  href="http://www.flickr.com/photos/' + photo.owner + '">flickr.com/photos/' + photo.owner + '</a></p></em>');
	  				photoArray.push(self.ownerId());
	  				self.visiblePhotos(photoArray.join(""));
	            });
	            // Set infowindow content.
	            infowindow.setContent(self.infoArray() + '<br><br>' + '<img class="window-img" ' + photoArray[0] + photoArray[1]);

            } else {
            	infowindow.setContent(self.infoArray() + '<p class="info-error">No photos found for this location.</p>');
            	clearTimeout(place.apiTimeout);
        		self.ajaxError(true);
        	}
        }).fail(function() {
        	self.ajaxError(true);
            infowindow.setContent(self.infoArray() + '<p class="info-error">No photos found for this location.</p>');
        });
	};
};

