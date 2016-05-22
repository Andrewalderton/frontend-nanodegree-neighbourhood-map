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
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.HYBRID
    });

	var infowindow = new google.maps.InfoWindow();



// Place Object
var Place = function(place) {
	// info from provided data model
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




// *******************************
// *          VIEW MODEL         *
// *******************************


var KoViewModel = function() {
    var self = this;
    self.venueUrl = ko.observable();
    self.venuePhone = ko.observable();

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

	    place.marker.addListener('click', function() {
		 	infowindow.open(map, place.marker);
		 	infowindow.setContent('<h5>' + place.name() + '</h5><br>' + place.address());
		 	place.marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){place.marker.setAnimation(null);}, 1450);
		});
    });

	self.visiblePlaces = ko.observableArray();

	// Push places into visiblePlaces array, so all markers are visible when page loads.
	self.allPlaces().forEach(function(place) {
	    self.visiblePlaces.push(place);
	});

	// This, along with the data-bind on the <input> element, lets KO keep
	// constant awareness of what the user has entered.
	self.userInput = ko.observable('');

	// Check user input string against place names and tags.
	// Matching markers remain; all other markers are removed.
	self.filterMarkers = function() {
	    var searchInput = self.userInput().toLowerCase();
	    self.visiblePlaces.removeAll();
	    infowindow.close();
	    $('.nav li').removeClass('active');

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


	// Filter Buttons Function
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

	// Reset filter when navbar header is clicked
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


	// Set markers to bounce when list-view items clicked
	// Trigger Foursquare Ajax request
	self.listClick = function(place) {
		self.venueUrl(null);
    	self.venuePhone(null);

        google.maps.event.trigger(place.marker, 'click');
        var venue = ko.observable();

        place.url = ko.observable(place.url);
        place.phone = ko.observable(place.phone);

        var foursquareUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +place.lat()+ ',' +place.lng()+ '&intent=match&name='+place.name()+'&client_id=OXYOWWZSQILOKF21ZNLDZ0050FIJMRRBG0RPKSH2ZEEVUDEV&client_secret=UNWECJ2HMPBYHOWT4ZK0MK4ZDOFE5CRQYQIT514ZNU3V2DCP&v=20160519';

        $.getJSON(foursquareUrl, function(data) {
	    	venue = data.response.venues[0];

			if ((venue !=undefined) && (venue.hasOwnProperty('url'))) {
				place.url(venue.url);
				self.venueUrl(venue.url);
			}
			if ((venue !=undefined) && (venue.hasOwnProperty('contact')) && (venue.contact.hasOwnProperty('formattedPhone'))) {
				place.phone(venue.contact.formattedPhone);
				self.venuePhone(venue.contact.formattedPhone);
			}

			if ((place.url() !=null || undefined ) && (place.phone() !=null || undefined)) {
				infowindow.setContent('<h5>' + place.name() + '</h5><br>' + place.url() + '<br>' + place.phone() + '<br>' + place.address());
			} else
			if ((place.url() !=null || undefined) && (place.phone() =null || undefined)) {
				infowindow.setContent('<h5>' + place.name() + '</h5><br>' + place.url() + place.address());
			} else
			if ((place.url =null || undefined) && (place.phone() !=null || undefined)) {
				infowindow.setContent('<h5>' + place.name() + '</h5><br>' + place.address() + '<br>' + place.phone());
			} else {
				infowindow.setContent('<h5>' + place.name() + '</h5><br>' + place.address());
			}
		});
	};
};

ko.applyBindings(new KoViewModel());




// *******************************
// *      OTHER FUNCTIONS        *
// *******************************


// Close previous list-view tab when another is selected
$(document).click(function (event) {
    var clickover = $(event.target);
    var $navbar = $(".collapse");
    var _opened = $navbar.hasClass("in");
    if (_opened === true && !clickover.hasClass("navbar-toggle")) {
        $navbar.collapse('hide');
    }
});

// Toggle 'active' class for filter buttons
var selector = '.nav li';

$(selector).on('click', function(){
    $(selector).removeClass('active');
    $(this).addClass('active');
});

// Change height of google map depending on screen size.
$(window).resize(function() {
    var h = $(window).height(),
        offsetTop = $(document.getElementsByClassName("navbar-default")).height(); // Calculate the top offset
    $('#map').css('height', (h - offsetTop));
    $('#map-view').css('height', (h - offsetTop));
}).resize();
}

// Set height of main-img to fit screen size.
function imgHeight() {
	$(document.getElementsByClassName("main-img")).height($(window).height());
	$(document.getElementById("map-view")).height($(window).height());
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




