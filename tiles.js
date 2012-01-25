var fs = require('fs');
var redis = require('redis');

var Tiles = function(req, res, cb) {
	var client = redis.createClient();
	var tile = req.param('tile', '');
	
	client.get(tile, function(err, reply) {
		var count = 0;
		if (err == null) {
			count = reply;
		}

		console.log(tile + ': ' + count);
		
		res.writeHead(200, { 'Content-Type': 'image/png', 'X-Count': count });
		fs.readFile('public/milk.png', function(err, data) {
			if (err == null)
				cb(null);
		});
	});
};

Tiles.prototype.produceTile = function(count) {
	return null;
};

exports.create = function(req, res, cb) {
	return new Tiles(req, res, cb);
};