const Chat = require("../model/ChatCreate");
const jwt = require("jsonwebtoken");
const  userCheck = require("./posts.controller")
//getting user id
const checkuserId =(userId)=>{
    const user_id = jwt.verify(userId,process.env.SECRET_KEY);
    return user_id;
}
//save message in database
const saveMsg = async (request,response)=>{
    try{
        const {receiverId,FriendIdForChatId,chatMessage} =request.body;
        const user_id = checkuserId(receiverId);
        const chat = new Chat({
            receiverId:FriendIdForChatId,
            senderId:user_id.id,
            messageBody:chatMessage
        });
        const saveChat = await chat.save();
        if(saveChat){
            response.status(200).json({message:"message save "})
        }
    }catch(error){
      response.status(500).json({message:"internal problem"})
    }
}
//select message
const fetchMessage = async (request,response)=>{
    try{
        const {userId} = request.body;
        const user_id = userCheck.checkuserId(userId)
        const message = await Chat.find({$or:[{receiverId:user_id.id},{senderid:user_id.id}]});
        if(message){
            response.status(200).json(message);
        }  
    }catch(error){
        response.status(500).json({message:"server problem",error})
    }
}
const chatMessage = async (request,response) =>{
    try{
        const {userId,FriendIdForChatId} = request.body;
        let user_id =checkuserId(userId);
        let message = await Chat.find({$or:[{receiverId:user_id.id,senderId:FriendIdForChatId},{receiverId:FriendIdForChatId,senderId:user_id.id}]});
        response.status(200).json({chat:message})
    }catch(error){
      response.status.json({message:"server problem"})
    }
}
module.exports ={saveMsg,fetchMessage,chatMessage}