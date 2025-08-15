const mongoose=require("mongoose")

const userSchema = new mongoose.Schema({
      fullname: { type: String, required: true },
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: false },
      gender: { type: String, required: true,enum: ['male', 'female'] },
      profilepic:{type:String,require:true,default:""},
      createdAt: { type: Date, default: Date.now }
  });

  const User=mongoose.model("User",userSchema)
  module.exports=User