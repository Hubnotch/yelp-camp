mapboxql.accessToken = mapToken;
const map = new mapboxql.Map({
    contianer:'map',
    style:'mapbox://styles/mapbox/streets-v11',
    center: [-79.0, 47],
    zoom:9
})