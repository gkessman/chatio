var socket = io();
var dateBanner = "";
var name = "";
var nameColor= "";

$('form').submit(function() {
	var msg = {
		user: name,
		body: $('#m').val(),
		nameColor: color
	};
	socket.emit('chat message', msg);
	$('#m').val('');
	return false;
});

socket.on('chat message', function(msg) {
	checkDate();
	$('#messages').append($('<li>').text(msg.body));
	$('#messages li:last').prepend($('<p class="name">').text(msg.user));
	$('.name:last').css('color', msg.nameColor)
	$('#messages li:last').append($('<p class="time">').text(new Date(msg.time).toLocaleTimeString()));
});

socket.on('event message', function(event) {
	checkDate();
	$('#messages').append($('<li class="event">').text(event.user + ' ' + event.action));
	$('#messages li:last').append($('<p class="time">').text(new Date().toLocaleTimeString()));
	if (!name) {
		name = event.user;
		color = event.nameColor;
		$('.user').text(name);
	}
});

var checkDate = function() {
	var d = new Date();
	var date = d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear();
	if (dateBanner != date) {
		dateBanner = date;
		$('#messages').append($('<li class="date">').text(dateBanner));
	}
}