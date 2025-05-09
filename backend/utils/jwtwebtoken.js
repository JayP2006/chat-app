const jwt = require("jsonwebtoken")
const jwttoken=(userid,res)=>{
    const token = jwt.sign({userid},process.env.JWT_SECRET,{
        expiresIn:"30d"
    })
    res.cookie('jwt',token,{
        maxAge:30 *24 *60 *60 *1000,
        httpOnly:true,
        sameSite:"lax",
        secure:true
    })
}
module.exports=jwttoken