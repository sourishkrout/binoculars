var fs = require('fs');
var redis = require('redis');
var Canvas = require('canvas');

var Tiles = function(req, res, cb) {
	var produceTile = function(count, high, cb) {
		var acanvas = new Canvas(256, 256);
		var ctx = acanvas.getContext('2d');
		var ptg = 100 - (parseInt(count) / parseInt(high)) * 100;
		var color = 'rgba(' + Math.floor(0.5+(255*ptg)/100) + ', ' + Math.floor(0.5+(255*(100-ptg))/100) + ', 0, 0.55)';
		
		console.log(count + ' / ' + high + ' = ' + ptg);
		
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, 256, 256);
		
		ctx.font = '36px Impact';
		var te = ctx.measureText(count);
		ctx.fillText(count, 128-te.width/2, 128);
				
		acanvas.toBuffer(function(err, buf) { cb(err, buf); });
	};
	
	var client = redis.createClient();
	var tile = req.param('tile', '');
	
	client.get(tile, function(err, reply) {
		var count = 0;
		if (err == null) {
			count = reply;
		}

		// console.log(tile + ': ' + count);
		
		res.writeHead(200, { 'Content-Type': 'image/png', 'X-Count': count, 'max-age': 60 });
		client.get('highest', function(err, high) {
			produceTile(count, high, function(err, result) { cb(result); });
		});
	});
};

exports.create = function(req, res, cb) {
	return new Tiles(req, res, cb);
};