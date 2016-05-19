var socket = io();
var dateBanner = "";
var userName = "";
var nameColor = "";

$('form').submit(function() {
	if ($('#m').val() != '') {
		var msg = {
			user: userName,
			body: $('#m').val(),
			nameColor: nameColor
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
	$('#name:last-child').css('color', msg.nameColor)
	$('#messages li:last').append($('<p id="time">').text(new Date(msg.time).toLocaleTimeString()));
});

socket.on('event message', function(event) {
	checkDate();
	$('#messages').append($('<li id="event">').text(event.user + ' ' + event.action));
	$('#messages li:last').append($('<p id="time">').text(new Date().toLocaleTimeString()));
	if (!userName) {
		displayConnect(event);
	}
	userListPop(event);
});

function checkDate() {
	var d = new Date();
	var date = d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear();
	if (dateBanner != date) {
		dateBanner = date;
		$('#messages').append($('<li id="date">').text(dateBanner));
	}
}

function displayConnect(event) {
	userName = event.user;
	nameColor = event.nameColor;
}

function userListPop(event) {
	$('#users li').remove();
	$.map(event.userList, function(obj, index) {
		$('#users').append($('<li id="user" name="' + obj.userName + '">').text(obj.userName).css('color', obj.userColor));
		console.log("list names ", obj.userName);
		console.log("local name: ", userName);
		$('#user[name="'+ userName + '"]').css('background-color', 'lightblue');
	});
};