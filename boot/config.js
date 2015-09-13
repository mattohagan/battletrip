var request = require('request');
var logfmt = require('logfmt');
var bodyParser = require('body-parser');

module.exports = function(app){
	// set headers
	var allowCrossDomain = function(req, res, next) {
	    res.header('Access-Control-Allow-Origin', '*');
	    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

	    // intercept OPTIONS method
	    if ('OPTIONS' == req.method) {
	      res.send(200);
	    }
	    else {
	      next();
	    }
	};
	
	// logger
	app.use(logfmt.requestLogger());
	// for routing and rendering
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
	  extended: true
	}));

	app.Parse.initialize('XQ6eGuBCxZfhiXmz3coOIefE0LTQ04aNaZON2dCC', '7LYjmosUUNFThozSngtzAOW2fPdscfguHEOGuz2J');


}