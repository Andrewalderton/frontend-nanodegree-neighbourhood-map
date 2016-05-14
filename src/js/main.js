"use strict";


// *******************************
// *         DATA MODEL          *
// *******************************


var places = [
	{
		name: 'Brit Bar',
		address: '118 High St, Weston-super-Mare',
		lat: 51.3504617,
		lng: -2.9786496,
		info: 'Amazing beer, some of which is brewed in the pub!',
		tags: ['bars', 'pubs', 'nightlife']
	},
	{
		name: 'The Imperial Public House',
		address: '14 S Parade, Weston-super-Mare',
		lat: 51.3502151,
		lng: -2.9802191,
		info: 'Popular pub and restaurant with live music',
		tags: ['bars', 'pubs', 'restaurant']
	},
	{
		name: 'Yates\'s',
		address: '12-20 Regent St, Weston-super-Mare',
		lat: 51.3475307,
		lng: -2.9798097,
		info: 'Lively chain venue with typical English decor, a menu of pub classics and regular promotions',
		tags: ['bars', 'pub', 'restaurant', 'nightlife']
	},
	{
		name: 'Cabot Court Hotel',
		address: '1 Knightstone Rd, Weston-super-Mare',
		lat: 51.3506475,
		lng: -2.981408,
		info: 'Down-to-earth rooms in a Regency property with original period features and free Wi-Fi',
		tags: ['hotel', 'bars', 'pubs', 'restaurant', 'nightlife']
	},
	{
		name: 'The Tavern Inn The Town',
		address: '57-59 Regent St, Weston-super-Mare',
		lat: 51.3475274,
		lng: -2.97742,
		info: 'Pub',
		tags: ['pubs', 'bars']
	},
	{
		name: 'The Grand Pier',
		address: 'Marine Parade, Weston-super-Mare',
		lat: 51.3407389,
		lng: -2.981844,
		info: 'Seaside pier with land train, indoor rides, arcade machines plus candy floss, ice cream and tearoom.',
		tags: ['attractions', 'pier', 'family']
	},
	{
		name: 'Seaquarium',
		address: '7 Marine Parade, Weston-super-Mare',
		lat: 51.3500859,
		lng: -2.9798111,
		info: 'Aquarium on its own pier, with a touch pool and species including jellyfish, piranhas, puffer fish.',
		tags: ['aquarium', 'attractions', 'family']
	},
	{
		name: 'Puxton Park Tourist Attraction & Farmshop',
		address: 'Cowslip Ln, Hewish',
		lat: 51.3617887,
		lng: -2.876571,
		info: 'All-weather adventure park with soft play, aerial climbing and slides in 40 acres of countryside. ',
		tags: ['farm', 'attractions', 'family', 'adventure']
	},
	{
		name: 'Weston-Super-Mare Station',
		address: 'Station Approach, Weston-super-Mare',
		lat: 51.3443074,
		lng: -2.9715222,
		info: 'Railway Station',
		tags: ['trains', 'stations', 'railway']
	},
	{
		name: 'Weston Milton Train Station',
		address: 'Weston Milton Train Station, Weston-super-Mare',
		lat: 51.34846,
		lng: -2.94239,
		info: 'Weston Milton railway station serves the Milton and Locking Castle areas of Weston-super-Mare in North Somerset, England.',
		tags: ['trains', 'stations', 'railway']
	},
	{
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
        center: {lat: 51.3517278, lng: -2.9797165},
        scrollwheel: false,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.HYBRID
    });

var infowindow = new google.maps.InfoWindow();

places.forEach(function(place) {
	var latLng = {lat: place.lat, lng: place.lng};
	var contentName = place.name;
	var contentAddress = place.address;
	var setContent = '<h5>' + contentName + '</h5>' + '<br>' + 'Address: ' + contentAddress;

	var marker = new google.maps.Marker({
	    position: latLng,
	    map: map,
	});

	marker.addListener('click', function() {
		infowindow.open(map, marker);
		infowindow.setContent(setContent);
	});
});



// *******************************
// *         PLACE OBJECT        *
// *******************************


var Place = function(data, parent) {
	// info from provided data model
	this.name = ko.observable(data.name);
	this.address = ko.observable(data.address);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.tags = ko.observableArray(data.tags);
	//this.info = ko.observable(data.info);



// *******************************
// *          VIEW MODEL         *
// *******************************


$(window).resize(function () {
    var h = $(window).height(),
        offsetTop = 190; // Calculate the top offset

    $('#map').css('height', (h - offsetTop));
}).resize();
}

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
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

// Append place names to filter list
places.forEach(function(place) {
	$('.list-group').append('<button type="button" class="list-group-item">' + place.name + '</button>');
});


// Filter functions

var KoViewModel = function() {
  var self = this;

  // Build "Place" objects out of raw place data. It is common to receive place
  // data from an API like FourSquare. Place objects are defined by a custom
  // constructor function you write, which takes what you need from the original
  // data and also lets you add on anything else you need for your app, not
  // limited by the original data.
  self.allPlaces = [];
  locationData.forEach(function(place) {
    self.allPlaces.push(new Place(place));
  });


  // Build Markers via the Maps API and place them on the map.
  self.allPlaces.forEach(function(place) {
    var markerOptions = {
      map: self.googleMap,
      position: place.latLng
    };

    place.marker = new google.maps.Marker(markerOptions);

    // You might also add listeners onto the marker, such as "click" listeners.
  });


  // This array will contain what its name implies: only the markers that should
  // be visible based on user input. My solution does not need to use an
  // observableArray for this purpose, but other solutions may require that.
  self.visiblePlaces = ko.observableArray();


  // All places should be visible at first. We only want to remove them if the
  // user enters some input which would filter some of them out.
  self.allPlaces.forEach(function(place) {
    self.visiblePlaces.push(place);
  });


  // This, along with the data-bind on the <input> element, lets KO keep
  // constant awareness of what the user has entered. It stores the user's
  // input at all times.
  self.userInput = ko.observable('');


  // The filter will look at the names of the places the Markers are standing
  // for, and look at the user input in the search box. If the user input string
  // can be found in the place name, then the place is allowed to remain
  // visible. All other markers are removed.
  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();

    self.visiblePlaces.removeAll();

    // This looks at the name of each places and then determines if the user
    // input can be found within the place name.
    self.allPlaces.forEach(function(place) {
      place.marker.setVisible(false);

      if (place.locationName.toLowerCase().indexOf(searchInput) !== -1) {
        self.visiblePlaces.push(place);
      }
    });


    self.visiblePlaces().forEach(function(place) {
      place.marker.setVisible(true);
    });
  };


  function Place(dataObj) {
    this.locationName = dataObj.locationName;
    this.latLng = dataObj.latLng;

    // You will save a reference to the Places' map marker after you build the
    // marker:
    this.marker = null;
  }

};

ko.applyBindings(new KoViewModel());







