const express=require('express')
const jwt=require('jsonwebtoken')
const user=require('../Models/userModels');
const User = require('../Models/userModels');

const isLogin=async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        console.log(token)
        if(!token) return res.status(500).send({success:false,message:"user unauthorized"})
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        if(!decode) return res.status(500).send({success:false,message:"user unauthorized-invalid token"})
        const user=await User.findById(decode.userid).select('-password');
        if(!user) return res.status(500).send({success:false,message:"user not found"})
        req.user=user;
        next()

    } catch (error) {
        console.log(`error in isLogin middleware ${error.message}`);
        return res.status(500).send({success:false,message:error.message})
    }
}
module.exports=isLogin