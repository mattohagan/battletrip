var request = require('request');
var logfmt = require('logfmt');
var bodyParser = require('body-parser');

module.exports = function(app){
	app.set('views', __dirname + '/../app/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;

	// logger
	app.use(logfmt.requestLogger());
	// for routing and rendering
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
	  extended: true
	}));


	app.use("/public", app.express.static(__dirname + '/../public'));
	app.use("/js", app.express.static(__dirname + '/../public/js'));
	app.use("/css", app.express.static(__dirname + '/../public/css'));
	app.use("/img", app.express.static(__dirname + '/../public/img'));
	app.use("/fonts", app.express.static(__dirname + '/../public/fonts'));

}