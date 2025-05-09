const mongoose=require('mongoose')
const messageSchema=mongoose.Schema({
    senderid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiverid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    message:{
        type:String,
        required:true
    },
    conversationid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conversation',
        default:[]
    },createdAt: { type: Date, default: Date.now }
},{timestamp:true})

const Message=mongoose.model('Message',messageSchema)
module.exports=Message