
module.exports = function(app){

	// not much purpose
	app.get('/', function(req, res) {
		res.send('hello');
	});

	// benji getting coordinates for miss map
	app.get('/misses', function(req, res){
		// get miss data from parse

		var coordinates = {
			arr: [
				{lat: 4, lon: 10},
				{lat: 5, lon: 10},
				{lat: 4, lon: 10}
			]
		};

		res.send(coordinates);
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