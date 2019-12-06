let geocoder;
function initialize() {
    geocoder = new google.maps.Geocoder();
}

function getLatLong(id) {
    const address = document.getElementById(id).value;
    console.log("ADDRESS", address);
    $("#hometown").val(address);
    $("#hometown-map").val(address);
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status === 'OK') {
            console.log("selected location: ", [results[0].geometry.location.lng(), results[0].geometry.location.lat()]);
            updateVis([results[0].geometry.location.lng(), results[0].geometry.location.lat()]);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
