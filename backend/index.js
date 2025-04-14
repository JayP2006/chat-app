const express=require("express");
const dotenv=require("dotenv");
const dbconnect = require("./db/dbconnect");
const usercontrol=require("./routes/authUser")
const messageroute=require("./routes/messageroute");
const userRouter=require("./routes/userRoute")
const cookieParser = require("cookie-parser");
const cors = require('cors');
const {app,server}=require("./Socket/socket")

dotenv.config();
app.use(express.json()); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/",(req,res)=>{
    res.send('hello');
})
const port=process.env.PORT;
app.use("/api/auth",usercontrol)
app.use("/api/message",messageroute)
app.use("/api/user",userRouter)
server.listen(port,()=>{
    dbconnect();
    console.log(port);
})