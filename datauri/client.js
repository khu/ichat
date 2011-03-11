
$(function(){
  var conn = new WebSocket("ws://" + window.location.host);
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
	if (data.indexOf("data:image") != -1) {
		logpanel.append("<p>"+ data.substring(0, data.indexOf("data:image"))+"</p>");
		logpanel.append('<img src="' + data.substring(data.indexOf("data:image")) + '"/>');		
	} else logpanel.append("<p>"+data+"</p>");
  };

  var holder = document.getElementById('file-drop');
  holder.ondrop = function(e) {
	e.preventDefault();	
	holder.className= "wait-for-drop";
		
	var file = e.dataTransfer.files[0], reader = new FileReader();
	reader.onload = function(e) {	
		conn.send(reader.result);
	}
	reader.readAsDataURL(file);
	return false;
  };

  holder.ondragenter = function(e) {
	holder.className= "dragging";
	e.stopPropagation();
	e.preventDefault();
	return false;
  };
  holder.ondragover= function(e) {
	e.stopPropagation();
	e.preventDefault();	
	return false;
  };
  holder.ondragleave = function(e) {
	holder.className= "wait-for-drop";
	e.stopPropagation();
	e.preventDefault();	
	return false;
  };
});