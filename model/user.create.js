const mongoose =require("mongoose");
const {isEmail} =require("validator");
let schema = new mongoose.Schema({
      email:{
          type:String,
          required:[true,"email is required"],
          unique:true,
          validate:[isEmail,"enter a valid email"]
      },
      password:{
            type:String,
            required:[true,"password is required"],
            minlength:[6,"minimum password length is 6 characters"]
      },
});
const user = mongoose.model("blogUser",schema);
module.exports =user;