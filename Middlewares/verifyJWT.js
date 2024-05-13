const jwt=require('jsonwebtoken')
const{SECRET_KEY}=require('../jwt_secret')
let verifyJWT=(req,res,next)=>{
    let token=req.params.token
    jwt.verify(token,SECRET_KEY,(error)=>{
        if(error)
        {
            res.json({success:false,accessDenied:true})
        }
        else
        {
            next()
        }
    })
}
module.exports={verifyJWT}