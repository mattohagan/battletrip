
module.exports = function(app){

	app.get('/', function(req, res) {
		res.render('index');
	});

	app.get('/hackfsu', function(req, res){
		res.render('hackfsu');
	});




	// 404
	// always have this route last
	app.get('*', function(req, res){
		res.type('text/plain');
	  	res.send("404 Not Found, sorry bout it.");
	  //res.sendfile(__dirname + '/public/404.html');
	});

}