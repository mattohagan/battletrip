
module.exports = function(app){

	// push notification that user hit a ship
	var pushHit = function(id){
		console.log('PUSHING HIT');
		app.Parse.Cloud.run('pushhit', {bullseyeId: id},{
			success: function(result){
				console.log('CLOUD CODE RAN AHH');
			},
			error: function(error){

			}
		});
	};

	// push notification that user missed
	var pushMiss = function(){
		console.log('PUSHING MISS');
		app.Parse.Cloud.run('pushmiss',{
			success: function(result){
				console.log('CLOUD CODE RAN AHH');
			},
			error: function(error){

			}
		});
	};

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
		  	console.log('success on bullseye');
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

				pushMiss();

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


	

	// also includes driver_canceled and rider_canceled
	var statuses = ['no_drivers_available','processing','accepted','arriving','in_progress','completed'];

	app.get('/uber-details', function(req, res){
		var status = statuses.shift();
		statuses.push(status);

		var coords = [[42.295037, -83.779232]
		[42.242799, -83.743317]
		[42.316963, -83.717460]
		[42.277402, -83.745796]
		[42.310153, -83.700813]
		[42.291029, -83.756422]
		[42.253242, -83.725353]
		[42.304567, -83.701234]
		[42.223917, -83.706834]
		[42.232834, -83.766694]
		[42.252763, -83.745088]];

		var rand = Math.random() * (10 - 0) + 10;
		var use = coords[rand];


		// hardcode these values
		var userLat = use[0];
		var userLon = use[1];

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