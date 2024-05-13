const jwt= require('jsonwebtoken')
const {dB}= require('../databaseconnection')
const{SECRET_KEY}=require('../jwt_secret')
let register =(req,res)=>{
    let isRegistered=false
    console.log(dB)
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
            console.log("There was an error while connecting to the database")
        }

        else
        {
            console.log("Connected!")
            console.log(req.body)
            dB.query("DESCRIBE users",(error,results)=>{
                console.log(results)

            })
            // dB.query("DROP TABLE users",(error)=>{
            //     if(!error)
            //         {
            //             console.log("Table Deleted")
            //         }
            // })
           
            dB.query("SELECT*FROM users WHERE EMailAddress=?",[req.body.EMailAddress],(error,results)=>{
                if(!error)
                {
                    console.log(results)
                    if(results.length>0)
                    {
                    res.json({success:false,isRegistered:true})
                    }
                    else
                    {
                        let _Id=req.body.name.slice(0,5)+Math.random().toString() 
                       console.log(req.body)
                      
                        dB.query(`INSERT INTO users(id,name,EMailAddress,passWord,profilePhotoUrl,role,bio) VALUES(?,?,?,?,?,?,?)`,[_Id,req.body.name,req.body.EMailAddress,req.body.passWord, req.body.profilePhotoUrl,req.body.role,req.body.bio],(error,results)=>{
                            if(error)
                            {
                                res.json({success:false})
        
                            
                            console.log("Done")
                        }
                            else
                            {
                                console.log("Account Created")
                                let token =jwt.sign({Id:_Id},SECRET_KEY,{expiresIn:"25d"})
                                res.json({success:true,_Id,profilePhotoUrl:req.body.profilePhotoUrl,token})
                                
                            }
                        
                        })
                    }
                }

            
            })
            console.log(isRegistered)
        
            }
      
    })
} 
let login = async(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
        }
        else
        {
            dB.query("SELECT*FROM users WHERE EMailAddress=?",[req.body.EMailAddress],(error,results)=>{
                if(error)
                {
                    res.json({success:false,message:""})
                }
                else
                {
                    if(results.length>0)
                    {
                        let user =results[0]
                        if(user.passWord==req.body.passWord)
                        {
                            
                            console.log("LoggedIN")
                            let token=jwt.sign({Id:user.id},SECRET_KEY,{expiresIn:"25d"})
                            res.json({success:true,user,token})
                        }
                        else
                        {
                        
                            res.json({success:false,message:"Incorrect PassWord"})
                        }
                    }
                    else
                    {
                        res.json({success:false,message:"EMailAddress Does Not Exist"})
                    }
                }
            }
            )
        }
    })

}
let update=async(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({sucess:false})
        }
        else
        {
            dB.query('UPDATE users SET name=?,passWord=?,profilePhotoUrl=?,bio=? WHERE id=?',[req.body.name,req.body.passWord,req.body.profilePhotoUrl,req.body.bio,req.params.UID],(error,results)=>{
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                res.json({success:true,profilePhotoUrl:req.body.profilePhotoUrl})    
                }
            })
        }
    })
}
let getProfile=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
        }
        else
        {
            dB.query("SELECT*FROM users WHERE id=?",[req.params.Id],(error,results)=>{
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    
                    console.log("Getting User Profile")
                    let user=results[0]
                    //    dB.query("CREATE TABLE courses (id VARCHAR(70),title VARCHAR(100),description TEXT,addedBy VARCHAR(100),uploaderName VARCHAR(150),uploaderPhotoUrl,  TEXT,creatorBio TEXT,postedON VARCHAR(100),chapters json,reviews json,enrolledBy json ,likedBy json ,category VARCHAR(100))",(error)=>{
                    //     if(!error)
                    //     {
                            
                            dB.query("CREATE TABLE jobs (id VARCHAR(70),title VARCHAR(25),description TEXT,perksAndBenefits TEXT,location VARCHAR(50),contractType VARCHAR(20),requirements TEXT,responsibilities TEXT,companyName VARCHAR(150),companyLogoUrl TEXT,companyBio TEXT,uploadedByName VARCHAR(200),uploadedById VARCHAR(150),uploadedByPhoto TEXT,postedON VARCHAR(100),applicants json)",(error)=>{
                                if(!error)
                                {
                                    console.log("Jobs Table Created!")
                                }
                           })
                //        }
                //    })
                //    dB.query("ALTER TABLE jobs ADD COLUMN postedBy VARCHAR(150)",(error)=>{
                //     if(!error)
                //     {
                //         console.log("Column Added")
                //     }
                //    })
               
                 


                    
                        dB.query("SELECT*FROM courses",(error,results)=>{
                            if(error)
                            {
                                res.json({success:false})
                            }
                            else
                            {
                                console.log(results)
                                console.log("Courses")
                                dB.query("SELECT*FROM jobs",(error,allJobs)=>{
                                    if(error)
                                    {
                                        res.json({success:false})
                                    }
                                    else
                                    {
                                        console.log("Jobs",allJobs)
                                        console.log(user)
                                        if(user.role=="admin")  //getting user data accoroding to his selected role
                                        {
                                            console.log("Admin Profile")
                                            let allCourses=results
                                        let MyCourses=allCourses.filter((course)=>{return (course.addedBy==req.params.Id)})
                                        let MyJobs=allJobs.filter((job)=>{return(job.uploadedById==req.params.Id)})
                                        console.log(MyCourses)
                                        console.log("My Jobs",MyJobs)
                                        res.json({success:true,user,MyCourses,MyJobs})
                                        }
                                        else if(user.role=="student")
                                        {
                                            let allCourses=results
                                        let enrolledIn=allCourses.filter((course)=>{
                                            let isEnrolled=false
                                            let enrolledBy=course.enrolledBy
                                            for(let user of enrolledBy)
                                            {
                                                if(user.ID==req.params.Id)
                                                {
                                                    isEnrolled=true
                                                }
                                            }
                                            return isEnrolled
                                        })
                                       
                                            
                                            
                                        console.log("Enrolled In",enrolledIn)
                                        
                                        res.json({success:true,user,enrolledIn})
                                        }

                                    else if(user.role=="job seeker")
                                    {
                                        console.log("Getting Job Seeker Profile")
                                        let _appliedJobs=allJobs.filter((job)=>{
                                            let applicants = job.applicants
                                            let isApplicant=false
                                        
                                            for(let applicant of applicants)
                                            {
                                                if(applicant.ID==user.id)
                                                {
                                                    isApplicant=true
        
                                                }
                                            }
                                            return isApplicant
                                        })
                                        console.log(_appliedJobs)
                                        res.json({success:true,user,_appliedJobs})
                                    }    
                                        
                                    }
                                    
                                })
                               
                                
                            }

                        })
                    
                }
            })
        }
    })

}
// let follow=(req,res)=>{
//     dB.connect((error)=>{
//         if(error)
//         {
//             res.json({success:false})
//         }
//         else
//         {
//             dB.query("SELECT*FROM users WHERE id=?",[req.params.userToFollowId],(error,results)=>{
//                 if(error)
//                 {
//                     res.json({success:false})
//                 }
//                 else
//                 {
//                     console.log("usertofollowId",req.params.userToFollowId)
//                     console.log("UID",req.params.UID)
//                     let userToFollow=results[0]
//                     dB.query("SELECT*FROM users WHERE id=?",[req.params.UID],(error,results)=>{
//                         if(error)
//                         {
//                             res.json({success:false})
//                         }
//                         else
//                         {
//                             let user=results[0]
//                             console.log("USER To follow",userToFollow)
//                             console.log("User",user)
//                             if(userToFollow.followers.length==0)
//                             {
//                                 console.log("Following The User")
//                                 let following=user.following.concat({ID:userToFollow.id,name:userToFollow.anem,profilePhotoUrl:userToFollow.profilePhotoUrl})
//                                 let followers=userToFollow.followers.concat({ID:user.id,name:user.name,profilePhotoUrl:user.profilePhotoUrl})
//                                 console.log(following)
//                                 console.log(followers)
//                                 dB.query("UPDATE users SET followers=? WHERE id=?",[JSON.stringify(followers),req.params.userToFollowId],(error)=>{
//                                     if(error)
//                                     {
//                                         res.json({success:false})
//                                     }
//                                     else
//                                     {
//                                         dB.query("UPDATE users  SET following=? WHERE id=?",[JSON.stringify(following),req.params.UID],(error)=>{
//                                             if(error)
//                                             {
//                                         res.json({success:false})

//                                             }
//                                             else
//                                             {
//                                                 console.log("Successfully Followed")
//                                                 res.json({success:true})

//                                             }
//                                         })
//                                     }
//                                 })

                            
                            
                                

//                             }
//                             else
//                             {
//                                 console.log("Trying To Follow")
//                                 let following=user.following
//                                 let followers=userToFollow.followers
//                                 let isFollowing=false
//                                 for(let user of followers )
//                                 {
//                                     if(user.ID==req.params.UID)
//                                     {
//                                         isFollowing=true
//                                     }
//                                 }
//                                 console.log(isFollowing)
//                                 if(isFollowing)
//                                 {
//                                     let _following=following.filter((user)=>{return(user.ID!=req.params.userToFollowId)})
//                                     let _followers=followers.filter((user)=>{return(user.ID!=req.params.UID)})
//                                     console.log(_followers)
//                                     console.log(_following)
//                                     dB.query("UPDATE users SET following=? WHERE id=?",[JSON.stringify(_following),req.params.UID],(error)=>{
//                                         if(error)
//                                         {
//                                             res.json({success:false})
//                                         }
//                                         else
//                                         {
//                                             dB.query("UPDATE users SET followers=? WHERE id=?",[JSON.stringify(_followers),req.params.userToFollowId],(error)=>{
//                                                 if(error)
//                                                 {
//                                                     res.json({success:false})
//                                                 }
//                                                 else
//                                                 {
//                                                     console.log("Successfully Unfollowed")
//                                                     res.json({success:true})
//                                                 }
//                                             })
//                                         }
//                                     })

//                                 }
//                                 else
//                                 {
//                                     let following=user.following.concat({ID:userToFollow.id,name:userToFollow.name,profilePhotoUrl:userToFollow.profilePhotoUrl})
//                                     let followers=userToFollow.followers.concat({ID:user.id,name:user.name,profilePhotoUrl:user.profilePhotoUrl})
//                                     dB.query("UPDATE courses SET following=? WHERE id=?",[JSON.stringify(following),req.params.UID],(error)=>{
//                                         if(error)
//                                         {
//                                             res.json({success:fase})
//                                         }
//                                         else
//                                         {
//                                             dB.query("UPDATE courses SET followers=? WHERE id=?",[JSON.stringify(followers),req.params.userToFollowId],(error)=>{
//                                                 if(error)
//                                                 {
//                                                     res.json({success:false})
//                                                 }
//                                                 else
//                                                 {
//                                                     res.json({success:true})
//                                                 }
//                                             })
//                                         }
//                                     })
                                    

//                                 }
//                             }
//                         }
//                     })
//                 }
//             })
//         }
//     })
// }
let getUser=(req,res)=>{
    dB.connect((error)=>{
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
                    res.json({success:true,user:results[0]})
                }
            })
        }
    })
}
 module.exports={register,login,update,getProfile,getUser}