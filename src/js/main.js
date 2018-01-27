"use strict";

import places from 'js/model.js';
import { initMap, googleError } from 'js/map.js';
import { infoRequest, photoRequest } from 'js/requests.js';


// *******************************
// *          VIEW MODEL         *
// *******************************

initMap();

const KoViewModel = () => {
    let self = this;

    // Animate the scroll when #main-header is clicked.
    self.click = function() {
        $('html, body').animate({
            scrollTop: $("#list-view").offset().top
        }, 'slow');
    };

    // Place Object
    const Place = (place) => {
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
    };

    const infowindow = new google.maps.InfoWindow();

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
    for (let place of self.allPlaces()) {

        var markerOptions = {
            position: place.latLng,
            map: map,
            animation: google.maps.Animation.DROP
        };

        place.marker = new google.maps.Marker(markerOptions);

        // Open infowindow and trigger marker animation when clicked.
        place.marker.addListener('click', () => {
            infowindow.open(map, place.marker);
            place.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => {
                place.marker.setAnimation(null);
            }, 1450);
            // Get data for the infowindow.
            self.listClick(place);
            self.infoRequest(place);
            self.photoRequest(place);
        });
    }

    self.visiblePlaces = ko.observableArray();
    // Push places into visiblePlaces array, so all markers are visible when page loads.
    for (let place of self.allPlaces()) {
        self.visiblePlaces.push(place);
    }

    // Keep constant awareness of user input along with data-bind on <input> element.
    self.userInput = ko.observable('');

    // Create array of place names for use with autocomplete plugin.
    const filterNames = [];
    for (let place of self.allPlaces()) {
        filterNames.push(place.name);
    }

    // Auto-complete jquery plugin.
    $(function() {
        $("#filter").autocomplete({
            source: filterNames,
            autoFocus: true,
            select: function(e, ui) {
                self.userInput(ui.item.value);
            }
        });
    });

    // Filter locations by name and tags depending on the user input.
    self.filteredList = ko.computed(function() {
        if (self.userInput()) {
            var searchInput = self.userInput().toLowerCase();
        }
        else if (!self.userInput()) {
            return ko.utils.arrayFilter(self.allPlaces(), function(place) {
                place.marker.setVisible(true);
                return place.name;
            });
        } else {
            return ko.utils.arrayFilter(self.visiblePlaces(), function(place) {
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
    self.toggle = (id) => {
        infowindow.close();
        self.collapsed(false);
        var el = document.getElementById(id);
        var elementList = document.querySelectorAll('li');
        elementList.forEach(function(element) {
            element.classList.remove('active');
        });
        if (el) {
            el.classList.add('active');
        }
    };

    // Open infowindow when list item is clicked.
    self.markerTrigger = (data) => {
        google.maps.event.trigger(data.marker, 'click');
    };

    // Toggle visibility of list item information when a marker is clicked.
    self.listClick = (data) => {
        self.activeClick(data.id);
        data.collapsed = ko.computed(function() {
            return (self.collapsed(false)) ? 'collapse in' + self.activeClick() : 'collapsed' + self.activeClick();
        }, self);
        self.collapsed(data.collapsed());
    };

    self.infoRequest();
    self.photoRequest();
};