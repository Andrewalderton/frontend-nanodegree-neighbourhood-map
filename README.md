Neighbourhood Map
=================

##Description
A single-page application featuring a map of my local area. Functionality has been added to the application, including: map markers to identify popular locations or places you may like to visit, a search function with auto-complete to easily discover these locations, and a list-view to support simple browsing of all locations.

Third-party APIs, including Foursquare and Flickr, have been used to provide additional information about each of these locations.

##Usage
To run the app, you can download the files, or clone the repository, and then open the `index.html` file located inside the `dist` folder. Alternatively, a live version of the app can be found [here](http://andrewalderton.github.io/frontend-nanodegree-neighbourhood-map).

Users can filter the locations displayed on the map, either by using the buttons in the main nav bar, or by typing in the the search bar. Auto-complete suggestions become available to select as you type in the search bar.

List items can be clicked on to display the address of the location, other contact information, and any photos that are available. Clicking on these list items activates a window above the corresponding map marker, which also displays relevant information.

To reset the list of locations and map markers, click the **Reset** button, or the main header located alongside the buttons.

###Gulp usage
Gulp has been used in this project for optimisation tasks. Critical-path CSS has been added inline at the top of `index.html`, images have been compressed, and scripts concatenated and minified.

Replicating the process of producing production files for this project requires **npm**, which can be downloaded and installed from [nodejs.org](http://nodejs.org), and **gulp**, which can be subsequently installed in your project directory using the command `$ npm install --save-dev gulp` from the terminal.

Several gulp plugins are also required and are listed in the `package.json` file. They can be installed by running the command `$ npm install`.

All main gulp tasks are included in the default task located in `gulpfile.js`. Once the necessary components are installed, simply run `$ gulp` in the command line, from the project root, to reproduce the optimisations for this project.

All working files are located in the `src` directory. Gulp tasks will output to the `dist` directory.



