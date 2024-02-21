
mapboxgl.accessToken = mapToken; //replace the default map token with our map token. 
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]  NOTE:When we search coordinates of any place in google it shows [latitude, longitude] format but map box accept [longitude, latitude] fromat, so when put coordinates here you have to take care of it.
    zoom: 9 // starting zoom
});

const markerHeight = 50;
const markerRadius = 10;
const linearOffset = 25;
const popupOffsets = {
'top': [0, 0],
'top-left': [0, 0],
'top-right': [0, 0],
'bottom': [0, -markerHeight],
'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
'left': [markerRadius, (markerHeight - markerRadius) * -1],
'right': [-markerRadius, (markerHeight - markerRadius) * -1]
};
// Create a new marker.
const marker = new mapboxgl.Marker({color: "red",
rotation: 30})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.location}</h4><p>Exact location will be provided after booking!</p>`))
    .addTo(map);