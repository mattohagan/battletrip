
module.exports = function(app){

	// not much purpose
	app.get('/', function(req, res) {
		res.send('hello');
	});

	// benji getting coordinates for miss map
	app.get('/misses', function(req, res){

		var coordinates = {
			arr: []
		};

		var Misses = app.Parse.Object.extend("Misses");
		var query = new app.Parse.Query(Misses);
		query.find({
		  success: function(results) {
		  	// goes through results
		    for (var i = 0; i < results.length; i++) {
		      var object = results[i];
		      var lat = object.get('location').latitude;
		      var lon = object.get('location').longitude;

		      var coord = {
		      	lat: lat, 
		      	lon: lon
		      };

		      coordinates['arr'].push(coord);
		    }

			res.jsonp(coordinates);
			res.end();

		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});

	});


	// benji getting coordinates for miss map
	app.get('/ships', function(req, res){

		var coordinates = {
			arr: []
		};

		var Bullseye = app.Parse.Object.extend("Bullseye");
		var query = new app.Parse.Query(Bullseye);
		query.find({
		  success: function(results) {
		  	// goes through results
		    for (var i = 0; i < results.length; i++) {
		      var object = results[i];
		      var lat = object.get('location').latitude;
		      var lon = object.get('location').longitude;
		      var radius = object.get('radius');

		      var coord = {
		      	lat: lat, 
		      	lon: lon,
		      	radius: radius
		      };

		      coordinates['arr'].push(coord);
		    }

			res.jsonp(coordinates);
			res.end();

		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});

	});

	// receiving final destination from user
	app.post('/destination', function(req, res){
		console.log(req.params);
		console.log('HELLO DESTINATION');
		console.log(req.body);
		console.log(req.body.lat);
		console.log(req.body.lon);

		// hardcode these values
		var userLat = req.body.lat; 
		var userLon = req.body.lon;
		var bullseyeId = null;
		var deviceId = req.body.deviceId;

		var Bullseye = app.Parse.Object.extend("Bullseye");
		var query = new app.Parse.Query(Bullseye);
		query.find({
		  success: function(results) {
		  	// goes through results
		    for (var i = 0; i < results.length; i++) {
		    	var object = results[i];
				var radius = object.get('radius');
		    	if(radius > 0){
					var lat = object.get('location').latitude;
					var lon = object.get('location').longitude;

					var coord = {
						latitude: lat, 
						longitude: lon
					};

					var userCoord = {
						latitude: userLat, 
						longitude: userLon
					};

					// if it's a hit
			    	if(app.geolib.isPointInCircle(userCoord, coord, radius)){
			    		bullseyeId = object.id;
			    		break;
			    	}
			    }
		    }


		    if(bullseyeId){
		    	console.log('hit!');

		    	var Bullseye = app.Parse.Object.extend("Bullseye");
				var query = new app.Parse.Query(Bullseye);
				query.get(bullseyeId, {
				  success: function(bullseye) {
				  	var radius = bullseye.get('radius');
				    // The object was retrieved successfully.
				    bullseye.set('radius', radius - 750);
				    bullseye.save();
				  },
				  error: function(object, error) {
				    // The object was not retrieved successfully.
				    // error is a Parse.Error with an error code and message.
				    console.log(error);
				    console.log('hit error');
				  }
				});

				pushHit(bullseyeId);

				res.status(203);
				res.end();
				

		    	// push notification for hit
		    } else {
		   		// Create the object.
				var Miss = app.Parse.Object.extend("Misses");
				var miss = new Miss();

				miss.set('location',{latitude: lat, longitude: lon});
				miss.save();

		    }

		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});

		

		// get parse data
		// check with geo fencing here

		// if hit
		// send notification somehow to parse cloud code to send push notification to that user 
		// store hit in parse and decrease size of radius?

		// if miss
		// send notification of miss
		// store miss in parse


	});


	// push notification that user hit a ship
	function pushHit(id){
		console.log('PUSHING HIT');
		app.Parse.Cloud.run('pushhit', {bullseyeId: id},{
			success: function(result){
				console.log('CLOUD CODE RAN AHH');
			},
			error: function(error){

			}
		});
	} 

	// also includes driver_canceled and rider_canceled
	var statuses = ['no_drivers_available','processing','accepted','arriving','in_progress','completed'];

	app.get('/uber-details', function(req, res){
		var status = statuses.shift();
		statuses.push(status);

		// hardcode these values
		var userLat = 42.268092; 
		var userLon = -83.750350;

		// spoof data that we'll use
		var response = {
			"location": {
				"latitude": userLat,
			    "longitude": userLon,
			    "bearing": 33
			},
			"status": status
		}

		res.json(response);
		res.end();
	});

	// render robots.txt
	app.get('/robots.txt', function(req, res) {
	  res.type('text/plain');
	  res.send("User-agent: *\nDisallow: /");
	}); 


	// 404
	// always have this route last
	app.get('*', function(req, res){
		res.type('text/plain');
	  	res.send("404 Not Found, sorry bout it.");
	  //res.sendfile(__dirname + '/public/404.html');
	});

}