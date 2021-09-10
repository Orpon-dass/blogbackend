const {Schema, model} = require('mongoose');

const {isEmail} = require("validator");
let adminSchema = new Schema({
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
const adminModel = model("admin",adminSchema);
module.exports = adminModel;