let geocoder;
function initialize() {
    geocoder = new google.maps.Geocoder();
}

function getLatLong() {
    const address = document.getElementById('hometown').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status === 'OK') {
            console.log("selected location: ", [results[0].geometry.location.lng(), results[0].geometry.location.lat()]);
            updateVis([results[0].geometry.location.lng(), results[0].geometry.location.lat()]);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
