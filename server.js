var express = require('express');
var tiles = require('./tiles')

var app = express.createServer();

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
	app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

app.get('/tiles', function(req, res) {
	var t = tiles.create(req, res, function(tile) {
		res.end(tile);
	});
});

if (!module.parent) {
	app.listen(8080);
}
