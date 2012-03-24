var fs = require('fs');
var redis = require('redis');

// Code copied at the courtesy of http://blog.jaeckel.com/2010/03/i-tried-to-find-example-on-using-node.html
// Gets the job done. I'm not a big fan of the un-node-like API though.
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

var populate = function() {
	var client = redis.createClient(10194, 'viperfish.redistogo.com');
  client.auth('28e0ff9834f3d9e160d7e0b59c0b3235');
  client.on('ready', function() {
	
    var reader = FileLineReader('data.txt', 1024);
    var tiles = [];
    
    while (reader.hasNextLine()) {
      var line = reader.nextLine();
      
      if (line.indexOf('/map') < 0)
        continue;
      
      var tile = line.split('	');
      var count = parseInt(tile[1]);
          
      client.set(tile[0], count);
    }
    
    var reader2 = FileLineReader('maxd.txt', 1024);
    
    while (reader2.hasNextLine()) {
      var line = reader2.nextLine();
      
      if (line.indexOf('zoomlevel') < 0)
        continue;
        
      var chunks = line.split('	');
      var count = chunks[1];
      
      client.set(chunks[0], count, redis.print);
    }
  });
  
  client.on('error', function(err) { console.error(err); });
}

if (!module.parent)
	populate();
