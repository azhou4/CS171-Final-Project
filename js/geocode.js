let geocoder;
// var gmap;
function initialize() {
    geocoder = new google.maps.Geocoder();
    // var latlng = new google.maps.LatLng(36.644, -120.397);
    // var mapOptions = {
    //     zoom: 8,
    //     center: latlng
    // }
    // gmap = new google.maps.Map(document.getElementById('gmap'), mapOptions);
}

function getLatLong() {
    const address = document.getElementById('hometown').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
            // gmap.setCenter(results[0].geometry.location);
            console.log("selected location: ", [results[0].geometry.location.lng(), results[0].geometry.location.lat()]);
            updateVis([results[0].geometry.location.lng(), results[0].geometry.location.lat()]);
            // var marker = new google.maps.Marker({
            //     map: gmap,
            //     position: results[0].geometry.location
            // });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
