var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var adjective = ['dramatic', 'lonely', 'embarrassed', 'unusual', 'successful', 'intelligent', 'logical', 'various', 'latter', 'willing', 'sexual', 'emotional', 
					'united', 'available', 'comprehensive', 'practical', 'unlikely', 'obviously', 'tiny', 'existing', 'foreign', 'popular', 'suitable', 'used', 'famous', 'remarkable',
					'confident', 'realistic', 'scared', 'lucky', 'cute', 'relevant', 'informal', 'careful', 'obvious', 'conscious', 'friendly', 'sudden', 'difficult', 'successfully',
					'happy', 'legal', 'historical', 'important', 'dangerous', 'electrical', 'efficient', 'federal', 'tall'];

var noun = ['story', 'singer', 'discussion', 'possession', 'marriage', 'satisfaction', 'thing', 'uncle', 'painting', 'context', 'refrigerator', 'history', 'memory', 'software',
				'quality', 'comparison', 'buyer', 'pizza', 'bonus', 'mom', 'device', 'efficiency', 'unit', 'video', 'week', 'disaster', 'quantity', 'message', 'resolution', 'truth',
				'attitude', 'height', 'presentation', 'procedure', 'setting', 'president', 'administration', 'literature', 'reality', 'apple', 'reading', 'growth', 'success',
				'organization', 'idea', 'loss', 'finding', 'mud', 'pollution'];

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.redirect('/index.html');
});

io.on('connection', function(socket) {
	var name = adjective[Math.floor(Math.random() * adjective.length)] + " " + noun[Math.floor(Math.random() * noun.length)]
	var event = {
		user: name,
		action: 'connected'
	};
	console.log(event.user + ' ' + event.action);
	io.emit('event message', event);
	socket.on('disconnect', function() {
		var event = {
			user: name,
			action: 'disconnected'
		}
		console.log(event.user + ' ' + event.action);
		io.emit('event message', event);
	});

	socket.on('chat message', function(msg) {
		console.log('message: ' + msg);
	});
	socket.on('chat message', function(msg) {
		msg.time = new Date();
		io.emit('chat message', msg);
	});
	socket.on('event message', function(event) {
		io.emit('event message', event);
	});
});

http.listen(port, function() {
	console.log('listening on port ' + port);
});