var testData = {
    max: 50,
    data: []
};

var baseLayer = L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18
  }
);

var cfg = {
  "radius": 20,// radius should be small ONLY if scaleRadius is true (or small radius is intended)
  "maxOpacity": .5, 
  "scaleRadius": false, // scales the radius based on map zoom
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries 
  //   (there will always be a red spot with useLocalExtremas true)
  "useLocalExtrema": false,
  latField: 'lat', // which field name in your data represents the latitude - default "lat"
  lngField: 'lon', // which field name in your data represents the longitude - default "lng"
  valueField: 'magnitude' // which field name in your data represents the data value - default "value"
};


var map = new L.Map('map', {
  center: new L.LatLng(41.9027835,12.496365500000024),
  zoom: 5,
  layers: [baseLayer]
});


var chart = c3.generate({
				bindto: '#chart',
				data: {
					x: 'time',
					columns: [],
					xFormat: '%Y-%m-%d %H:%M:%S'
				},
				axis: {
					x: {
						type: 'timeseries',
						tick: {
							format: '%Y-%m-%d %H:%M:%S',
							count: 3
						}
					}
				}
			});

function getTimestamp(str) {
    if (str.length > 0) {
        var d = str.match(/\d+/g); // extract date parts
        return +new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5]); // build Date object
    }
}

function load_data() {
    var start = getTimestamp($("#fromTime").val())/1000;
    var end = getTimestamp($("#toTime").val())/1000;
	
	$.ajax('stazioni.php', {
      type: 'GET',
	  data: {
		format: 'json',
		start: start,
		end:end
	  },
	  success: function(data) {
        $('#notification-bar').text('Dati caricati correttamenete');
        var json = $.parseJSON(data);
       
       	var stazioni = json['seismometer'];
       	
       	 for (var i in stazioni) {
       	 	var marker = L.marker(stazioni[i]).addTo(map).bindPopup(i);
       	 	marker.on('click',onClick);
       	 }
        
      },
      error: function() {
        $('#notification-bar').text('An error occurred');
      }
   });
   
   function onClick(e) {
   	var marker = e.target;
   	var popup = marker.getPopup();
   	var content = popup.getContent();
   	
   	
   	$.ajax('dati.php', {
      type: 'GET',
	  data: {
		format: 'json',
		start: start,
		end:end,
		stazione:content
	  },
	  success: function(data) {
        $('#notification-bar').text('Dati caricati correttamenete');
        var json = $.parseJSON(data);
        
        c3.generate({
        	 bindto: '#chart',
        	 data: {
        	 	x: 'time',
        		json: {	
        			ax : json['ax'],
        			ay : json['ay'],
        			az : json['az'],
        			time : json['time']
        		},
        		xFormat: '%Y-%m-%d %H:%M:%S'
        	 },
        	 axis: {
					x: {
						type: 'timeseries',
						tick: {
							format: '%Y-%m-%d %H:%M:%S',
							count: 3
						}
					}
				}
        });
       	
      },
      error: function() {
        $('#notification-bar').text('An error occurred');
      }
   });
   	
   	
   }
	

}