var map;
var infowindow;
var pyrmont = {lat: -33.867, lng: 151.195};
var markers = [];
var bikers = [];

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
		zoom: 10,
		mapTypeId: 'roadmap'
	});
	infowindow = new google.maps.InfoWindow();

	// Create the search box and link it to the UI element.
	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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
			loadBiker();
		});
		map.fitBounds(bounds);
	});
}

function loadBiker() {
	var URL = "http://localhost:9000/";
    var _url = URL + "api/map/biker";
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
				var image = 'biker.png';
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
					infowindow.setContent(biker.name+' - '+biker.phone);
					infowindow.open(map, this);
				});
			});
			map.setZoom(17);
		}
		else {
			alert(data.Text);
		}
	})
	.fail(function (jqXHR, textStatus, errorThrown) {
		console.log(jqXHR);
		console.log(textStatus);
		console.log(errorThrown);
	});
}
