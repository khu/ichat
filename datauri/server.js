var sys = require("sys")  
  , ws = require("websocket-server")
  , http = require("http")
  , fs = require("fs")
  , path = require("path")

function serveFile(res, name) {
	 res.writeHead(200, {'Content-Type': 'text/html', 'Connection': 'close'});
      fs.createReadStream(path.normalize(path.join(__dirname, name)), {
        'flags': 'r',
        'encoding': 'binary',
        'mode': 0666,
        'bufferSize': 4 * 1024
      }).addListener("data", function(chunk){
        res.write(chunk, 'binary');
      }).addListener("end",function() {
        res.end();
      });	
}
var httpServer = http.createServer(function(req, res){
  if(req.method == "GET"){
    if( req.url.indexOf("favicon") > -1 ){
      res.writeHead(200, {'Content-Type': 'image/x-icon', 'Connection': 'close'});
      res.end("");
    } else {
	  sys.log(req.url);
	  serveFile(res, req.url);
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

var server = ws.createServer({
  server: httpServer
});

server.addListener("listening", function(){
  sys.log("Listening for connections.");
});

server.addListener("connection", function(conn){
  conn.user = "user_" + conn.id;

  conn.send("** Connected as: user_"+conn.id);

  conn.broadcast("** "+ conn.user +" connected");

  conn.addListener("message", function(message){
    server.broadcast(conn.user + ": " + message);
  });
});

server.addListener("close", function(conn){
  server.broadcast("<user_" + conn.id + "> disconnected");
});

server.listen(8000);