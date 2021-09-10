const {Schema,model} =require("mongoose");
const userPhoto = new Schema({
    userId:{
        type:String,
        required:[true,"user id is required"]
    },
    avatar:{
        type:String,
        required:[true,"photo is required.."]
    }
});
const profilePhoto = model("userPhoto",userPhoto);
module.exports = profilePhoto;