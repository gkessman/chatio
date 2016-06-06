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
	var matches = msg.user.match(/\b(\w)/g);
	var acronym = matches.join('').charAt(0).toUpperCase() + matches.slice(1);
	$('#messages').append($('<li id="'+ msg.id +'" class="message">'));
	var selector = $('li[id="'+ msg.id +'"]');
	selector.prepend($('<div id="body">').text(msg.body));
	selector.prepend($('<div id="time">').text(new Date(msg.time).toLocaleTimeString()));
	selector.prepend($('<div id="name">').text(msg.user));
	selector.prepend($('<div id="avatar">').text(acronym).css('background-color', msg.userColor));
});

socket.on('event message', function(event) {
	checkDate();
	$('#messages').append($('<li id="event">'));
	$('#messages li:last').prepend($('<div id="event-body">').text(event.user + ' ' + event.action));
	$('#messages li:last').prepend($('<div id="event-time">').text(new Date(event.time).toLocaleTimeString()));
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