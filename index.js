var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var lastTimecodeObj = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

    // on connection, send timecode to all clients
    io.emit('timecodeMsg', lastTimecodeObj);

    // when a new timecode comes from a client, handle it
    socket.on('timecodeMsg', function (timecode) {

        // save last timecode
        lastTimecodeObj = {timestamp: new Date().getTime(), timecode: timecode};

        // send timecode to all clients
        io.emit('timecodeMsg', lastTimecodeObj);
    });

    // when the reset signal comes, reset the current test data
    socket.on('resetTest', function(msg){
        console.log("Test has been reset.");
        lastTimecodeObj = {};

        // send reset signal to all clients
        io.emit('resetTest');
    });
});

var port = 3000;
http.listen(port, function () {
    console.log('listening on *:' + port);
});