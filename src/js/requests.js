// *******************************
// *       AJAX REQUESTS         *
// *******************************


import $ from 'jquery';
import 'knockout';

const ajaxError = ko.observable(false);
const infoError = ko.observable(false);
const venueUrl = ko.observable();
const venuePhone = ko.observable();
const infoArray = ko.observableArray();
const url = ko.observable();
const visiblePhotos = ko.observableArray();
const flickrImg = ko.observable();
const ownerId = ko.observable();

var infoRequest;
var photoRequest;
global.infowindow = ko.observable();

// Trigger Foursquare Ajax request.
infoRequest = (place) => {
    // reset error status
    ajaxError(false);
    infoError(false);

    // Clear current url and phone number.
    venueUrl(null);
    venuePhone(null);
    infoArray(null);

    //let venue = ko.observableArray();
    url(place.url);
    place.phone = ko.observable(place.phone);
    let dataArray = [];

    const foursquareUrl = 'https://api.foursquare.com/v2/venues/search?ll=' + place.lat + ',' + place.lng + '&intent=match&name=' + place.name + '&client_id=OXYOWWZSQILOKF21ZNLDZ0050FIJMRRBG0RPKSH2ZEEVUDEV&client_secret=UNWECJ2HMPBYHOWT4ZK0MK4ZDOFE5CRQYQIT514ZNU3V2DCP&v=20160519';

    $.getJSON(foursquareUrl, (data) => {
        let venue = data.response.venues[0];

        if ((venue !== undefined) && (venue.hasOwnProperty('url'))) {
            venueUrl('<a href="' + venue.url + '">' + venue.url + '</a>');
            dataArray.push('<h6>Contact:</h6><a href="' + venue.url + '">' + venue.url + '</a><br>');
        }
        if ((venue !== undefined) && (venue.hasOwnProperty('contact')) && (venue.contact.hasOwnProperty('formattedPhone'))) {
            venuePhone(venue.contact.formattedPhone);
            dataArray.push(venue.contact.formattedPhone + '<br>');
        }

        if (dataArray[0] === undefined) {
            // Set content for when information not available.
            infoArray('<h5>' + place.name + '</h5><br>' + '<h6>Address: </h6>' + place.address + '<br><p class="info-error"><br>Phone and Website information currently unavailable.</p>');
            infoError(true);
        } else {
            infoArray('<h5>' + place.name + '</h5><br>' + dataArray.join("") + '<p class="info-error"><em>provided by Foursquare</em></p><h6>Address: </h6>' + place.address);
        }

    }).fail(() => {
        ajaxError(true);
        infoArray('<h5>' + place.name + '</h5><br>' + '<h6>Address: </h6>' + place.address + '<br><p class="info-error"><br>Phone and Website information currently unavailable.</p>');
    });
};

// Flickr photo API request.
photoRequest = (place) => {
    place.apiTimeout = setTimeout(() => {
        ajaxError(true);
    }, 5000);

    // Reset error status.
    ajaxError(false);
    visiblePhotos(null);
    const photoArray = [];
    const flickrKey = '153430b4e3a967170f237d09583ee9f1';
    const placeName = place.name;
    const flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';

    $.getJSON(flickrAPI, {
        api_key: flickrKey,
        extras: "geo",
        has_geo: 1,
        per_page: 3,
        tags: placeName,
        tagmode: "all",
        format: "json",
        nojsoncallback: 1
    }).done((data) => {
        if (data.photos.total != '0') {
            clearTimeout(place.apiTimeout);
            let allPhotos = data.photos.photo;

            allPhotos.forEach((photo) => {
                // Build the url of the photo in order to link to it.
                flickrImg('src="http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_z.jpg">');
                photoArray.push('<img ' + flickrImg());
                // Get the user ID to be used for flickr attribution.
                ownerId('<br><em><p class="info-error">flickr photo from <a  href="http://www.flickr.com/photos/' + photo.owner + '">flickr.com/photos/' + photo.owner + '</a></p></em>');
                photoArray.push(ownerId());
                visiblePhotos(photoArray.join(""));
            });
            // Set infowindow content.
            global.infowindow().setContent(infoArray() + '<br><br>' + '<img class="window-img" ' + photoArray[0] + photoArray[1]);

        } else {
            global.infowindow().setContent(infoArray() + '<p class="info-error">No photos found for this location.</p>');
            clearTimeout(place.apiTimeout);
            ajaxError(true);

        }
    }).fail(() => {
        ajaxError(true);
        global.infowindow().setContent(infoArray() + '<p class="info-error">No photos found for this location.</p>');
    });
};

export {
    infoRequest,
    photoRequest,
    infowindow,
    ajaxError,
    infoError,
    venueUrl,
    venuePhone,
    infoArray,
    url,
    visiblePhotos,
    flickrImg,
    ownerId
};