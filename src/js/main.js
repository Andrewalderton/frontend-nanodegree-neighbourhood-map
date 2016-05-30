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


function initMap() {
    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 51.3517278, lng: -2.9497165},
        scrollwheel: false,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.HYBRID
    });

	var infowindow = new google.maps.InfoWindow();




// *******************************
// *          VIEW MODEL         *
// *******************************


var KoViewModel = function() {
    var self = this;

	// Place Object
	var Place = function(place) {
		// Information taken from provided data model
		this.id = ko.observable(place.id);
		this.name = ko.observable(place.name);
		this.address = ko.observable(place.address);
		this.lat = ko.observable(place.lat);
		this.lng = ko.observable(place.lng);
		this.tags = ko.observableArray(place.tags);
		this.info = ko.observable(place.info);
		this.latLng = {lat: place.lat, lng: place.lng};
		this.marker = ko.observable(null);
	};

	self.venueUrl = ko.observable();
    self.venuePhone = ko.observable();

	self.infoError = ko.observable(false);
	self.ajaxError = ko.observable(false);
	self.visiblePhotos = ko.observableArray();
	self.flickrImg = ko.observable();

	// Create observable array to hold each place from the data model.
    self.allPlaces = ko.observableArray();

	places.forEach(function(place) {
	    self.allPlaces().push(new Place(place));
	});

    // Build Markers via the Maps API and place them on the map.
    self.allPlaces().forEach(function(place) {
	    var markerOptions = {
	      position: place.latLng,
		  map: map,
		  animation: google.maps.Animation.DROP
	    };

	    place.marker = new google.maps.Marker(markerOptions);

	    // Open infowindow and trigger marker animation when clicked.
	    place.marker.addListener('click', function() {
		 	infowindow.open(map, place.marker);
		 	place.marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){place.marker.setAnimation(null);}, 1450);
			// Get data for the infowindow.
			self.infoRequest(place);
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
		filterNames.push(place.name());
	});

	// Auto-complete jquery plugin
	$(function() {
		$( "#filter" ).autocomplete({
		    source: filterNames,
		    autoFocus: true,
		});
	});

	// Run the filterInput function when enter key is pressed.
	window.addEventListener("keyup", checkKeyPressed, false);
	function checkKeyPressed(e) {
		if (e.keyCode == "13") {
			self.filterInput();
		}
	}

	// Function to run whenever 'enter' key pressed, or search icon is clicked.
	self.filterInput = function() {
		// Update the userInput, as the input binding does not
		//recognise when an autocomplete suggestion is clicked.
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
	    $('.nav li').removeClass('active');

	    var searchInput = self.userInput().toLowerCase();

	    // Look at place names and tags to determine if the user input matches.
	    self.allPlaces().forEach(function(place) {
	        place.marker.setVisible(false);
	        if ((place.name().toLowerCase().indexOf(searchInput) !== -1) || (place.tags().indexOf(searchInput) !== -1)) {
	            self.visiblePlaces.push(place);
	        }
	    });

	    // Set any matching markers to appear on the map
	    if (self.visiblePlaces().length > 0) {
	    	self.visiblePlaces().forEach(function(place) {
	        	place.marker.setVisible(true);
	    	});
		}
	};

	// Filter locations by tags when navbar buttons clicked
	self.filterPlaces = function(type) {
		infowindow.close();
		self.visiblePlaces.removeAll();

		self.allPlaces().forEach(function(place) {
			place.marker.setVisible(false);
			if (place.tags().indexOf(type) !== -1) {
				self.visiblePlaces.push(place);
			}
		});

		if (self.visiblePlaces().length > 0) {
	    	self.visiblePlaces().forEach(function(place) {
	        	place.marker.setVisible(true);
	    	});
		}
	};

	// Toggle 'active' class for filter buttons
	self.selected = function() {
		var selector = '.nav li';
		var listSelector = 'div.list-group > button';
	 	$(selector).on('click', function(){
	        $(selector).removeClass('active');
	    	$(this).addClass('active');
	 	});
		$(listSelector).on('click', function(){
		    $(listSelector).removeClass('active');
		    $(this).addClass('active');
		});
	};

	// Reset the view when navbar header is clicked
	self.showAllPlaces = function() {
		infowindow.close();
		self.visiblePlaces.removeAll();

		self.allPlaces().forEach(function(place) {
	    	self.visiblePlaces.push(place);
		});
		self.visiblePlaces().forEach(function(place) {
	        place.marker.setVisible(true);
	    });
	};

	// Close previous list-view tab when another is selected
	// Set markers to bounce when list-view items clicked
	self.listClick = function(place) {
		var clickover = $(place.target);
	    var $navbar = $(".collapse");
	    var _opened = $navbar.hasClass("in");
	    if (_opened === true && !clickover.hasClass("navbar-toggle")) {
	        $navbar.collapse('hide');
	    }
		google.maps.event.trigger(place.marker, 'click');
	};




	// *******************************
	// *       AJAX REQUESTS         *
	// *******************************


	// Trigger Foursquare Ajax request
	self.infoRequest = function(place) {
		// reset error status
		self.ajaxError(false);
		self.infoError(false);

		// Clear current url and phone number
		self.venueUrl(null);
    	self.venuePhone(null);

        var venue = ko.observable();
        place.url = ko.observable(place.url);
        place.phone = ko.observable(place.phone);
        var infoArray = [];

        var foursquareUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +place.lat()+ ',' +place.lng()+ '&intent=match&name='+place.name()+'&client_id=OXYOWWZSQILOKF21ZNLDZ0050FIJMRRBG0RPKSH2ZEEVUDEV&client_secret=UNWECJ2HMPBYHOWT4ZK0MK4ZDOFE5CRQYQIT514ZNU3V2DCP&v=20160519';

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

			infowindow.setContent('<h5>' + place.name() + '</h5><br>' + infoArray.join("") + '<h6>Address: </h6>' + place.address());

			if (infoArray[0] === undefined) {
				// Set content for when information not available
				infowindow.setContent('<h5>' + place.name() + '</h5><br>' + '<h6>Address: </h6>' + place.address());
				self.infoError(true);
			}
		}).fail(function() {
        	self.ajaxError(true);
            infowindow.setContent('<h5>' + place.name() + '</h5><br>' + '<h6>Address: </h6>' + place.address());
        });
	};

	// Flickr photo API request
	self.photoRequest = function(place) {
		// reset error status
		self.ajaxError(false);
		self.visiblePhotos.removeAll();
		var flickrKey = '153430b4e3a967170f237d09583ee9f1';
	    var placeName = place.name();
	    var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';

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

            var allPhotos = data.photos.photo;

            allPhotos.forEach(function(photo){
                // Build the url of the photo in order to link to it
     			self.flickrImg('<img src="http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_z.jpg">');
  				self.visiblePhotos.push(self.flickrImg());
            });
        }).fail(function() {
        	self.ajaxError(true);
            infowindow.setContent('<h5>' + place.name() + '</h5><br>' + '<h6>Address: </h6>' + place.address());
        });
	};
};

ko.applyBindings(new KoViewModel());




// *******************************
// *      OTHER FUNCTIONS        *
// *******************************


// Change height of google map depending on screen size.
$(window).resize(function() {
	var h = $(window).height(),
	    offsetTop = $(document.getElementsByClassName("navbar-default")).height();
	$('#map').css('height', (h - offsetTop));
	$('#map-view').css('height', (h - offsetTop));
}).resize();
}

// Set height of 'main-img' to fit screen size.
function imgHeight() {
	$('.main-img').height($(window).height());
	$('#map-view').height($(window).height());
}
imgHeight();

// Smooth Scrolling - https://css-tricks.com/snippets/jquery/smooth-scrolling/
$(function() {
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

        if (target.length) {
            $('html, body').animate({scrollTop: target.offset().top}, 1000);
            return false;
        }}
    });
});







