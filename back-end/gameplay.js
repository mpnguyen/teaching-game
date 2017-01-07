var RoomData = require('./models/RoomData');
var Player = require('./models/Player');
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
    gameSocket.on('nextQuestion', nextQuestion);

    gameSocket.on('joinGame', joinGame);
    gameSocket.on('currentQuestion', currentQuestion);
    gameSocket.on('answerQuestion', answerQuestion);

    gameSocket.on('disconnect', disconnect);
    gameSocket.on('playerJoinedRoom', playerJoinedRoom);
    gameSocket.on('playerLeaveRoom', playerLeaveRoom);
};

function playerLeaveRoom(sock) {
    if(parseInt(sock.data.currentRoom)) {
        var room = gameRooms.filter(function (room) {
            return room.room == sock.data.currentRoom;
        });
        if(room.length>0) {
            var player = room[0].players.filter(function (player) {
                return player.username = sock.data.username;
            });
            if(player.length>0) {
                room[0].players.splice(room[0].players.indexOf(player[0])-1, 1);
                io.sockets.in(sock.data.currentRoom.toString()).emit('playerLeaveRoom', room[0].players);
            }
        }
    }

}

function answerQuestion(data) {
    var sock = this;
    if (!sock.data.isHost)
    {
        var room = gameRooms.filter(function (room) {
            return room.room == sock.data.currentRoom;
        });

        var players = room[0].players.filter(function (player) {
            return player.username == sock.data.username;
        });
        if(players.length>0) {
            if(data == parseInt(room[0].package.questions[room[0].currentIndex].correct)){
                players[0].score += ((new Date(room[0].time)) - (new Date(Date.now())))/1000;
            }
            room[0].counter = room[0].counter + 1;
            io.sockets.in(sock.data.currentRoom).emit('playerAnswered', room[0].counter);
            console.log(players[0].score);
        }
    }
}

function nextQuestion() {
    var sock = this;
    if(sock.data.isHost){
        var room = gameRooms.filter(function (room) {
            return room.room == sock.data.currentRoom;
        });
        console.log(room[0].currentIndex);
        console.log((room[0].package.questions.length - 1));
        if(room[0].currentIndex < room[0].package.questions.length - 1) {
            var deadline = new Date(Date.now());
            deadline.setSeconds(deadline.getSeconds()+20);
            room[0].time = deadline;

            var question = room[0].package.questions[room[0].currentIndex];
            setTimeout(function () {
                var scores = [];
                scores = getScore(room[0]);
                console.log('test');
                io.sockets.in(sock.data.currentRoom).emit('endQuestion',{correct: question.correct, score: scores});
            }, 20000);
            room[0].counter = 0;
            room[0].currentIndex = room[0].currentIndex + 1;
            io.sockets.in(sock.data.currentRoom).emit('questionChanged', {message: 'Next question'});
        }
        else
        {
            gameRooms.splice(gameRooms.indexOf(room[0]) -1 , 1);
            io.sockets.in(sock.data.currentRoom).emit('endGame', {message: 'Game has ended'});
        }
    }
}

function getScore(room) {
    var players = room.players.sort(function (a, b) {
        return b.score - a.score;
    });
    console.log(players);

    players.splice(5, players.length - 5);
    console.log(players);

    return players;
}

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
            room[0].currentIndex = 0;
            room[0].isStarted = true;
            var deadline = new Date(Date.now());
            deadline.setSeconds(deadline.getSeconds()+20);
            room[0].time = deadline;
            var question = room[0].package.questions[room[0].currentIndex];
            setTimeout(function () {
                var scores = [];
                scores = getScore(room[0]);
                io.sockets.in(sock.data.currentRoom).emit('endQuestion',{correct: question.correct, score: scores});
            }, 20000);
            io.sockets.in(sock.data.currentRoom).emit('gameStarted', {message: 'Game has been started'});
        })
    }
}

function currentQuestion() {
    var sock = this;
    var room = gameRooms.filter(function (room) {
        return room.room == sock.data.currentRoom;
    });

    var question = {
        question: room[0].package.questions[room[0].currentIndex].question,
        image: room[0].package.questions[room[0].currentIndex].image,
        deadline: room[0].time,
        answers: room[0].package.questions[room[0].currentIndex].answers
    };
    io.to(sock.id).emit('receiveQuestion', question);
}

function playerJoinedRoom() {
    var sock = this;
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
        playerLeaveRoom(sock);
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
               message: 'Can not find question package'
           };
           io.to(sock.id).emit('getPackageFailed', data);
           return;
        }
        //Package not exist
        if(!package){
           var data ={
               success: false,
               message: "Cant not find package"
           };
           io.to(sock.id).emit('getPackageFailed', data);
           return;
        }

        //generate room id then join the room
        var thisGameId = ( Math.random() * 100000 ) | 0;
        var roomData = new RoomData();
        roomData.room = thisGameId;
        roomData.package = package;
        roomData.players = [];
        roomData.isStarted = false;
        roomData.counter = 0;

        sock.data.currentRoom = thisGameId;
        sock.data.isHost = true;
        sock.join(thisGameId.toString());
        io.to(sock.id).emit('newGameCreated', {gamePIN: thisGameId, mySocketId: sock.id});

        gameRooms.push(roomData);
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
                var players = gameRooms[i].players.filter(function (player) {
                    return player == sock.data.username;
                });
                if(gameRooms[i].isStarted) {
                    data.message = 'Join room fail. Game has been started';
                    io.to(sock.id).emit(input.gamePIN).emit('joinRoomFail', data);
                    return;
                }
                if(players.length > 0)
                {
                    data.message = 'Invalid username';
                    io.to(sock.id).emit(input.gamePIN).emit('joinRoomFail', data);
                    return;
                }
                var player = new Player();
                player.username = sock.data.username.toString();
                player.score = 0;
                gameRooms[i].players.push(player);
                console.log(gameRooms[i].players[0].username);
            }
        }
        data.message = 'Join room success';
        io.to(sock.id).emit('joinRoomSuccess', data);
        return;
    }
    data.message = 'Join room fail';
    io.to(sock.id).emit(input.gamePIN).emit('joinRoomFail', data);
}