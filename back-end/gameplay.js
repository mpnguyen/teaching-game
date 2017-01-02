var RoomData = require('./models/RoomData');
var io;
var gameSocket;
var gameRooms;

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Package = mongoose.model('Package');
var Question = mongoose.model('Question');

exports.initGame = function (sio, socket) {
    if(!gameRooms)
        gameRooms = [];
    io = sio;
    gameSocket = socket;

    gameSocket.data = {
        username: {},
        currentRoom: {},
        isHost: {},
        room: {}
    };

    gameSocket.emit('connected', {message: "You have connected", id: gameSocket.id});

    gameSocket.on('createNewGame', createNewGame);
    gameSocket.on('startGame', startGame);
    gameSocket.on('currentQuestion', currentQuestion);

    gameSocket.on('playerJoinedRoom', playerJoinedRoom);

    gameSocket.on('joinGame', joinGame);
    gameSocket.on('disconnect', disconnect);
};

function startGame() {
    var sock = this;
    if(sock.data.isHost) {
        var room = gameRooms.filter(function (room) {
            return room.room == sock.data.currentRoom;
        });

        room[0].package.populate('questions', function (err, package) {
            if(err) {
                return;
            }
            if(!package) {
                return;
            }
            room[0].package = package;
            console.log('start game');
            //console.log(room[0].package);

            io.sockets.in(sock.data.currentRoom).emit('gameStarted', {message: 'Game has been started'});
        })
    }
}

function currentQuestion() {
    var sock = this;
    var room = gameRooms.filter(function (room) {
        return room.room == sock.data.currentRoom;
    });
    console.log(room[0].package);
}

function playerJoinedRoom() {
    var sock = this;
    console.log(sock.data);
    if(parseInt(sock.data.currentRoom)) {
        var room = gameRooms.filter(function (room) {
            return room.room == sock.data.currentRoom;
        });
        io.sockets.in(sock.data.currentRoom.toString()).emit('newPlayerJoined', room[0].players);
    }
}


//TODO: handle disconnect event of client
function disconnect() {
    var sock = this;
    if(sock.data.isHost) {
        io.sockets.in(sock.data.currentRoom).emit('hostLeaveRoom', {message: 'Host has left the room'});
    }
    else{
        io.sockets.in(sock.data.currentRoom).emit('playerLeftRoom', {message: sock.data.username + ' has left the room'})
    }
}

function createNewGame(PIN) {
    var sock = this;

    Package.findOne({id: PIN}, function (err, package) {
        // ERROR!!!
        if(err) {
           var data = {
               success: false,
               message: err
           }
           console.log(err);
           io.to(sock.id).emit('getPackageFailed', data);
           return;
        }
        //Package not exist
        if(!package){
           var data ={
               success: false,
               message: "Cant not find package"
           };
           console.log("error");
           io.to(sock.id).emit('getPackageFailed', data);
           return;
        }

        //generate room id then join the room
        var thisGameId = ( Math.random() * 100000 ) | 0;
        var roomData = new RoomData();
        roomData.room = thisGameId;
        roomData.package = package;
        roomData.players = [];


        sock.data.currentRoom = thisGameId;
        sock.data.isHost = true;
        sock.join(thisGameId.toString());
        io.to(sock.id).emit('newGameCreated', {gamePIN: thisGameId, mySocketId: sock.id});

        gameRooms.push(roomData);

        console.log(thisGameId);
    });
}


function joinGame(input) {
    var room = io.sockets.adapter.rooms[input.gamePIN];
    var data = {};
    var sock = this;

    if(room!=undefined) {
        sock.data.username = input.username;
        sock.data.isHost = false;
        sock.data.currentRoom = input.gamePIN;

        sock.join(input.gamePIN);

        data.gamePIN = input.gamePIN;
        for (var i = 0; i < gameRooms.length; i++) {
            if(gameRooms[i].room == sock.data.currentRoom){
                if(!gameRooms[i].players)
                    gameRooms[i].players = [];
                gameRooms[i].players.push(sock.data.username.toString());
            }
        }
        data.message = 'Join room success';
        io.to(sock.id).emit('joinRoomSuccess', data);
        return;
    }
    data.message = 'Join room fail';
    io.to(sock.id).emit(input.gamePIN).emit('joinRoomFail', data);
}
