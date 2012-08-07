const TIMER = 2000;
const TIMER_FADE = 400;
const TIMER_EARTH = 3000;
const BEGIN_ZOOM= 1;
const FINAL_ZOOM = 18;

var currentLongitude = 0;
var turnEarthIntervalID = -1;
var previousLatLng = null;
var map;
var map2;
var marker;
var marker2;

function initialize() {
  map = new google.maps.Map(document.getElementById("map_canvas"), {
	zoom: BEGIN_ZOOM+ 1,
	center: new google.maps.LatLng(0, currentLongitude),
	mapTypeId: google.maps.MapTypeId.SATELLITE,
	zoomControl: false,
	backgroundColor: 'transparent',
	disableDefaultUI: true,
	disableDoubleClickZoom: true,
	draggable: false
      });

  map2 = new google.maps.Map(document.getElementById("map_canvas2"), {
	zoom: BEGIN_ZOOM,
	center: new google.maps.LatLng(0, currentLongitude),
	mapTypeId: google.maps.MapTypeId.SATELLITE,
	zoomControl: false,
	backgroundColor: 'transparent',
	disableDefaultUI: true,
	disableDoubleClickZoom: true,
	draggable: false
      });
  
  startTurnEarth();

  if (navigator.geolocation) {
    var watchId = navigator.geolocation.watchPosition(successCallback, null, { enableHighAccuracy:true });
  } else {
    alert("Geolocalisation unavailable.");
  }
}

function startTurnEarth() {
   turnEarthIntervalID = setInterval( turnEarth, TIMER_EARTH );
}

function stopTurnEarth() {
  clearInterval( turnEarthIntervalID );
}

function turnEarth( ) {
    longitude = currentLongitude + Math.random() * 90 - 45;
    var latLng = new google.maps.LatLng( 0, longitude );
    panTo( latLng );
    currentLongitude = longitude;
}

function startZoom( ) {
  setTimeout( zoomToNext2, TIMER );
}

function isZoomGood( ) {
  return map2.getZoom() == FINAL_ZOOM || map.getZoom() == FINAL_ZOOM;
}

function zoomToNext( ) {
  $( "#map_canvas2" ).fadeIn();
  $( "#map_canvas" ).fadeOut();

  setTimeout( function() {
    map.setZoom( map.getZoom() + 2 );
    }, TIMER_FADE );

  if ( isZoomGood( ) ) {
    setTimeout( function() {
      $( "#map_canvas" ).fadeIn();
      $( "#map_canvas2" ).fadeOut();
      map.setMapTypeId( google.maps.MapTypeId.HYBRID );
      marker.setVisible( true );
    }, TIMER );
      
  } else {
    setTimeout( zoomToNext2, TIMER );
  }
}

function zoomToNext2( ) {
  $( "#map_canvas" ).fadeIn();
  $( "#map_canvas2" ).fadeOut();

  setTimeout( function() {
    map2.setZoom( map2.getZoom() + 2 );
    }, TIMER_FADE );

  if ( isZoomGood( ) )  {
    setTimeout( function() {
      $( "#map_canvas2" ).fadeIn();
      $( "#map_canvas" ).fadeOut();
      map2.setMapTypeId( google.maps.MapTypeId.HYBRID );
      marker2.setVisible( true );
    }, TIMER );
    } else {
      setTimeout( zoomToNext, TIMER );
  }
}

function panTo( latLng ) {
  map.panTo( latLng );
  map2.panTo( latLng );
}
  
function successCallback( position ) {
  stopTurnEarth();
  
  var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
  panTo( latLng );
  
  marker = new google.maps.Marker({
    position: latLng,
    map: map,
    visible: false
  });

  marker2 = new google.maps.Marker({
    position: latLng,
    map: map2,
    visible: false
  });
  
  if ( previousLatLng ) {
    var newLineCoordinates = [ previousLatLng, latLng ];
    
    var newLine = new google.maps.Polyline({
      path: newLineCoordinates,       
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    newLine.setMap( map );
    newLine.setMap( map2 );
  } else {
    startZoom( );
  }
  previousLatLng = latLng;
};

$(document).ready(
  function() {
    initialize();
  }
);