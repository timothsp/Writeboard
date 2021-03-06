var channel = 'all';
var message = document.getElementById('message');

// Emit inputted message to chat:{channel}
$('#chat').on('submit', function(e) {
	var date = new Date();
	var time = date.toLocaleString('en-US').split(',')[1].slice(1);
	var data = { user: username, msg: message.value, timestamp: time }
	if (message.value.length > 0) {
		socket.emit('chat', data);
		message.value = '';
	}
	return false;
});

// Listen on chat:{channel}
socket.on('chat', function(data) {
	var li = document.createElement('li');
	$(li).html('<span id="user">' + data.user + ' <span id="timestamp">(' + data.timestamp + '):</span></span> ' + data.msg).appendTo($('#messages'));
	$('#messages').scrollTop($('#messages')[0].scrollHeight);
});

socket.on('announcement', function(msg) {
	var li = document.createElement('li');
	$(li).html('<span id="user">' + msg + '</span>').appendTo($('#messages'));
	$('#messages').scrollTop($('#messages')[0].scrollHeight);
});

// Change channel
// Unfocus channel input on Enter keypress
$('#channel').keypress(function(e){ 
	var prevChannel = channel;
	if (e.which == 13) {
		socket.emit('leave', { channel: prevChannel, user: username });
		channel = this.innerHTML;
		channelSwitch(channel);
		blurAll();
	}
	return e.which != 13; 
});

// Switch channels
function channelSwitch(channel) {
	socket.emit('join', { channel: channel, user: username });
	$('#messages').empty();
	context.clearRect(0, 0, canvas.width, canvas.height);
	$('#messages').append($('<li class="channel-switch">').text('Entered channel #' + channel));
	$('#messages').scrollTop($('#messages')[0].scrollHeight);
}

// Unfocus all inputs
function blurAll(){
 var tmp = document.createElement('input');
 document.body.appendChild(tmp);
 tmp.focus();
 document.body.removeChild(tmp);
}