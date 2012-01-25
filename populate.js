var fs = require('fs');
var redis = require('redis');

var FileLineReader = function(filename, bufferSize) {  
  
    if(!bufferSize) {  
        bufferSize = 8192;  
    }  
  
    //private:  
    var currentPositionInFile = 0;  
    var buffer = "";  
    var fd = fs.openSync(filename, "r");  
  
  
    // return -1  
    // when EOF reached  
    // fills buffer with next 8192 or less bytes  
    var fillBuffer = function(position) {  
  
        var res = fs.readSync(fd, bufferSize, position, "ascii");  
  
        buffer += res[0];  
        if (res[1] == 0) {  
            return -1;  
        }  
        return position + res[1];  
  
    };  
  
    currentPositionInFile = fillBuffer(0);  
  
    //public:  
    this.hasNextLine = function() {  
        while (buffer.indexOf("\n") == -1) {  
            currentPositionInFile = fillBuffer(currentPositionInFile);  
            if (currentPositionInFile == -1) {  
                return false;  
            }  
        }  
  
        if (buffer.indexOf("\n") > -1) {  
  
            return true;  
        }  
        return false;  
    };  
  
    //public:  
    this.nextLine = function() {  
        var lineEnd = buffer.indexOf("\n");  
        var result = buffer.substring(0, lineEnd);  
  
        buffer = buffer.substring(result.length + 1, buffer.length);  
        return result;  
    };  
  
    return this;  
};

var Populate = function() {
	var client = redis.createClient();
	var highest = -1;
	
	var reader = FileLineReader('data.txt', 1024);
	var tiles = [];
	
	while (reader.hasNextLine()) {
		var line = reader.nextLine();
		
		if (line.indexOf('/map') < 0)
			continue;
		
		var tile = line.split('	');
		var count = parseInt(tile[1]);
		
		if (count > highest)
			highest = count;
		
		client.set(tile[0], count);
	}
	
	client.set('highest', highest, redis.print);
	
	var reader2 = FileLineReader('maxd.txt', 1024);
	
	while (reader2.hasNextLine()) {
		var line = reader2.nextLine();
		
		if (line.indexOf('zoomlevel') < 0)
			continue;
			
		var chunks = line.split('	');
		var count = chunks[1];
		
		client.set(chunks[0], count, redis.print);
	}
}

if (!module.parent)
	Populate();
