var geo = {
	lat : null,
	lng: null,
	begin : function(){
		if (navigator.geolocation){
			return navigator.geolocation.getCurrentPosition(
				function(position){
					flickr.getImage(position.coords.latitude,position.coords.longitude,3,'mi');
				},function(error){
					displayError(geo.getGeoErrorMsg(error));
			},{maximumAge:60000, timeout: 2000});
		}
		else{
			displayError('Your browser does not support geolocation services');
		}
	},
	getGeoErrorMsg : function(error){
		switch(error.code) 
			{
				case error.TIMEOUT:
					return 'Geo location timed out';
					break;
				case error.POSITION_UNAVAILABLE:
					return 'Geo location position unavailable';
					break;
				case error.PERMISSION_DENIED:
					return 'Permission denied, cannot display image';
					break;
				case error.UNKNOWN_ERROR:
					return 'error, try again later';
					break;
			}
	}
};

var flickr = {
	apikey : 'c2ec6af01746486059794ada1cd6c3fb',
	getImage : function(lat,lng,distance,units){
		$.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=' + this.apikey + 
		'&lat=' + lat + '&lon=' + lng + '&radius=' + distance +'&radius_units=' + units + '&per_page=1&format=json&jsoncallback=?',
		function(data){
			if(data.stat == 'fail') {
				displayError(data.message); 
			}
			if(data.photos.total == '0'){
				displayError('No photos found near your location');
				return;
			}
			$.each(data.photos.photo,function(i,photo){
				$('#image').append('<img src="http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg" alt="' + photo.title + '" />');
				$('#imagetext').text(photo.title);
			});
		});
	}
}

function displayError(msg) {
	$('#imagetext').text(msg);
}

$(document).ready(function(){
	geo.begin();
});
