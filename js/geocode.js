let geocoder;
function initialize() {
    geocoder = new google.maps.Geocoder();
}

function getLatLong(id) {
    const address = document.getElementById(id).value;
    // Sync addresses input into both buttons
    $("#hometown").val(address);
    $("#hometown-map").val(address);

    // Query Google Maps Geocoding API
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status === 'OK') {
            console.log("selected location: ", [results[0].geometry.location.lng(), results[0].geometry.location.lat()]);
            updateVis([results[0].geometry.location.lng(), results[0].geometry.location.lat()]);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

    updateHometown();
}
