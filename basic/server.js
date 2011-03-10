var sys = require("sys")  
  , ws = require("websocket-server");


var server = ws.createServer();

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