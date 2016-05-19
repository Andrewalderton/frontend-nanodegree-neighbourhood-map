"use strict";


// *******************************
// *         DATA MODEL          *
// *******************************


var places = [
	{
		id: '1',
		name: 'Brit Bar',
		address: '118 High St, Weston-super-Mare',
		lat: 51.3504617,
		lng: -2.9786496,
		info: 'Amazing beer, some of which is brewed in the pub!',
		tags: ['bars', 'pubs', 'nightlife']
	},
	{
		id: '2',
		name: 'The Imperial Public House',
		address: '14 S Parade, Weston-super-Mare',
		lat: 51.3502151,
		lng: -2.9802191,
		info: 'Popular pub and restaurant with live music',
		tags: ['bars', 'pubs', 'restaurant']
	},
	{
		id: '3',
		name: 'Yates\'s',
		address: '12-20 Regent St, Weston-super-Mare',
		lat: 51.3475307,
		lng: -2.9798097,
		info: 'Lively chain venue with typical English decor, a menu of pub classics and regular promotions',
		tags: ['bars', 'pub', 'restaurant', 'nightlife']
	},
	{
		id: '4',
		name: 'Cabot Court Hotel',
		address: '1 Knightstone Rd, Weston-super-Mare',
		lat: 51.3506475,
		lng: -2.981408,
		info: 'Down-to-earth rooms in a Regency property with original period features and free Wi-Fi',
		tags: ['hotel', 'bars', 'pubs', 'restaurant', 'nightlife']
	},
	{
		id: '5',
		name: 'The Tavern Inn The Town',
		address: '57-59 Regent St, Weston-super-Mare',
		lat: 51.3475274,
		lng: -2.97742,
		info: 'Pub',
		tags: ['pubs', 'bars']
	},
	{
		id: '6',
		name: 'The Grand Pier',
		address: 'Marine Parade, Weston-super-Mare',
		lat: 51.3407389,
		lng: -2.981844,
		info: 'Seaside pier with land train, indoor rides, arcade machines plus candy floss, ice cream and tearoom.',
		tags: ['attractions', 'pier', 'family']
	},
	{
		id: '7',
		name: 'Seaquarium',
		address: '7 Marine Parade, Weston-super-Mare',
		lat: 51.3500859,
		lng: -2.9798111,
		info: 'Aquarium on its own pier, with a touch pool and species including jellyfish, piranhas, puffer fish.',
		tags: ['aquarium', 'attractions', 'family']
	},
	{
		id: '8',
		name: 'Puxton Park Tourist Attraction & Farmshop',
		address: 'Cowslip Ln, Hewish',
		lat: 51.3617887,
		lng: -2.876571,
		info: 'All-weather adventure park with soft play, aerial climbing and slides in 40 acres of countryside. ',
		tags: ['farm', 'attractions', 'family', 'adventure']
	},
	{
		id: '9',
		name: 'Weston-Super-Mare Station',
		address: 'Station Approach, Weston-super-Mare',
		lat: 51.3443074,
		lng: -2.9715222,
		info: 'Railway Station',
		tags: ['trains', 'stations', 'railway']
	},
	{
		id: '10',
		name: 'Weston Milton Train Station',
		address: 'Weston Milton Train Station, Weston-super-Mare',
		lat: 51.34846,
		lng: -2.94239,
		info: 'Weston Milton railway station serves the Milton and Locking Castle areas of Weston-super-Mare in North Somerset, England.',
		tags: ['trains', 'stations', 'railway']
	},
	{
		id: '11',
		name: 'Worle Train Station',
		address: 'Park Way, Weston-super-Mare',
		lat: 51.35803,
		lng: -2.90963,
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




// *******************************
// *          VIEW MODEL         *
// *******************************


var KoViewModel = function() {
    var self = this;

    // PLace Object
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

	    this.marker = null;
	};

    self.allPlaces = ko.observableArray();

	places.forEach(function(place) {
	    self.allPlaces().push(new Place(place));
	});

    // Build Markers via the Maps API and place them on the map.
    self.allPlaces().forEach(function(place) {

	    var markerOptions = {
	      position: place.latLng,
		  map: map,
	    };

	    place.marker = new google.maps.Marker(markerOptions);

	    place.marker.addListener('click', function() {
		 	infowindow.open(map, place.marker);
		 	infowindow.setContent('<h5>' + place.name() + '</h5><br>' + place.address());
		});
    });

	self.visiblePlaces = ko.observableArray();

	self.allPlaces().forEach(function(place) {
	    self.visiblePlaces.push(place);
	});

	// This, along with the data-bind on the <input> element, lets KO keep
	// constant awareness of what the user has entered.
	self.userInput = ko.observable('');


	// If the user input string
	// can be found in the place name, then the place is allowed to remain
	// visible. All other markers are removed.
	self.filterMarkers = function() {
	    var searchInput = self.userInput().toLowerCase();

	    self.visiblePlaces.removeAll();

	    // This looks at the name of each places and then determines if the user
	    // input can be found within the place name.
	    self.allPlaces().forEach(function(place) {
	        place.marker.setVisible(false);

	        if ((place.name().toLowerCase().indexOf(searchInput) !== -1) || (place.tags().indexOf(searchInput) !== -1)) {
	            self.visiblePlaces.push(place);
	        }
	    });

	    if (self.visiblePlaces().length > 0)

	    self.visiblePlaces().forEach(function(place) {
	        place.marker.setVisible(true);
	    });
	};


	// Filter Buttons Function
	self.filterPlaces = function(type) {

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




