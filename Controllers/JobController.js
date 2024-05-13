const {dB}=require('../databaseconnection')
let getJobs =(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
            console.log("There was an error while connecting to the database")
        }
        else
        {
            
        
          
            dB.query(`SELECT* FROM jobs`,(error,results)=>{
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    console.log("Getting Jobs")
                    res.json({success:true,jobs:results})
                }
            })
        }
        
      
    })
}
let getJob =(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
            console.log("There was an error while connecting to the database")
        }
        else
        {
           
            console.log(req.params.Id)
            dB.query(`SELECT*FROM jobs WHERE id=?`,[req.params.Id],(error,results)=>{
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    console.log(results)
                    console.log("Getting Job")
                    res.json({success:true,job:results[0]})
                }
            })
        }
      
    })
}

let addJob=(req,res)=>{
    console.log()
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
            console.log("There was an error while connecting to the database")
        }
        else
        {
             let _applicants = []
            //  dB.query("ALTER TABLE jobs ADD COLUMN id",(error)=>{
            //      if(!error)
            //      {
            //          console.log("Removed Column")
            //      }
            //  })
            dB.query("SELECT*FROM users WHERE id=?",[req.params.UID],(error,results)=>{
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    dB.query("ALTER TABLE jobs ADD COLUMN salary INTEGER",(error)=>{
                        if(!error)
                        {
                            console.log("salary column added")
                           
                        }
                    })
                    let User=results[0]
                    console.log(req.body)
                    dB.query("DESCRIBE jobs",(error,results)=>{
                        if(!error)
                            {
                                console.log(results)
                            }
                    })
                    dB.query(`INSERT INTO jobs (id,title,description,salary,contractType,location,requirements,responsibilities, perksAndBenefits,postedON,category,companyLogoUrl,companyName,companyBio,uploadedByName,uploadedById,uploadedByPhoto,applicants) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[req.body.title.slice(0,7)+Math.random().toString().slice(0,7),req.body.title,req.body.description,Number(req.body.salary),req.body.contractType,req.body.location,req.body.requirements,req.body.responsibilities,req.body.perksAndBenefits, req.body.postedON,req.body.category,req.body.companyLogoUrl,req.body.companyName,req.body.aboutCompany,User.name,User.id,User.profilePhotoUrl,JSON.stringify([])],(error,results)=>{
                        if(error)
                        {
                            console.log("Cannot Add Job")
                            res.json({success:false})
                        }
                        else
                        {
                            console.log("Job added")
                            res.json({success:true})
                        }
                    })

                }
            })
          
           
        }
      
    }) 
} 
let deleteJob=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
            console.log("There was an error while connecting to the database")
        }
        else
        {
            dB.query(`DELETE FROM jobs WHERE id=?`,[req.params.Id],(error,results)=>{
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
let apply=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})

        }
        else
        {
            console.log(req.params.UID)
            console.log(req.params.jobId)
            dB.query("SELECT*FROM jobs WHERE id=?",[req.params.jobId],(error,allJobs)=>{
                if(error)
                {
                    res.json({success:false})
                }
                else
                {
                    console.log(allJobs)
                    let Job =allJobs[0]
                    console.log(Job)
                    dB.query("SELECT*FROM users WHERE id=?",[req.params.UID],(error,allUsers)=>{
                        if(error)
                        {
                            res.json({success:false})
                        }
                        else
                        {
                            let user=allUsers[0]
                            let applicants=Job.applicants
                            let hasApplied=false
                            console.log("Applying")
                            console.log(applicants)
                            for(let applicant of applicants)
                            {
                                if(applicant.ID==req.params.UID)
                                {
                                    hasApplied=true
                                }
                            }
                            console.log(hasApplied)
                            if(hasApplied)
                            {
                                res.json({success:false,hasApplied})
                            }
                            else
                            {
                                let _applicants=applicants.concat({ID:user.id,name:user.name,profilePhotoUrl:user.profilePhotoUrl,resumeUrl:req.body.resumeUrl})
                                dB.query("UPDATE jobs SET applicants=? WHERE id=?",[JSON.stringify(_applicants),req.params.jobId],(error)=>{
                                    if(error)
                                    {
                                        res.json({success:false})
                                    }
                                    else
                                    {
                                        console.log("Applied")
                                        res.json({success:true})
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    })
}
let editJob=(req,res)=>{
    dB.connect((error)=>{
        if(error)
        {
            res.json({success:false})
        }
        else
        {
            dB.query("UPDATE jobs SET title=?,description=?,location=?,salary=?,companyLogoUrl=?,requirements=?,perksAndBenefits=?,contractType=?,responsibilities=?,companyName=?,companyBio=?,category=? WHERE id=?",[req.body.title,req.body.description,req.body.location,req.body.salary,req.body.companyLogoUrl,req.body.requirements,req.body.perksAndBenefits,req.body.contractType, req.body.responsibilities,req.body.companyName,req.body.companyBio,req.body.category ,req.params.jobId],(error)=>{
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
module.exports={getJobs,addJob,deleteJob,getJob,apply,editJob}



