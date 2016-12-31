var io;
var gameSocket;
exports.initGame = function (sio, socket) {
    io = sio;
    gameSocket = socket;
    console.log(gameSocket.id);

    gameSocket.emit('connected', {message: "You have connected",
    id: gameSocket.id});

    gameSocket.on('createNewGame', createNewGame);

    gameSocket.on('joinGame', joinGame);
};

function createNewGame() {
    var thisGameId = ( Math.random() * 100000 ) | 0;
    console.log(gameSocket === this);
    io.to(this.id).emit('newGameCreated', {gameId: thisGameId, mySocketId: this.id});
    this.join(thisGameId.toString());
    console.log(gameSocket.rooms);
}


function joinGame(gameId) {
    var room = gameSocket.rooms[gameId.toString()];

    var data = {};
    if(room!=undefined) {
        data.gameId = room;
        this.join(data.gameId);
        io.sockets.in(data.gameId).emit('playerJoinedRoom', data);
    }
    console.log(gameSocket.rooms);
}
