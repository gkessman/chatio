var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.redirect('/index.html');
});

io.on('connection', function(socket) {
	console.log('User connected');
	io.emit('event message', 'User connected');
	socket.on('disconnect', function() {
		console.log('User disconnected');
		io.emit('event message', 'User disconnected');
	});

	socket.on('chat message', function(msg) {
		console.log('message: ' + msg);
	});
	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
	});
	socket.on('event message', function(msg) {
		io.emit('event message', msg);
	});
});

http.listen(port, function() {
	console.log('listening on port ' + port);
});