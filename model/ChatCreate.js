const {Schema,model} = require("mongoose");
const ChatSchema = new Schema({
     messageBody:{
         type:String
     },
     receiverId:{
         type:String
     },
     senderId:{
         type:String
     },
     messagetime: {
          type:Date,
          default:Date.now()
     }
});
const chat = model("chat",ChatSchema);
module.exports = chat;
