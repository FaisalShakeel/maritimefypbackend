const mysql=require('mysql2')
const fs= require('fs')
let dB=mysql.createConnection({host:"maritimesystem.mysql.database.azure.com",user:"Maritime",password:"_Fs1234567",database:"maritime",port:3306,ssl:{ca:fs.readFileSync('DigiCertGlobalRootCA.crt.pem')}})
dB.connect((error)=>{
    if(error)
    {
        console.log("There was an error while connecting to the database")
    }
    else
    {
        
        console.log("Successfully Connected!")
   
    }
})
module.exports={dB}
