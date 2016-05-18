var socket = io();
var dateBanner = "";
var name = "";
var nameColor= "";

$('form').submit(function() {
	var msg = {
		user: name,
		body: $('#m').val(),
		nameColor: nameColor
	};
	socket.emit('chat message', msg);
	$('#m').val('');
	return false;
});

socket.on('chat message', function(msg) {
	checkDate();
	$('#messages').append($('<li>').text(msg.body));
	$('#messages li:last').prepend($('<p id="name">').text(msg.user));
	$('#name:last-child').css('color', msg.nameColor)
	$('#messages li:last').append($('<p id="time">').text(new Date(msg.time).toLocaleTimeString()));
});

socket.on('event message', function(event) {
	checkDate();
	$('#messages').append($('<li id="event">').text(event.user + ' ' + event.action));
	$('#messages li:last').append($('<p id="time">').text(new Date().toLocaleTimeString()));
	if (!name) {
		name = event.user;
		nameColor = event.nameColor;
		$('#user').text(name).css('text-shadow', '1px 1px 2px black, 0 0 10px ' + nameColor);
	}
});

var checkDate = function() {
	var d = new Date();
	var date = d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear();
	if (dateBanner != date) {
		dateBanner = date;
		$('#messages').append($('<li id="date">').text(dateBanner));
	}
}