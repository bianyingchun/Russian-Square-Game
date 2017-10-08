var socket = io('ws://localhost:3000');
var local = new Local(socket);
var remote = new Remote(socket);
socket.on('wating',function(str){
	document.getElementById('wating').innerHTML=str;
})