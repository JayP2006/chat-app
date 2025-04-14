const express=require("express");
const dotenv=require("dotenv");
const dbconnect = require("./db/dbconnect");
const usercontrol=require("./routes/authUser")
const messageroute=require("./routes/messageroute");
const userRouter=require("./routes/userRoute")
const cookieParser = require("cookie-parser");
const cors = require('cors');
const path=require('path')
const {app,server}=require("./Socket/socket")

dotenv.config();
app.use(express.json()); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors({
  origin: ["https://chat-karo-rg16.onrender.com"], // ✅ your actual deployed frontend
  credentials: true,
}));


app.get("/",(req,res)=>{
    res.send('hello');
})
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
const port=process.env.PORT;
app.use("/api/auth",usercontrol)
app.use("/api/message",messageroute)
app.use("/api/user",userRouter)

server.listen(port,()=>{
    dbconnect();
    console.log(port);
})