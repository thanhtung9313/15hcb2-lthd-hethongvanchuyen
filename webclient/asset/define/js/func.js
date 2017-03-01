var map;
var infowindow;
var pyrmont = {lat: 10.762469, lng: 106.6826266};
var markers = [];
var bikers = [];
var guests = [];
var geocoder;


function cleanMaker(array){
	// Clear out the old markers.
	array.forEach(function(marker) {
		marker.setMap(null);
	});
	array = [];
}

function initAutocomplete() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: pyrmont,
		zoom: 17,
		mapTypeId: 'roadmap'
	});
	geocoder = new google.maps.Geocoder();

	infowindow = new google.maps.InfoWindow();

	// Create the search box and link it to the UI element.
	var input = document.getElementById('pac-input');
	var pos = document.getElementById('pos-input');
	var addr = document.getElementById('addr-input');
	var btnChange = document.getElementById('change-input');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(pos);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(btnChange);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(addr);
	
	
	//btn change-input
	btnChange.addEventListener("click",function(){
		if(pos.value.length != 0){
			ReverseGeoCoding(pos.value,addr);
		}
		if(addr.value.length != 0){
			GeoCoding(addr.value,pos);
		}
	});
	
	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});

	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		cleanMaker(markers);

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
			if (!place.geometry) {
				console.log("Returned place contains no geometry");
				return;
			}

			// Create a marker for each place.
			var marker = new google.maps.Marker({
			map: map,
			title: place.name,
			position: place.geometry.location
			});
			markers.push(marker);
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent('My location');
				infowindow.open(map, this);
			});

			if (place.geometry.viewport) {
			// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map.fitBounds(bounds);
	});
	
	loadBiker();
	loadGuest();
}

function loadBiker() {
	var URL = "http://localhost:9000/";
    var _url = URL + "api/map/taixe";
    var jqxhr = $.ajax({
        url: _url,
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json',
        timeout: 30 * 1000
    })
	.done(function (data, textStatus, jqXHR) {
		console.log(data);
		if (data.Error === 0) {
			cleanMaker(bikers);			
			data.Data.forEach(function(biker){
				var image = biker.LoaiXe === 0? 'biker.png':'premium.png';
				var icon = {
					url: image,
					size: new google.maps.Size(50, 50),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(0, 0),
					scaledSize: new google.maps.Size(40, 40)
				};
				var marker = new google.maps.Marker({
					map: map,
					icon: icon,
					position: biker.location
				});
				bikers.push(marker);

				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(biker.HoTen);
					infowindow.open(map, this);
				});
			});
			map.setZoom(17);
		}
		else {
			//alert(data.Text);
		}
	})
	.fail(function (jqXHR, textStatus, errorThrown) {
		console.log(jqXHR);
		console.log(textStatus);
		console.log(errorThrown);
	});
}

function loadGuest() {
	var URL = "http://localhost:9000/";
    var _url = URL + "api/map/guest";
    var jqxhr = $.ajax({
        url: _url,
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json',
        timeout: 30 * 1000
    })
	.done(function (data, textStatus, jqXHR) {
		console.log(data);
		if (data.Error === 0) {
			cleanMaker(guests);			
			data.Data.forEach(function(guest){
				var image = guest.LoaiXe === 0? 'guest.png':'pguest.png';
				var icon = {
					url: image,
					size: new google.maps.Size(50, 50),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(0, 0),
					scaledSize: new google.maps.Size(40, 40)
				};
				var marker = new google.maps.Marker({
					map: map,
					icon: icon,
					draggable: true,
					editable: true,
					position: guest.location
				});
				guests.push(marker);

				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(guest.HoTen);
					infowindow.open(map, this);
				});
				
				google.maps.event.addListener(marker, 'dragend', function() {
					var data = { lat: this.getPosition().lat(), lng: this.getPosition().lng(), DienThoai: guest.DienThoai}
					updateGuest(data);
				});
			});
			map.setZoom(17);
		}
		else {
			//alert(data.Text);
		}
	})
	.fail(function (jqXHR, textStatus, errorThrown) {
		console.log(jqXHR);
		console.log(textStatus);
		console.log(errorThrown);
	});
}

function updateGuest(_data) {
	var URL = "http://localhost:9000/";
    var _url = URL + "api/map/update-guest";
    var jqxhr = $.ajax({
        url: _url,
        type: 'POST',
		data: JSON.stringify(_data),
        datatype: 'json',
        contentType: 'application/json',
        timeout: 30 * 1000
    })
	.done(function (data, textStatus, jqXHR) {
		console.log(data);
		if (data.Error === 0) {
			//alert(data.Text);
		}
		else {
			//alert(data.Text);
		}
	})
	.fail(function (jqXHR, textStatus, errorThrown) {
		console.log(jqXHR);
		console.log(textStatus);
		console.log(errorThrown);
	});
}

function GeoCoding(_data,element) {
	var address = _data;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
		  var v = results[0].geometry.location;
		element.value= v.lat() + ','+v.lng();
        
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
}

function ReverseGeoCoding(_data,element) {
	var latlngStr = _data.split(',', 2);
	var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
	  geocoder.geocode({'location': latlng}, function(results, status) {
		if (status === 'OK') {
		  if (results[1]) {
			var v = results[1].formatted_address;
			element.value= v;
		  } else {
			 console.log('No results found');
		  }
		} else {
		  console.log('Geocoder failed due to: ' + status);
		}
	  });

}