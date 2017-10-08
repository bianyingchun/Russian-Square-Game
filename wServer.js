var app = require('http').createServer();
var io = require('socket.io')(app);
var PORT = 3000;
//客户端计数
var clientCount = 0;
//存储客户端socket
var socketMap = {};
app.listen(PORT);
var bindListener = function(socket,event){
	socket.on(event,function(data){
		if(socket.clientNum%2==0){
			if(socketMap[socket.clientNum-1]){				
				socketMap[socket.clientNum-1].emit(event,data);
			}
		}else{
			if(socketMap[socket.clientNum+1]){				
				socketMap[socket.clientNum+1].emit(event,data);
			}
		}
	})
}
io.on('connection',function(socket){
	clientCount = clientCount+1;
	socket.clientNum = clientCount;
	socketMap[clientCount] = socket;
	//socket配对
	if(clientCount%2==1){
		socket.emit('wating','wating for another person');
	}else{
		if(socketMap[socket.clientNum-1]){
			socket.emit('start');
			socketMap[(clientCount-1)].emit('start');
		}else{
			socket.emit('leave');
		}
	}
	bindListener(socket,'init');
	bindListener(socket,'rotate');
	bindListener(socket,'right');
	bindListener(socket,'down');
	bindListener(socket,'left');
	bindListener(socket,'fall');
	bindListener(socket,'line');
	bindListener(socket,'next');
	bindListener(socket,'fixed');
	bindListener(socket,'time');
	bindListener(socket,'lose');
	bindListener(socket,'bottomlines');
	bindListener(socket,'addTailLines');
	socket.on('disconnet',function(){
		if(socket.clientNum%2==0){
			if(socketMap[socket.clientNum-1]){
				socketMap[socket.clientNum-1].emit('leave');
			}
		}else{
			if(socketMap[socket.clientNum+1]){				
				socketMap[socket.clientNum+1].emit('leave');
			}
		}
		delete(socketMap[socket.clientNum]);
	})

})
console.log('websocket listening on port'+PORT);