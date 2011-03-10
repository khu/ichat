
$(function(){
  var conn = new WebSocket("ws://localhost:8000/");
  conn.onmessage = function(evt) {
    log(evt.data);
  };

  conn.onclose = function() {
    log("** you have been disconnected");
  };

  conn.onopen = function(){
    log("** you have been connected");
    $("#sendbtn").removeAttr("disabled");
  }

  var logpanel = $("#log");

  $("#sendbtn").bind("click", function(){
    if(conn && conn.readyState == 1){
      var msg = $("#message").val();
      conn.send(msg);
      $("#message").val("");
    }
  });

  function log(data){
    logpanel.append("<p>"+data+"</p>");
  };
});