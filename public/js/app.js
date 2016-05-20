var socket = io();
var dateBanner = "";
var userName = "";
var userColor = "";

$('form').submit(function() {
	if ($('#m').val() != '') {
		var msg = {
			user: userName,
			body: $('#m').val(),
			userColor: userColor
		};
		socket.emit('chat message', msg);
		$('#m').val('');
	}
	return false;
});

socket.on('chat message', function(msg) {
	checkDate();
	$('#messages').append($('<li>').text(msg.body));
	$('#messages li:last').prepend($('<p id="name">').text(msg.user));
	$('#name:last-child').css('color', msg.userColor)
	$('#messages li:last').append($('<p id="time">').text(new Date(msg.time).toLocaleTimeString()));
});

socket.on('event message', function(event) {
	checkDate();
	$('#messages').append($('<li id="event">').text(event.user + ' ' + event.action));
	$('#messages li:last').append($('<p id="time">').text(new Date(event.time).toLocaleTimeString()));
	if (!userName) {
		displayConnect(event);
	}
});

socket.on('users', function(users) {
	$('#users li').remove();
	$.map(users, function(obj, index) {
		$('#users').append($('<li id="user" name="' + obj.userName + '">').text(obj.userName).css('color', obj.userColor));
		$('#user[name="' + userName + '"]').css('background-color', 'lightblue');
	});
});

function checkDate() {
	var d = new Date();
	var date = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
	if (dateBanner != date) {
		dateBanner = date;
		$('#messages').append($('<li id="date">').text(dateBanner));
	}
}

function displayConnect(event) {
	userName = event.user;
	userColor = event.userColor;
}