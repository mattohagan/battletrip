
module.exports = function(app){

	// not much purpose
	app.get('/', function(req, res) {
		res.send('hello');
	});

	// benji getting coordinates for miss map
	app.get('/misses', function(req, res){
		// get miss data from parse

		var coordinates = {
			arr: []
		};

		var Bullseye = app.Parse.Object.extend("Bullseye");
		var query = new app.Parse.Query(Bullseye);
		query.find({
		  success: function(results) {
		    for (var i = 0; i < results.length; i++) {
		      var object = results[i];
		      var lat = object.get('location').latitude;
		      console.log(lat);
		      var lon = object.get('location').longitude;

		      console.log(lat);
		      var coord = {lat: lat, lon: lon};
		      coordinates['arr'].push(coord);
		    }

			res.send(coordinates);

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




	// 404
	// always have this route last
	app.get('*', function(req, res){
		res.type('text/plain');
	  	res.send("404 Not Found, sorry bout it.");
	  //res.sendfile(__dirname + '/public/404.html');
	});

}