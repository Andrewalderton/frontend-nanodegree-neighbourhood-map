    // *******************************
    // *       AJAX REQUESTS         *
    // *******************************


    // Trigger Foursquare Ajax request.
    export const infoRequest = (self, place) => {
        // reset error status
        self.ajaxError(false);
        self.infoError(false);

        // Clear current url and phone number.
        self.venueUrl(null);
        self.venuePhone(null);
        self.infoArray(null);

        let venue = ko.observable();
        place.url = ko.observable(place.url);
        place.phone = ko.observable(place.phone);
        let infoArray = [];

        const foursquareUrl = 'https://api.foursquare.com/v2/venues/search?ll=' + place.lat + ',' + place.lng + '&intent=match&name=' + place.name + '&client_id=OXYOWWZSQILOKF21ZNLDZ0050FIJMRRBG0RPKSH2ZEEVUDEV&client_secret=UNWECJ2HMPBYHOWT4ZK0MK4ZDOFE5CRQYQIT514ZNU3V2DCP&v=20160519';

        $.getJSON(foursquareUrl, (data) => {
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

        }).fail(() => {
            self.ajaxError(true);
            self.infoArray('<h5>' + place.name + '</h5><br>' + '<h6>Address: </h6>' + place.address + '<br><p class="info-error"><br>Phone and Website information currently unavailable.</p>');
        });
    };

    // Flickr photo API request.
    export const photoRequest = (self, place) => {
        place.apiTimeout = setTimeout(() => {
            self.ajaxError(true);
        }, 5000);

        // Reset error status.
        self.ajaxError(false);
        self.visiblePhotos(null);
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
        }).done(function(data) {
            if (data.photos.total != '0') {
                clearTimeout(place.apiTimeout);
                var allPhotos = data.photos.photo;

                allPhotos.forEach(function(photo) {
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