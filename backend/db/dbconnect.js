const mongoose=require("mongoose")

const dbconnect=async ()=>{
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('MongoDB Connected'))
      .catch(err => console.log(err));
}

module.exports = dbconnect;