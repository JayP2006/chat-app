const Conversation = require("../Models/conversationModels");
const User =require("../Models/userModels")
module.exports.getUserBySearch = async (req, res) => {
    try {
        const search = req.query.search || '';
        console.log('Search query:', search); // Log search input
        const currentUserId = req.user?._id;

        const user = await User.find({
            $and: [
                {
                    $or: [
                        { username: { $regex: '.*' + search + '.*', $options: 'i' } },
                        { fullname: { $regex: '.*' + search + '.*', $options: 'i' } }
                    ]
                },
                { _id: { $ne: currentUserId } }
            ]
        }).select("-password").select("email");

        console.log('Users found:', user); // Log users found

        res.status(200).send(user);
    } catch (error) {
        console.log('Error in getUserBySearch:', error.message);
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};


module.exports.getCurrentChatters=async(req,res)=>{
    try {
        const currentuserid=req.query.currentchatters ; 
        console.log(currentuserid)  
        const currentChatters=await Conversation.find({
            participants:currentuserid  
        }).sort({
            updatedAt:-1
        })   
        if(!currentChatters || currentChatters.length === 0) return res.status(200).send([]);

        const participantsId=currentChatters.reduce((ids,conversation)=>{
            const otherParticipants=conversation.participants.filter(ids => ids.toString() !== currentuserid.toString());
            return [...ids,...otherParticipants];

        }, [])
        // const otherparticipantsIDs=participantsId.filter(id => id.toString() !== currentuserid.toString())
        const user=await User.find({_id:participantsId}).select("-password").select("-email")   
        // const users=otherparticipantsIDs.map(id =>user.find(user => user._id.toString()===id.toString()));
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.message
        })
        console.log(error);
    }
}