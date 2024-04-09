var markers = [];

var initMap = function (mapDiv, mapLatLng, mapLatitude, mapLongitude) {
    if (mapLatitude !== "" && mapLongitude !== "") {
        var mapProp = {
            center: new google.maps.LatLng(mapLatitude, mapLongitude),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            fullscreenControl: true
        };

        var map = new google.maps.Map(document.getElementById(mapDiv), mapProp);

        // Adds a marker at the center of the map.
        addMarker(map, map.getCenter(), mapLatLng);

        // Create the DIV to hold the control and call the constructor passing in this DIV
        var geolocationDiv = document.createElement('div');
        var geolocationControl = new GeolocationControl(geolocationDiv, map);

        map.controls[google.maps.ControlPosition.TOP_CENTER].push(geolocationDiv);
    } else {
        if (navigator.geolocation) {
            tryGeolocation(mapDiv);
            //tryAPIGeolocation(mapDiv);
        } else {
            document.getElementById("map-info-" + mapDiv).innerHTML = 'No Geolocation Support.';
        }
    }
}

var tryGeolocation = function (mapElement) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
                function (position) {
                    browserGeolocationSuccess(mapElement, position);
                },
                function (error) {
                    browserGeolocationFail(mapElement, error);
                },
                {maximumAge: 50000, timeout: 20000, enableHighAccuracy: true}
        );
    }
}

var browserGeolocationSuccess = function (mapElement, position) {
    console.log("Browser geolocation success!\n\nlat = " + position.coords.latitude + "\nlng = " + position.coords.longitude);

    showLocationPin(mapElement, position.coords.latitude, position.coords.longitude);
}

var browserGeolocationFail = function (mapElement, error) {
    switch (error.code) {
        case error.TIMEOUT:
            alert("Browser geolocation error !\n\nTimeout.");
            break;
        case error.PERMISSION_DENIED:
            if (error.message.indexOf("Only secure origins are allowed") == 0) {
                tryAPIGeolocation(mapElement);
            }
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Browser geolocation error !\n\nPosition unavailable.");
            break;
    }
}

var tryAPIGeolocation = function (mapElement) {
    jQuery.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyD0Se9E-JSIw1_QOfwDUuVAmYQSsNfJO98", function (success) {
        apiGeolocationSuccess(mapElement, {coords: {latitude: success.location.lat, longitude: success.location.lng}});
    })
            .fail(function (err) {
                alert("API Geolocation error! \n\n" + err);
            });
}

var apiGeolocationSuccess = function (mapElement, position) {
    console.log("API geolocation success!\n\nlat = " + position.coords.latitude + "\nlng = " + position.coords.longitude);

    showLocationPin(mapElement, position.coords.latitude, position.coords.longitude);
}

var showLocationPin = function (mapElement, latitude, longitude) {
    document.getElementById('map_' + mapElement).value = latitude + ',' + longitude;

    var map;

    var geolocate = new google.maps.LatLng(latitude, longitude);

    var mapProp = {
        center: geolocate,
        zoom: 6,
        fullscreenControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById(mapElement), mapProp);

    // Adds a marker at the center of the map.
    addMarker(map, geolocate, 'map_' + mapElement);

    /*var infowindow = new google.maps.InfoWindow({
     map: map,
     position: geolocate,
     content:
     '<h5>Location pinned from HTML5 Geolocation!</h5>' +
     '<h6>Latitude: ' + position.coords.latitude + '</h6>' +
     '<h6>Longitude: ' + position.coords.longitude + '</h6>'
     });*/

    map.setCenter(geolocate);

    // Create the DIV to hold the control and call the constructor passing in this DIV
    var geolocationDiv = document.createElement('div');
    var geolocationControl = new GeolocationControl(geolocationDiv, map, mapElement);

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(geolocationDiv);
}

function GeolocationControl(controlDiv, map, mapElement) {

    // Set CSS for the control button
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#444';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '1px';
    controlUI.style.borderColor = 'white';
    controlUI.style.height = '28px';
    controlUI.style.marginTop = '10px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to center map on your location';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control text
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '11px';
    controlText.style.color = 'white';
    controlText.style.paddingLeft = '10px';
    controlText.style.paddingRight = '10px';
    controlText.style.marginTop = '7px';
    controlText.innerHTML = 'Center map on your location';
    controlUI.appendChild(controlText);

    // Setup the click event listeners to geolocate user
    //google.maps.event.addDomListener(controlUI, 'click', funName2);
    google.maps.event.addDomListener(controlUI, 'click', function () {
        if (navigator.geolocation) {
            getGeolocation(map);
        }
    });
}

var getGeolocation = function (map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
                function (position) {
                    openGeolocationSuccess(map, position);
                },
                function (error) {
                    openGeolocationFail(map, error);
                },
                {maximumAge: 50000, timeout: 20000, enableHighAccuracy: true}
        );
    }
}

var openGeolocationSuccess = function (map, position) {
    console.log("Browser geolocation success!\n\nlat = " + position.coords.latitude + "\nlng = " + position.coords.longitude);

    deleteMarkers();

    var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    createMarker(map, geolocate);

    map.setCenter(geolocate);
}

var openGeolocationFail = function (map, error) {
    switch (error.code) {
        case error.TIMEOUT:
            alert("Browser geolocation error !\n\nTimeout.");
            break;
        case error.PERMISSION_DENIED:
            if (error.message.indexOf("Only secure origins are allowed") == 0) {
                getAPIGeolocation(map);
            }
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Browser geolocation error !\n\nPosition unavailable.");
            break;
    }
}

var getAPIGeolocation = function (map) {
    jQuery.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyD0Se9E-JSIw1_QOfwDUuVAmYQSsNfJO98", function (success) {
        console.log("API geolocation success!\n\nlat = " + success.location.lat + "\nlng = " + success.location.lng);

        deleteMarkers();

        var geolocate = new google.maps.LatLng(success.location.lat, success.location.lng);

        createMarker(map, geolocate);

        map.setCenter(geolocate);
    })
            .fail(function (err) {
                alert("API Geolocation error! \n\n" + err);
            });
}

function createMarker(map, geolocate) {
    var marker = new google.maps.Marker({
        position: geolocate,
        draggable: true,
        map: map
    });
    markers.push(marker);
}

// Adds a marker to the map and push to the array.
function addMarker(map, location, input) {
    var marker = new google.maps.Marker({
        position: location,
        draggable: true,
        map: map
    });
    markers.push(marker);

    new google.maps.event.addListener(marker, 'dragend', function (event) {
        document.getElementById(input).value = this.position.lat() + ',' + this.position.lng();
        addMarker(event.latLng);
    });
}


// Sets the map on all markers in the array.
function setMapOnAll(map) {
    //console.log("Markers: ", markers.length);
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}