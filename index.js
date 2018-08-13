var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var timecodes = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

    // when a new clients connects, send the test results so far
    for(var i = 0; i < timecodes.length; i++){
        socket.emit('timecodeMsg', timecodes[i]);
    }

    // when a new timecode comes from a client, handle it
    socket.on('timecodeMsg', function (timecode) {

        // add timecode to current test list of timecodes
        var timecodeObj = {timestamp: new Date().getTime(), timecode: timecode};
        timecodes.push(timecodeObj);

        // send timecodes to all clients
        io.emit('timecodeMsg', timecodeObj);
    });

    // when the reset signal comes, reset the current test without restarting the server
    socket.on('resetTest', function(msg){
        console.log("Test has been reset.");
        timecodes = [];

        // send reset signal to all clients
        io.emit('resetTest');
    });
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});