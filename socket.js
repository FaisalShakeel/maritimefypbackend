const express=require('express')
const app=express()
const socketIo=require('socket.io')
const http=require('http')
let server =http.createServer(app)
let IO = socketIo(server,{cors:{origin:"*"}});
let connectedUsers=[]
 IO.on("connection",(socket)=>{
   let userId= socket.handshake.query.userId
   let alreadyConnected=false
   console.log(userId)
   console.log(connectedUsers)
   for(let user of connectedUsers)
   {
    if(user.ID==userId)
    {
        alreadyConnected=true
        console.log("This user is already connected")
    }
   }
   if(alreadyConnected)
   {
   let _connectedUsers=connectedUsers.filter((user)=>{return user.ID!=userId})
   console.log(_connectedUsers)
   _connectedUsers.push({ID:userId,socketId:socket.id})
   connectedUsers=_connectedUsers
   }
   else
   {
    connectedUsers.push({ID:userId,socketId:socket.id})
   }
    console.log("A New User Connected With Id:",socket.id)
    console.log(connectedUsers)

    socket.on('disconnect',()=>{
        connectedUsers=connectedUsers.filter((user)=>{return(user.socketId!=socket.id)})
        console.log(connectedUsers)
        console.log("User with Id",socket.id,"has been disconnected")
    })
 })
 let getReceiverSocketId=(userId)=>
 {
    let socketId=""
    for(let user of connectedUsers)
    {
        if(user.ID==userId)
        {
            socketId=user.socketId

        }
    }
 return socketId
 }

module.exports={app,server,IO,getReceiverSocketId} 