const { json } = require('express')
const {dB} =require('../databaseconnection')
let getCourses=(req,res)=>{
    dB.connect((error)=>{
        if(error)
    {
        res.json({success:false})
    }
    else
    {
        console.log("GEtting Courses")
        // dB.query("CREATE TABLE notifications (fromId VARCHAR(250),toId VARCHAR(250),coureseName TEXT,lecTitle TEXT,id VARCHAR(250),lecId TEXT,courseId TEXT,type TEXT,addedON TEXT)",(error)=>{
        //     if(!error)
        //         {
        //             console.log("Notifications Table Created")
        //         }
        // })
       
        dB.query("SELECT*FROM courses",(error,results)=>{
            if(error)
            {
                res.json({success:false})
            }
            else
            {
                res.json({success:true,courses:results})
            }
        })
    }
    })
}
let getCourse=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
        }
        else
         {
           
       
            console.log("Getting A Course")
            dB.query("SELECT*FROM courses WHERE id=?",[req.params.Id],(error,results)=>{ //getting a course by id from mysql
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    console.log(req.params.Id)
                    console.log(results)
                    res.json({success:true,course:results[0]})
                }
            })
        }
    })
}
let deleteCourse=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
        }
        else
        {
            dB.query("DELETE FROM courses WHERE id=?",(req.params.courseId),(error,results)=>{ //deleting course by id
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
let addCourse=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
        }
        else
        {
            console.log(req.params.UID)
            dB.query("SELECT*FROM users WHERE id=?",[req.params.UID],(error,results)=>{  //getting user by id from mysql database
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    let user=results[0]
                
                    
            let reviews=JSON.stringify([])  //converting array to string to store it in json format in mysql.
            let chapters=JSON.stringify([])
            let enrolledBy=JSON.stringify([])
            console.log(req.body)
           
            dB.query("CREATE TABLE courses (id VARCHAR(70),title VARCHAR(100),description TEXT,prerequisities TEXT,addedBy VARCHAR(100),creatorName VARCHAR(150),creatorProfilePhotoUrl  TEXT,creatorBio TEXT,postedON VARCHAR(100),lecs json,reviews json,enrolledBy json,category VARCHAR(100),photoUrl TEXT,previewUrl TEXT,experienceLevel VARCHAR(50))",(error)=>{
                if(!error)
                    {
                        console.log("Table Created!")
                    }
            })
      
        


             dB.query("INSERT INTO courses (id,title,description,prerequisites,experienceLevel,category,photoUrl,previewUrl, postedON,addedBy,creatorProfilePhotoUrl,creatorName,creatorBio,lecs,reviews,enrolledBy) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.title.slice(0,7)+Math.random(),req.body.title,req.body.description,req.body.prerequisites,req.body.experienceLevel,req.body.category,req.body.photoUrl,req.body.previewUrl,new Date().toLocaleString(),req.params.UID,user.profilePhotoUrl,user.name,user.bio,chapters,reviews,enrolledBy],(error,results)=>{
                 if(error)
                 {
                    console.log("Error while adding course")
                     res.json({success:false})
                 }
                 else
                 {
                    console.log("course added")
                     res.json({success:true})
                 }
             })
                }
            })
        }
    })
}


let enrollInCourse=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
        }
        else
        {
            dB.query("SELECT*FROM courses WHERE id=?",[req.params.courseId],(error,allCourses)=>{
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    dB.query("SELECT*FROM users WHERE id=?",[req.params.UID],(error,results)=>{
                        if(error)
                        {
                            res.json({success:false})
                        }
                        else
                        {
                            let course=allCourses[0]
                            let enrolledBy=course.enrolledBy
                            let user=results[0]
                            
                   // dB.query("CREATE TABLE notifications (fromId VARCHAR(250),toId VARCHAR(250),coureseName TEXT,lecTitle TEXT,id VARCHAR(250),lecId TEXT,courseId TEXT,type TEXT,addedON TEXT)",(error)=>{
        //     if(!error)
        //         {
        //             console.log("Notifications Table Created")
        //         }
        // })         
                                    dB.query("INSERT INTO notifications(courseId,fromId,toId,coureseName,id,type,addedON) VALUES(?,?,?,?,?,?,?)",[course.id,user.ID,course.addedBy,course.title,course.id+Math.random().toString(),"Enrolled",new Date().toDateString()],(error)=>{
                                        if(!error)
                                            {
                                                console.log("Enrolled Notification Added")
                                            }
                                    })
                                
                            if(enrolledBy.length==0)
                            {
                             let _enrolledBy=enrolledBy.concat({ID:user.id,name:user.name,profilePhotoUrl:user.profilePhotoUrl})
                             dB.query("UPDATE courses SET enrolledBy=? WHERE id=?",[JSON.stringify(_enrolledBy),req.params.courseId],(error)=>{
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
                            else
                            {
                                console.log("More Than 1 Enrollments")
                                let hasEnrolled=false
                                for(let user of enrolledBy)
                                {
                                    if(user.ID==req.params.UID)
                                    {
                                        hasEnrolled=true
                                    }
                                    
                                }
                                console.log(hasEnrolled)
                                if(hasEnrolled)
                                {
                                   let _enrolledBy= enrolledBy.filter((user)=>{user.ID!=req.params.UID})
                                   dB.query("UPDATE courses SET enrolledBy=? WHERE id=?",[JSON.stringify(_enrolledBy),req.params.courseId],(error)=>{
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
                                else
                                {
                                    let _enrolledBy=enrolledBy.concat({ID:user.id,name:user.name,profilePhotoUrl:user.profilePhotoUrl})
                                    dB.query("UPDATE courses SET enrolledBy=? WHERE id=?",[JSON.stringify(_enrolledBy),req.params.courseId],(error)=>{
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
                            }

                        }
                    })
                   

                }
            })
        }
    })

}
let addLec=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:fase})
        }
        else
        {
            console.log(req.params.courseId)
            dB.query("SELECT*FROM courses WHERE id=?",[req.params.courseId],(error,results)=>{
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    console.log(results)
                    let course=results[0]
                    console.log(course)
                    let lecs=course.lecs
                    let enrolledBy=course.enrolledBy
                    let _chapterId=req.body.title.slice(0,6)+Math.random().toString()
                    console.log(enrolledBy)
                     // dB.query("CREATE TABLE notifications (fromId VARCHAR(250),toId VARCHAR(250),coureseName TEXT,lecTitle TEXT,id VARCHAR(250),lecId TEXT,courseId TEXT,type TEXT,addedON TEXT)",(error)=>{
        //     if(!error)
        //         {
        //             console.log("Notifications Table Created")
        //         }
        // })
                    for(let user of enrolledBy)
                        {
                            console.log("Adding Notification")
                            dB.query("INSERT INTO notifications(courseId,lecId,coureseName,lecTitle,fromId,toId,id,type,addedON) VALUES(?,?,?,?,?,?,?,?,?)",[course.id,_chapterId,course.title,req.body.title,course.addedBy,user.ID,Math.random().toString(),"ChapterAdded",new Date().toDateString()],(error)=>{
                                if(!error)
                                    {
                                        console.log("Lecture Notification Added")
                                    }
                            })
                        }

                  
                    let _lecs=lecs.concat({title:req.body.title,description:req.body.description,photoUrl:req.body.photoUrl,videoUrl:req.body.videoUrl,likedBy:[],commentedBy:[],ID:_chapterId,completedBy:[]})
                    dB.query("UPDATE courses SET lecs=? WHERE id=?",[JSON.stringify(_lecs),req.params.courseId],(error)=>{
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
    })
}
let getLec=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
        }
        else
        {
            dB.query("SELECT*FROM courses WHERE id=?",[req.params.courseId],(error,results)=>{
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    console.log(req.params.courseId)
                    console.log(req.params.lecId)
                    let course=results[0]
                    let lecs=course.lecs
                 let filteredLecs=lecs.filter((lec)=>{return(lec.ID==req.params.lecId)})
                 res.json({success:true,lec:filteredLecs[0]})
                }
            })
        }

    })
  
}

let updateProgress=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
        }
        else
        {
            dB.query("SELECT*FROM courses WHERE id=?",[req.params.courseId],(error,results)=>{
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    let course=results[0]
                    dB.query("SELECT*FROM users WHERE id=?",[req.params.UID],(error,allUsers)=>{
                        let user=allUsers[0]
                        let allLecs=course.lecs
                        let filteredLecs=allLecs.filter((lec)=>{return(lec.ID!=req.params.chapterId)})
                        let _lec={}
                        
                        for(let lec of allLecs)
                        {
                            
                            if(lec.ID==req.params.chapterId)
                            {
                                _lec=lec

                            }
                        }
                    
                        let hasCompleted=false
                        
                        let completedBy=_lec.completedBy
                        for(let user of completedBy)
                        {
                            if(user.ID==req.params.UID)
                            {
                                hasCompleted=true
                            }
                        }
                        
                        
                     
                        if(hasCompleted)
                        {
                          _lec.completedBy=completedBy.filter((user)=>{return(user.ID!=req.params.UID)})
                          let _allLecs=filteredLecs.concat(_lec)
                           
                       dB.query("UPDATE courses SET lecs=? WHERE id=?",[JSON.stringify(_allLecs),req.params.courseId],(error)=>{
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
                        else
                        {
                            _lec.completedBy=completedBy.concat({ID:req.params.UID})
                            let _allLecs=filteredLecs.concat(_lec)
                       dB.query("UPDATE courses SET lecs=? WHERE id=?",[JSON.stringify(_allLecs),req.params.courseId],(error)=>{
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
            })
        }
    })
}
let editCourse=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
        }
        else
        {
            dB.query("DESCRIBE courses",(error,results)=>{
                console.log(results)
            })
            console.log(req.body)
            dB.query("UPDATE courses SET title=?,description=?,prerequisites=?,category=?,photoUrl=?,previewUrl=?,experienceLevel=? WHERE id=?",[req.body.title,req.body.description,req.body.prerequisites,req.body.category,req.body.photoUrl,req.body.previewUrl ,req.body.experienceLevel ,req.params.courseId],(error)=>{
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
let deleteLec=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
        }
        else
        {
            dB.query("SELECT*FROM courses WHERE id=?",[req.params.courseId],(error,results)=>{
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    let course=results[0]
                    let allLecs=course.lecs.filter((lec)=>{return(lec.ID!=req.params.lecId)})
                    dB.query("UPDATE courses SET lecs=? WHERE id=?",[JSON.stringify(allLecs),req.params.courseId],(error)=>{
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
    })
}
let editLec=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
        }
        else
        {
            dB.query("SELECT*FROM courses WHERE id=?",[req.params.courseId],(error,results)=>{
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    let course=results[0]
                    let filteredLecs=course.lecs.filter((lec)=>{return(lec.ID!=req.params.lecId)}) 
                    let selectedLec={}
                    let allLecs=course.lecs
                    for(let lec of allLecs)
                    {
                        if(lec.ID==req.params.lecId)
                        {
                            selectedLec=lec
                        }
                    }
                    selectedLec.title=req.body.title
                    selectedLec.description=req.body.description
                    selectedLec.photoUrl=req.body.photoUrl
                    selectedLec.photoUrl.videoUrl=req.body.videoUrl
                    let _allLecs=filteredLecs.concat(selectedLec)
                    dB.query("UPDATE courses SET lecs=? WHERE id=?",[JSON.stringify(_allLecs),req.params.courseId],(error)=>{
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
    })
}

module.exports={getCourse,addCourse,deleteCourse,getCourses,enrollInCourse,addLec,getLec,updateProgress,editCourse,deleteLec,editLec}