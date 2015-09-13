var request = require('request');
var logfmt = require('logfmt');
var bodyParser = require('body-parser');

module.exports = function(app){
	// logger
	app.use(logfmt.requestLogger());
	// for routing and rendering
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
	  extended: true
	}));

	app.Parse.initialize('XQ6eGuBCxZfhiXmz3coOIefE0LTQ04aNaZON2dCC', '7LYjmosUUNFThozSngtzAOW2fPdscfguHEOGuz2J');




}