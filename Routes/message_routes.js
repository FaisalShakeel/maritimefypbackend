const express = require('express')
const { getChats,addMessage,getMessages,deleteMessage } = require('../Controllers/MessageController')
let messageRouter=express.Router()
messageRouter.post("/addmessage/:senderId/:receiverId",addMessage)
messageRouter.get("/getmessages/:senderId/:receiverId",getMessages)
messageRouter.get("/getconversations/:UID",getChats)
module.exports = {messageRouter}