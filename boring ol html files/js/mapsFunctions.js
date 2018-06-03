  var map;
  var centering = {lat: 40.1843574, lng: -74.5740333};
  var infowindow;
  var latLongPoints = [];
  var service;
  /*var locations = ["EXXONMOBIL NEW BRUNSWI NJ", "EXXONMOBIL JERSEY CITY NJ", "ALLENTOWN GASKO RTE. 539 @ 195 ALLENTOWN NJ", "ALLENTWON GASKO ALLENTOWN   NJ"];*/
      
  function initMap() {
    var bounds = new google.maps.LatLngBounds();
    var locations = newloc;
    console.log("Now locations are " +locations);
    var mapProp = {  
                center: centering,  
                zoom: 8,  
                panControl: true, /*In order to show navigating control*/  
                zoomControl: true,  
                mapTypeControl: true,  
                scaleControl: true,  
                streetViewControl: true, /*Enable street view control*/  
                overviewMapControl: true,  
                rotateControl: true,  
                mapTypeId: google.maps.MapTypeId.ROADMAP  
    };
    map = new google.maps.Map(document.getElementById('map'), mapProp);  
    map.setTilt(45);  /*To rotate map with an angle of 45 degree*/  

    for (i = 0; i < locations.length; i++) {  
    /* Code to get Latitude and Longitude of location*/ 
      var locate = locations[i];
      var geocoder = new google.maps.Geocoder();  
      var address = locate;
      var points;
      var latitude;
      var longitude;
     
      geocoder.geocode({ 'address': address }, function (results, status) {  
            if (status == google.maps.GeocoderStatus.OK) {  
                latitude = results[0].geometry.location.lat();  
                longitude = results[0].geometry.location.lng();  
                points = new google.maps.LatLng(latitude, longitude);  
                latLongPoints[i]=points;
                console.log("Found gas station at"+ latitude + " "+ longitude);
                
            /* marker code*/               
                var marker = new google.maps.Marker({  
                    position: points,  
                    map: map  
                });  
                /* Info window for primary gas station marker */  
                  google.maps.event.addListener(marker, 'click', function() {
                  service = new google.maps.places.PlacesService(map);
                  console.log(results[0].place_id);
                  var plrequest = {
                    placeId: results[0].place_id
                  };
                  service.getDetails(plrequest, function(result, status) {
                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                      console.error(status);
                      return;
                    }
                    infoWindow = new google.maps.InfoWindow();
                    infoWindow.setContent(result.name);
                    infoWindow.open(map, marker);
                  });
                });
                //extend the bounds to include each marker's position
                bounds.extend(marker.position);

                /* Now finding nearby gas stations */
                var request = {
                  location: results[0].geometry.location,
                  radius: '5000',
                  type: ['gas_station']
                };
                console.log("doing search for nearby gas stations for:" + locate);
                service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, callback);
              }
            });
    }
    /*map.fitBounds(bounds);*/

}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  console.log("Found marker:" +place.geometry.location.lat() + ":" + place.geometry.location.lng() );
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: {
      url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(10, 17)
    }
  });

  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      infoWindow.setContent(result.name);
      infoWindow.open(map, marker);
    });
  });
}
 
/*google.maps.event.addDomListener(window, 'load', initMap);
icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569', ==> orange/red
icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|F4EB42', ==> yellow */