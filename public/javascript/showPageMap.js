const campground = require("../../models/campground");

mapboxql.accessToken = mapToken;
const map = new mapboxql.Map({
    contianer: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campground.geometry.coordinates,
    zoom: 9
})

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .addTo(map)