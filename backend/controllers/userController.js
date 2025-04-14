const User =require("../Models/userModels")
const bcrypt=require("bcrypt");
const jwttoken = require("../utils/jwtwebtoken");

module.exports.userRegister=async (req,res)=>{
    try {
        const {fullname,username,email,password,gender,profilepic}=req.body;
        const user=await User.findOne({username,email});
        if(user) return res.status(500).send({success:false,message:"Username or Email alredy Exist"})
            const hashpass=bcrypt.hashSync(password,10)
            const profileboy=profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
            const profilegirl=profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
            const profilepi = gender === "male" ? profileboy : profilegirl;
            const newUser=new User({
                fullname,
                username,
                email,
                password:hashpass,
                gender,
                profilepic:profilepi
            })
            if(newUser){
                await newUser.save();
                jwttoken(newUser._id,res)

            }else{
                res.status(500).send({success:false,message:"invalid user data"})
            }
            res.status(201).send({
                _id:newUser._id,
                fullname:newUser.fullname,
                username:newUser.username,
                profilepic:newUser.profilepic,
                email:newUser.email,
                message:"account created successfully"
            })

    } catch (error) {
        res.status(500).send({success:false,message: error.message})
        
    }
}

module.exports.userLogin=async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email})
        if(!user) return res.status(500).send({success:false,message:"User doesn't exist "});
        const compare=bcrypt.compareSync(password,user.password || "")
        if(!compare) return res.status(500).send({success:false,message:"password doesnt match"});
        jwttoken(user._id,res)
        res.status(200).send({
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            profilepic:user.profilepic,
            email:user.email,
            gender:user.gender,
            createdAt:user.createdAt,
            message:"successfuly login"
        })
        
    } catch (error) {
        res.status(500).send({success:false,message: error.message})
    }
}
module.exports.userLogout = async(req,res)=>{
    try {
        res.cookie("jwt",'',{
            maxAge:0
        })
        res.status(200).send({message:"user logout"})
    } catch (error) {
        res.status(500).send({success:false,message: error.message})
    }
}


