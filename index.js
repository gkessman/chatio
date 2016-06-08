var express = require('express');
var favicon = require('serve-favicon');
var fs = require('fs');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var users = [];
var adj = fs.readFileSync('parts/adj.txt').toString().split("\n");
var noun = fs.readFileSync('parts/noun.txt').toString().split("\n");

app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.get('/', function(req, res) {
	res.redirect('/index.html');
});

io.on('connection', function(socket) {

	var user = newUser();
	var color = getRandomColor();
	var ip = socket.handshake.address;

	users.push({
		userName: user,
		userColor: color
	});

	
	publishEvent(user, color, users, ip, 'joined the chat');

	socket.on('disconnect', function() {

		users.map(function(obj, index) {
			if (obj.userName == user) {
				users.splice(index, 1);
			}
		});

		publishEvent(user, color, users, ip, 'left the chat');
	});

	socket.on('chat message', function(msg) {
		msg.id = messageId();
		msg.time = new Date();
		msg.ip = socket.handshake.address;
		console.log(JSON.stringify(msg));
		io.emit('chat message', msg);
	});
});


function publishEvent(user, color, users, ip, status) {
	var event = {
		time: new Date(),
		user: user,
		action: status,
		userColor: color,
		ip: ip
	};

	console.log(JSON.stringify(event));
	// Fire event message
	io.emit('event message', event);
	// Update user list client-side
	io.emit('users', users);
}

function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};

function newUser() {
	var unique = false;

	while (!unique) {
		var name = adj[Math.floor(Math.random() * adj.length)] + " " + noun[Math.floor(Math.random() * noun.length)];

		if (!users.length || users.indexOf(name) == -1) {
			unique = true;
		};
	};

	return name;
}

function messageId() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 15; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

http.listen(port, function() {
	console.log('listening on port ' + port);
});