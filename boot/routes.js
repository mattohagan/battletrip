
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

		var Bullseye = app.Parse.Object.extend("Bullseye");
		var query = new app.Parse.Query(Bullseye);
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

			res.json(coordinates);
			res.end();

		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});

	});

	// receiving final destination from user
	app.get('/destination', function(req, res){

		// hardcode these values
		var lat = req.body.lat;
		var lon = req.body.lon;
		console.log('hello');
		var hit = null;

		var Bullseye = app.Parse.Object.extend("Bullseye");
		var query = new app.Parse.Query(Bullseye);
		query.find({
		  success: function(results) {
		  	// goes through results
		    for (var i = 0; i < results.length; i++) {
				var radius = object.get('radius');
		    	if(radius > 0){
			    	var object = results[i];
					var lat = object.get('location').latitude;
					var lon = object.get('location').longitude;

					var coord = {
						latitude: lat, 
						longitude: lon
					};

			    	if(app.geolib.isPointInCircle(coord, radius)){
			    		hit = object.get('objectId');
			    		break;
			    	}
			    }
		    }

		    if(hit){
		    	console.log('hit!');

		    	var Bullseye = Parse.Object.extend("Bullseye");
				var query = new Parse.Query(Bullseye);
				query.get(hit, {
				  success: function(bullseye) {
				  	var radius = bullseye.get('radius');
				    // The object was retrieved successfully.
				    bullseye.set('radius', radius - 50);
				    bullseye.save();
				  },
				  error: function(object, error) {
				    // The object was not retrieved successfully.
				    // error is a Parse.Error with an error code and message.
				    console.log(error);
				    console.log('hit error');
				  }
				});

		    	// push notification for hit
		    } else {
		   		// Create the object.
				var Miss = Parse.Object.extend("Misses");
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