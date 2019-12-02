var geocoder;
var gmap;
function initialize() {
    geocoder = new google.maps.Geocoder();
    // var latlng = new google.maps.LatLng(36.644, -120.397);
    // var mapOptions = {
    //     zoom: 8,
    //     center: latlng
    // }
    // gmap = new google.maps.Map(document.getElementById('gmap'), mapOptions);
}

function codeAddress() {
    // var address = document.getElementById('address').value;
    // geocoder.geocode( { 'address': address}, function(results, status) {
    //     if (status == 'OK') {
    //         gmap.setCenter(results[0].geometry.location);
    //         console.log(results[0].geometry.location)
    //         var marker = new google.maps.Marker({
    //             map: gmap,
    //             position: results[0].geometry.location
    //         });
    //     } else {
    //         alert('Geocode was not successful for the following reason: ' + status);
    //     }
    // });
}
