const { dB } = require("../databaseconnection")

let getNotifications=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:true})
        }
        else
        {
            dB.query("SELECT*FROM notifications WHERE toId=?",[req.params.UID],(error,notifications)=>{
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    res.json({success:true,notifications})
                }
            })
        }
    })
}
let deleteNotification=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
        }
        else
        {
            dB.query("DELETE*FROM notifications WHERE id=?",[req.params.notificationId],(error)=>{
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    res.json({success:true})
                }
            })
        }
    })
}
module.exports={getNotifications,deleteNotification}