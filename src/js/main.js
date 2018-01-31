// "use strict";

import $ from 'jquery';
import 'knockout';
import {
    autocomplete,
    filterNames
} from './autocomplete';
import places from './model';
import mapOptions from './map';
import {
    infoRequest,
    photoRequest,
    datawindow,
    ajaxError,
    infoError,
    venueUrl,
    venuePhone,
    infoArray,
    url,
    visiblePhotos,
    flickrImg,
    ownerId
} from './requests';


// *******************************
// *          VIEW MODEL         *
// *******************************


// Animate the scroll when #main-header is clicked.
window.click = function () {
    $('html, body').animate({
        scrollTop: $("#list-view").offset().top
    }, 'slow');
};

// Place Object
class Place {
    constructor(place) {
        // Information used from the provided data model.
        this.id = place.id;
        this.name = place.name;
        this.address = place.address;
        this.lat = place.lat;
        this.lng = place.lng;
        this.tags = place.tags;
        this.info = place.info;
        this.latLng = {
            lat: place.lat,
            lng: place.lng
        };
    }
}

var map;
var infowindow;
var marker;

window.initMap = function () {
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 51.3517278,
            lng: -2.9497165
        },
        scrollwheel: false,
        zoom: 12,
        styles: mapOptions
    });
    infowindow = new google.maps.InfoWindow();

    marker = function (markerOptions) {
        return new google.maps.Marker(markerOptions);
    };

    ko.applyBindings(new KoViewModel());
};

// Error handling function for Google Map
window.googleError = function () {
    alert('Error: Your Google Map has failed to load');
};

var KoViewModel = function () {
    var self = this;

    self.activeClick = ko.observable();
    self.collapsed = ko.observable(false);

    // Create observable array to hold each place from the data model.
    self.allPlaces = ko.observableArray();

    places.forEach(function (place) {
        self.allPlaces().push(new Place(place));
    });

    // Build Markers via the Maps API and place them on the map.
    for (let place of self.allPlaces()) {
        var markerOptions = {
            position: place.latLng,
            map: map,
            animation: google.maps.Animation.DROP
        };

        place.marker = marker(markerOptions);

        // Open infowindow and trigger marker animation when clicked.
        place.marker.addListener('click', function () {
            infowindow.open(map, place.marker);
            place.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => {
                place.marker.setAnimation(null);
            }, 1450);
            // Get data for the infowindow.
            self.listClick(place);
            infoRequest(place);
            infowindow.setContent(photoRequest(place));
        });
    }

    self.visiblePlaces = ko.observableArray();
    // Push places into visiblePlaces array, so all markers are visible when page loads.
    for (let place of self.allPlaces()) {
        self.visiblePlaces.push(place);
    }

    // Create array of place names for use with autocomplete plugin.
    //var filterNames = [];
    for (let place of self.allPlaces()) {
        filterNames.push(place.name);
    }

    // Keep constant awareness of user input along with data-bind on <input> element.
    global.userInput = ko.observable('');

    // Filter locations by name and tags depending on the user input.
    self.filteredList = ko.computed(function () {
        if (global.userInput()) {

            var searchInput = global.userInput().toLowerCase();
            console.log(searchInput);
        }
        if (!global.userInput()) {
            return ko.utils.arrayFilter(self.allPlaces(), function (place) {
                place.marker.setVisible(true);
                return place.name;
            });
        } else {
            return ko.utils.arrayFilter(self.visiblePlaces(), function (place) {
                place.marker.setVisible(false);
                infowindow.close();
                self.collapsed(false);
                self.activeClick(false);
                self.toggle();
                if ((place.name.toLowerCase().indexOf(searchInput) !== -1) || (place.tags.indexOf(searchInput) !== -1)) {
                    place.marker.setVisible(true);
                    return place.name;
                }
            });
        }
    }, self);

    // Toggle 'active' class for filter buttons.
    self.toggle = function (id) {
        infowindow.close();
        self.collapsed(false);
        var el = document.getElementById(id);
        var elementList = document.querySelectorAll('li');
        elementList.forEach(function (element) {
            element.classList.remove('active');
        });
        if (el) {
            el.classList.add('active');
        }
    };

    // Open infowindow when list item is clicked.
    self.markerTrigger = function (data) {
        google.maps.event.trigger(data.marker, 'click');
    };

    // Toggle visibility of list item information when a marker is clicked.
    self.listClick = function (data) {
        self.activeClick(data.id);
        data.collapsed = ko.computed(function () {
            return (self.collapsed(false)) ? 'collapse in' + self.activeClick() : 'collapsed' + self.activeClick();
        }, self);
        self.collapsed(data.collapsed());
    };
};