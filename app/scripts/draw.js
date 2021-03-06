var type;
var mouseDown = 0;

canvas.onmousemove = function(e) {
	if (mouseDown) {
		type = 'drag';
	}
};

canvas.onmousedown = function(e) {
	mouseDown = 1;
	type = 'start';
}

canvas.onmouseup = function(e) {
	mouseDown = 0;
	type = 'stop';
}

$('canvas').on('mousemove mousedown', function(e) {
	e.offsetX = e.clientX - canvas.offsetLeft;
	e.offsetY = e.clientY - canvas.offsetTop;
	var x = e.offsetX;
	var y = e.offsetY;
	// Send draw command to server
	if (mouseDown) {
		socket.emit('drawClick', { x : x, y : y, type : type });
	}
})

$('canvas').on('mouseup', function(e) {
	// Send snapshot of canvas to server
	socket.emit('imageData', canvas.toDataURL());
})

function draw(x, y, type) {
	if (type === 'erase') {
		context.clearRect(0, 0, canvas.width, canvas.height);
		return;
	}
	if (type === 'start') {
		context.moveTo(x,y);
		context.beginPath();
	} else if (type === 'drag') {
		context.lineTo(x,y);
		context.stroke();
	} else {
		context.closePath();
	}
}

erase.onclick = function(e) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	socket.emit('drawClick', { x : 0, y : 0, type : 'erase' });
	socket.emit('imageData', canvas.toDataURL());
}
