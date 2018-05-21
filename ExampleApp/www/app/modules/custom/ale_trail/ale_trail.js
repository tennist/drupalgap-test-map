
// Create global variables to hold coordinates and the map.
var _ale_trail_user_latitude = null;
var _ale_trail_user_longitude = null;
var _ale_trail_map = null;
var myLatlng = null;

navigator.geolocation.getCurrentPosition(
      
      // Success.
      function(position) {
        	  
        // Set aside the user's position.
        _ale_trail_user_latitude = position.coords.latitude;
        _ale_trail_user_longitude = position.coords.longitude;
              	        
      },
      
      // Error
      function(error) {
        
        // Provide debug information to developer and user.
        console.log(error);
        drupalgap_alert(error.message);
        
        // Process error code.
        switch (error.code) {

          // PERMISSION_DENIED
          case 1:
            break;

          // POSITION_UNAVAILABLE
          case 2:
            break;

          // TIMEOUT
          case 3:
            break;

        }

      },
      
      // Options
      { enableHighAccuracy: true }
      
    );

/**
 * Implements hook_menu().
 */
function ale_trail_menu() {
  var items = {};
  items['FindBrews'] = {
      title: 'Find Brews',
      page_callback: 'ale_trail_find_brews_map',
	  pagebeforechange: 'ale_trail_find_brews_map_pagebeforechange',
      pageshow: 'ale_trail_find_brews_map_pageshow'	  
  };  
   	
  return items;
}



/**
 * The find brews page callback.
 */
function ale_trail_find_brews_map() {
  try {
    // Figure out the map's height from the device window height.
    var window_height = $(window).height();
    var map_height = window_height - 160; // = footer (px) + header (px)
	
    var content = {};
    var map_attributes = {
      id: 'ale_trail_find_brews_map_map',
      style: 'width: 100%; height: ' + map_height + 'px;'
    };
	content['map'] = {
      markup: '<div ' + drupalgap_attributes(map_attributes) + '></div>'
    };
	
	content['refresh_location'] = {
     theme: 'button',
     text: 'Refresh Map',
     attributes: {
      onclick: "ale_trail_find_brews_refresh_button_click()",
      'data-theme': 'b'
     }
    };
	
	   
    return content;
  }
  catch (error) { console.log('ale_trail_find_brews_map - ' + error); }
}

/**
 * The find brews page before change callback.
 */
function ale_trail_find_brews_map_pagebeforechange() {
  try {
    
	navigator.geolocation.getCurrentPosition(
      
      // Success.
      function(position) {
        	  
        // Set aside the user's position.
        _ale_trail_user_latitude = position.coords.latitude;
        _ale_trail_user_longitude = position.coords.longitude;
				              	        
      },
      
      // Error
      function(error) {
        
        // Provide debug information to developer and user.
        console.log(error);
        drupalgap_alert(error.message);
        
        // Process error code.
        switch (error.code) {

          // PERMISSION_DENIED
          case 1:
            break;

          // POSITION_UNAVAILABLE
          case 2:
            break;

          // TIMEOUT
          case 3:
            break;

        }

      },
      
      // Options
      { enableHighAccuracy: true }
      
    );
  }
  catch (error) {
    console.log('ale_trail_find_brews_map_pagebeforechange - ' + error);
  }
}

/**
 * The map pageshow callback.
 */
function ale_trail_find_brews_map_pageshow() {
    
	// Build the lat lng object from the user's position.
          myLatlng = new plugin.google.maps.LatLng(
          _ale_trail_user_latitude,
          _ale_trail_user_longitude
        );  
	
	
	// Set the map's options.
        var mapOptions = {
          'controls': {
			'compass': true,
			'myLocationButton': true,			
			'zoom': true
		  },
		  'gestures': {
			'scroll': true,
			'tilt': true,
			'rotate': true,
			'zoom': true
		  },
		  'camera': {
			'latLng': myLatlng,			
			'zoom': 13			
		  }
		  
        };			
        
        // Initialize the map
        _ale_trail_map = plugin.google.maps.Map.getMap(
          document.getElementById("ale_trail_find_brews_map_map"),
          mapOptions
        );
        
		//Wait for the map to be ready then add markers to it
		_ale_trail_map.one(plugin.google.maps.event.MAP_READY, function() {
		
			var htmlInfoWindow = new plugin.google.maps.HtmlInfoWindow();
			//Create the Address Div
			var address_div = '<div style="clear:both; overflow:auto;">' +
			  '<div style="float:left;">' +
			  '<b> Address: </b>' +
			  '</div>' +
			  '<div style="float:left; margin-left:5px;">' +
			  '<a href="http://maps.google.com" target="_blank">Open the Google Maps</a>' +
			  '</div>' +
			  '</div>';
		
			// Add a marker for the user's current position.
			_ale_trail_map.addMarker({
				position: myLatlng,            
				icon: 'app/modules/custom/ale_trail/red-dot.png'
			}, function(marker) {
			  marker.on(plugin.google.maps.event.MARKER_CLICK, function() {
				htmlInfoWindow.setContent(address_div);
				htmlInfoWindow.open(marker);
			  });	
			
			});				
		});	
}

/**
 * The function ran when the refesh button is clicked on the find brews page.
 */
function ale_trail_find_brews_refresh_button_click() {
  try {
    drupalgap_goto('FindBrews', {reloadPage:true});
  }
  catch (error) { console.log('ale_trail_checkin_refresh_button_click - ' + error); }
}