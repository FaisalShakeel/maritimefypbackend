const express=require('express')
const { getNotifications, deleteNotification } = require('../Controllers/NotificationController')
let notificationRouter=express.Router()
notificationRouter.get("/getmynotifications/:UID",getNotifications)
notificationRouter.delete("/deletenotification/:notificationId",deleteNotification)
module.exports={notificationRouter}