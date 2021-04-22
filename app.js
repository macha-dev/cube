const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
    console.log(`user ${socket.id} connected`);


    //array of connected sockets
    var socketArray = [];

    for (x in io.sockets.sockets)
    {
        if (x != socket.id)
        socketArray.push(x);
    };


    //sends list of connected sockets to newly connected socket
    io.sockets.connected[socket.id].emit("loadCubes", socketArray);

    //asking sockets to send their current locations when a new socket joins
    socket.broadcast.emit("posReq");

    //signals new socket to connected sockets
    socket.broadcast.emit("newCube", socket.id);

    socket.on("updateServer", (position) => {
        //console.log(position);
        socket.broadcast.emit("updateSockets", socket.id, position);
    });

    socket.on("disconnect", (reason) => {
        console.log(`user ${socket.id} disconnected (reason: ${reason})`);
        socket.broadcast.emit("cubeDisconnect", socket.id);
    });

});

server.listen(80, () => {
    console.log("listening on *:80");
});

