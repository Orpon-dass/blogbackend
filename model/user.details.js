const {Schema,model} = require("mongoose");
let userDetailsSchema = new Schema({
      userId:{
         type:String,
         required:[true,"user id is required"]
      },
      avatar:{
          type:String,
          default:""
      },
      username:{
        type:String,
        required:[true,"name is required"]
      },
      universityName:{
       type:String
      },
      collegeName:{
          type:String,
          required:[true,"college is required"]
      },
      permanentAddress:{
          type:String,
          required:[true,"permanent address is required"]
      },
      presentAddress:{
          type:String,
          required:[true,"present address is required"]
      },
      phoneNumber:{
          type:String,
          required:[true,"phone number is required"]
      }

});
const userDetails =model("uerDetails",userDetailsSchema);
module.exports =userDetails;
