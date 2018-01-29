// *******************************
// *         DATA MODEL          *
// *******************************


const places = [{
    id: '1',
    name: 'Brit Bar',
    address: '118 High St, Weston-super-Mare',
    lat: 51.35045615524592,
    lng: -2.9788606936460815,
    info: 'Amazing beer, some of which is brewed in the pub!',
    tags: ['bars', 'pubs', 'nightlife']
}, {
    id: '2',
    name: 'The Imperial Brasserie',
    address: '14 S Parade, Weston-super-Mare',
    lat: 51.35009059655817,
    lng: -2.9801435218494827,
    info: 'Popular pub and restaurant with live music',
    tags: ['bars', 'pubs', 'restaurant']
}, {
    id: '3',
    name: 'Yates\'s',
    address: '12-20 Regent St, Weston-super-Mare',
    lat: 51.347643,
    lng: -2.979869842529297,
    info: 'Lively chain venue with typical English decor, a menu of pub classics and regular promotions',
    tags: ['bars', 'pub', 'restaurant', 'nightlife']
}, {
    id: '4',
    name: 'Cabot Court Hotel',
    address: '1 Knightstone Rd, Weston-super-Mare',
    lat: 51.35040093628007,
    lng: -2.9824093625121386,
    info: 'Down-to-earth rooms in a Regency property with original period features and free Wi-Fi',
    tags: ['hotel', 'bars', 'pubs', 'restaurant', 'nightlife']
}, {
    id: '5',
    name: 'Tavern Inn The Town',
    address: '57-59 Regent St, Weston-super-Mare',
    lat: 51.34748360652798,
    lng: -2.9772897607097013,
    info: 'Pub',
    tags: ['pubs', 'bars']
}, {
    id: '6',
    name: 'Grand Pier',
    address: 'Marine Parade, Weston-super-Mare',
    lat: 51.3477831763546,
    lng: -2.9860496520996094,
    info: 'Seaside pier with land train, indoor rides, arcade machines plus candy floss, ice cream and tearoom.',
    tags: ['attractions', 'pier', 'family']
}, {
    id: '7',
    name: 'SeaQuarium',
    address: '7 Marine Parade, Weston-super-Mare',
    lat: 51.342676890571425,
    lng: -2.981543956657001,
    info: 'Aquarium on its own pier, with a touch pool and species including jellyfish, piranhas, puffer fish.',
    tags: ['aquarium', 'attractions', 'family']
}, {
    id: '8',
    name: 'Puxton Park',
    address: 'Cowslip Ln, Hewish',
    lat: 51.36167545078643,
    lng: -2.8707474652563634,
    info: 'All-weather adventure park with soft play, aerial climbing and slides in 40 acres of countryside. ',
    tags: ['farm', 'attractions', 'family', 'adventure']
}, {
    id: '9',
    name: 'Weston-Super-Mare Railway Station (WSM)',
    address: 'Station Approach, Weston-super-Mare',
    lat: 51.34432029845645,
    lng: -2.971680685877802,
    info: 'Railway Station',
    tags: ['trains', 'stations', 'railway']
}, {
    id: '10',
    name: 'Weston Milton Railway Station (WNM)',
    address: 'Saville Rd., Weston-super-Mare',
    lat: 51.34847052431751,
    lng: -2.9424023628234885,
    info: 'Weston Milton railway station serves the Milton and Locking Castle areas of Weston-super-Mare in North Somerset, England.',
    tags: ['trains', 'stations', 'railway']
}, {
    id: '11',
    name: 'Worle Railway Station (WOR)',
    address: 'Park Way, Weston-super-Mare',
    lat: 51.35794719120777,
    lng: -2.909366341787722,
    info: 'Worle railway station, on the Bristol to Exeter Line, serves the Worle, West Wick and St Georges suburbs of Weston-super-Mare in North Somerset, England.',
    tags: ['trains', 'stations', 'railway']
}];

export default places;