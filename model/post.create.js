const {Schema, model} = require('mongoose');
let postSchema = new Schema({
    userId:{
        type:String,
        required:[true,"user token is required"],
    },
    postBody:{
        type:String,
        required:[true,"post field is rquired"]
    },
    Studentclass:{
        type:String,
        required:[true,"class field is rquired"]  
    },
    address:{
        type:String,
        required:[true,"address field is rquired"]
    },
    salary:{
        type:String,
        required:[true,"salary field is rquired"]
    },
    action:{
        type:String,
        default:"false"
    },
    date: { type: Date, default: Date.now }
});
const posts = model("blogPost",postSchema);
module.exports =posts;