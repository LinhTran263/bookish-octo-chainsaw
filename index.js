//initialising express app
let express = require("express");
let app = express();
const { instrument } = require("@socket.io/admin-ui");
app.use("/", express.static("public"))


//creating an http server ON the express app
let http = require("http");
let server = http.createServer(app);
server.listen(5000, ()=>{
    console.log("listening on 5000")
})

//add sockets on top of the http server
let io = require("socket.io");
io = new io.Server(server,{
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true
    }
});

instrument(io, {
    auth: false
  });
  

//create variable for publuc namespcae
let publicSockets = io.of("/publicSpace")

//when socket is connected
publicSockets.on("connect", (socket)=>{
    console.log("New Connection: ", socket.id);

    //when server gets data from C
    socket.on("mouseData", (data)=>{
        publicSockets.emit("serverData", data)
        privateSockets.emit("serverData", data)
    })

    socket.on("mouseErase", (data)=>{
        publicSockets.emit("serverData", data)
    })

    //when socket is disconneted
    socket.on("disconnect", ()=>{
        console.log("Socket Disconnected: ", socket.id)
    })
})

//create variable for publuc namespcae
let privateSockets = io.of("/privateSpace")

//when socket is connected
privateSockets.on("connect", (socket)=>{
    console.log("New Connection: ", socket.id);

    socket.on("roomJoined", (data)=>{
        socket.roomName = data.name;
        socket.join(socket.roomName);
    })

    //when server gets data from C
    socket.on("mouseData", (data)=>{
        privateSockets.emit("serverData", data)
    })

    socket.on("mouseErase", (data)=>{
        privateSockets.emit("serverData", data)
    })

    //when socket is disconneted
    socket.on("disconnect", ()=>{
        console.log("Socket Disconnected: ", socket.id)
    })
})



/* 
Information flow

Client (C)- initiate connection to S
Server (S) - recognise a C connection and then acknowledge when C connects
S- also tell me when C disconnects
C-ack. when connection has been established


On to the whiteboard
C- .emit mx, my ("mouseData") to Server
S- .on getting "mouseData", .emits to all C "serverData"
C- .on getting "serverData", draw ellipse
*/

