const {dB}=require('../databaseconnection')
const{IO, getReceiverSocketId}=require('../socket')
let getMessages=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
            console.log("There was an error while connecting to the database")
        }
        else
        {
            console.log("getting messages")
           

            dB.query(`SELECT* FROM messages`,(error,results)=>{
                if(error)
                {
                    res.json({success:false})
                } 
                else
                {
                    let allMessages = results
                    let messages =[]
                    console.log("Getting Messages")
                    for(let message of allMessages)
                    {
                        if((message.senderId==req.params.senderId||message.senderId==req.params.receiverId)&&(message.receiverId==req.params.senderId||message.receiverId==req.params.receiverId))
                        {
                            messages.push(message)
                        }
                    }
                    res.json({success:true,messages})
                }
            })
        }
      
    })
}

let addMessage=(req,res)=>{
    console.log()
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
            console.log("There was an error while connecting to the database")
        }
        else
        {
           
           dB.query("CREATE TABLE messages (id TEXT,text TEXT,addedON VARCHAR(250),addedAt VARCHAR(250),mediaType VARCHAR(250),mediaUrl VARCHAR(250),senderId VARCHAR(250),receiverId VARCHAR(250))",(error)=>{
            if(!error)
                {
                    console.log("Messages Table Created")
                }
           })

            dB.query(`INSERT INTO messages ( id,text,mediaType,mediaUrl,addedON,addedAt,senderId,receiverId) VALUES(?,?,?,?,?,?,?,?)`,[req.body.text+Math.random(),req.body.text,req.body.mediaType,req.body.mediaUrl,req.body.addedON,req.body.addedAt,req.params.senderId,req.params.receiverId],(error,results)=>{
                if(error)
                {
                    console.log("Cannot Add Message")
                    res.json({success:false})
                }
                else
                {
                    console.log("Message From",getReceiverSocketId(req.params.senderId),"To:",getReceiverSocketId(req.params.receiverId))
                    let receiverSocketId=getReceiverSocketId(req.params.receiverId)
                    console.log(receiverSocketId)
                    if(receiverSocketId.length>0)
                    {
                    IO.to(receiverSocketId).emit("newMsg",{text:req.body.text,medialType:req.body.mediaType,mediaUrl:req.body.mediaUrl,addedON:new Date().toLocaleDateString(),addedAt:new Date().toLocaleTimeString()})                    
                    }
                    console.log("Message Added added")
                    res.json({success:true})
                }
            })
        }
      
    }) 
} 

let getChats=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
        }
        else
        {
            dB.query("SELECT*FROM messages",(error,results)=>{
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    let allMessages =results
                    dB.query("SELECT*FROM users",(error,users)=>{
                        if(error)
                        {
                            res.json({success:false})
                        }
                        else
                        {
                            let conversations=[]
                            let allUsers = users.filter((user)=>{return (user.id!=req.params.UID)})
                            for(let user of allUsers)
                            {
                                let messages=[]
                                for(let message of allMessages)
                                {
                                    if((message.senderId==req.params.UID||message.senderId==user.id)&&(message.receiverId==req.params.UID||message.receiverId==user.id))
                                    {
                                        messages.push(message)
                                    }
                                }
                                if(messages.length>0)
                                {
                                    conversations.push({with:user.name,withProfilePhotoUrl:user.profilePhotoUrl,UID:user.id,lastMsg:messages.length==1?messages[0]:messages[messages.length-1]})
                                }
                            }
                            res.json({success:true,conversations})
                        }
                    })
                }
            })

        }
    })
}
module.exports={addMessage,getMessages,getChats}
