const mongoose=require("mongoose")

const dbconnect=async ()=>{
    mongoose.connect("mongodb://localhost:27017/chat-app", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('MongoDB Connected'))
      .catch(err => console.log(err));
}

module.exports = dbconnect;