const Conversation = require("../Models/conversationModels");
const Message = require("../Models/messageSchema");
const { getreceiverid ,io} = require("../Socket/socket");

module.exports.sendmessage=async(req,res)=>{
    try {
        const {message}=req.body;
        const receiverid=req.query.rid;
        const senderid = req.query.user;
        let chats=await Conversation.findOne({
            participants:{
                $all:[senderid,receiverid]
            }
        })
        if(!chats){
            chats= await Conversation.create({
                participants:[senderid,receiverid]
            })
        }
        const newMessages=await new Message({
            senderid,
            receiverid,
            message,
            conversationid:chats._id


        })
        if(newMessages){
            await chats.messages.push(newMessages._id)
        }
        await Promise.all([chats.save(),newMessages.save()])


        const receiversocketid=getreceiverid(receiverid);
        if(receiversocketid){
            io.to(receiversocketid).emit("newMessage",newMessages)
        }
        res.status(201).send(newMessages)
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.message
        })
        console.log(error);
    }
}

module.exports.getmessages=async(req,res)=>{
    try {
        const {id:receiverid}=req.params;
        const senderid = req.query.user;

        const chats= await Conversation.findOne({
            participants:{$all:[senderid,receiverid]}
        }).populate("messages")
        console.log(`chat is:${chats}`)

        if(!chats) return res.status(200).send([]);
        // const message=chats.messages;
        res.status(200).send(chats)
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.message
        })
        console.log(error);
    }
}