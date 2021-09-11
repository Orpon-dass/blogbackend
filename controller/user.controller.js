const userTb = require("../model/user.create");
const postCollection = require('../model/post.create');
const userPhoto = require("../model/profilepic.create");
const bcrypt =require("bcrypt");
const jwt = require("jsonwebtoken");
const {isEmail,isEmpty} =require("validator");
const userDetails = require("../model/user.details");
const fs = require("fs");
exports.createUser = async (request,response)=>{
  let {name,email,password} =request.body;
  //let validate form field
  const handleError = (err)=>{
       let errorMsg ={name:"",email:"",password:""}
       //check duplicate email
       if(err.code===11000){
         errorMsg.email="user already in database";
         return errorMsg;
       }
       //validate form field
       if(err.message.includes('blogUser validation failed')){
         Object.values(err.errors).forEach(({properties})=>{
            errorMsg[properties.path] =properties.message;
         });
         return errorMsg;
       }
  }
  try{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt); 
    const user = new userTb({
      name,
      email,
      password:hashedPassword
    });
    let userdata = await user.save(user);
    let token = jwt.sign({id:userdata._id},process.env.SECRET_KEY)
     response.header("auth-token",token).json({token:token});
  }catch(error){
    const errormessage = handleError(error);
    response.json({errormessage});
  }
}

// find single user
exports.findbyemail =(request,response)=>{
    userTb.findOne({email:"sample@gmail.com"})
    .then((data)=>{
        response.send(data);
    })
    .catch((err)=>{
        response.send({Message:err.message || "user not found"});
    })
}

//let log in user
exports.login = async (request,response)=>{
       const {email,password}=request.body;
        
      try{
        if(isEmpty(email)){
          response.json({message:"field can not be empty"});
          return;
        }else if(!isEmail(email)){
         response.json({message:"enter a valid email"});
         return;
        }else if(isEmpty(password)){
         response.json({message:"field can not be empty"});
         return;
        }else{
          const user = await userTb.findOne({email:email});
          if(user!==null){
            let validPassword = await bcrypt.compare(password,user.password);
            if(validPassword){
              let token = jwt.sign({id:user._id},process.env.SECRET_KEY);
              response.header("auth-token",token).json({"token":token});
            }else{
            response.json({message:"email or password is invalid"});
            }
          }else{
            response.json({message:"email or password is invalid"});
          }
        }
         
      }catch(err){
          response.status(500).json({message:"server is not responding",err:err.message});
      }
}

//save user details
exports.userdetailsRoute = async (request,response)=>{
  handleUserDetails =(err)=>{
    let errorMsg ={}   
    //validate form field
    if(err.message.includes('uerDetails validation failed')){
      Object.values(err.errors).forEach(({properties})=>{
         errorMsg[properties.path] =properties.message;
      });
      return errorMsg;
    }
  }
  try{
    const {userId,yourName,universityName,collegeName,permanentAddress,presentAddress,phoneNumber}=request.body;
    const user_id = await jwt.verify(userId,process.env.SECRET_KEY);
    const details = new userDetails({userId:user_id.id,username:yourName,universityName,collegeName,permanentAddress,presentAddress,phoneNumber});
    const savedResponse = await details.save(); 
    response.json({userDetails:savedResponse,message:"user details saved"});

  }catch(error){
    const detailsError = handleUserDetails(error);
    response.json(detailsError);
  }
}
// update user details
exports.updateUserDetails = async (request,response)=>{
  try{
    const {userId,yourName,universityName,collegeName,permanentAddress,presentAddress,phoneNumber}=request.body;
     if(isEmpty(yourName)){
       response.json({message:"name is required"})
     }else if(isEmpty(userId)){
       response.json({message:"user not registered"});
     }else if(isEmpty(collegeName)){
      response.json({collegeName:"college name is required"});
     }else if(isEmpty(permanentAddress)){
       response.json({permanentAddress:"permanent address isrequired"});
     }else if(isEmpty(presentAddress)){
       response.json({presentAddress:"present address is required"});
     }else if(isEmpty(phoneNumber)){
       response.json({phoneNumber:"phone number is required"});
     }else{
       let user_id = jwt.verify(userId,process.env.SECRET_KEY);
       let id =user_id.id;
       let userDetailsUpdate = await userDetails.findOneAndUpdate(
        {userId:id},
         {$set:{
          userId:id,
          username:yourName,
          universityName:universityName,
          collegeName:collegeName,
          permanentAddress:permanentAddress,
          presentAddress:presentAddress,
          phoneNumber:phoneNumber}
          },
         {useFindAndModify:false,
          new:true
        }
         )
         if(userDetailsUpdate===null){
          response.status(400).json({message:"user details not updated",id});
         }else{
           response.status(200).json({userDetails:userDetailsUpdate,message:"your information updated succfully"});
         } 
     }
  }catch(error){
   response.status(500).json({error,message:"server is not responding"})
  }
}

//show user details
exports.userDetails = async (request,response)=>{
  try{
    const {userId} =request.body;
    const verified = jwt.verify(userId,process.env.SECRET_KEY);
   let showUserDetails = await userDetails.findOne({userId:verified.id});
   if(showUserDetails===null){
     response.status(400).json({message:"user details not found",status:"400"});
    }else{
     response.status(200).json({userDetails:showUserDetails});
   }
  }catch(error){
    response.status(500).json({message:"server not responding",status:"500"});
  }
}
//profile photo upload
exports.profilePhotoUpload= async (request,response)=>{
   try{
     const {userId} = request.body;
     const user_Id = jwt.verify(userId,process.env.SECRET_KEY);
     let profilePicName;
     let uploadPath;
     if (!request.files || Object.keys(request.files).length === 0) {
      return response.status(400).json({message:'No photo were selected.'});
     }
     let originalFile =request.files.photo;
     profilePicName =new Date().getTime() + '-'+ originalFile.name;
     uploadPath ="public/image/"+ profilePicName;

     originalFile.mv(uploadPath,function(err){
        if(err){
          return response.json({message:uploadPath})
        }
     });
     if(originalFile){
      let deleteuserPhoto = await userDetails.findOne({userId:user_Id.id});
      console.log(deleteuserPhoto.avatar!=="")
       if(deleteuserPhoto.avatar){
         fs.unlink(__dirname +"./../public/image/"+ deleteuserPhoto.avatar,function(err){
          console.log(`file delete problem is:${err}`)
          if(err){
            return response.json({message:"photo not deleted"})
          } 
         });
       }

      let savePhoto = await userDetails.findOneAndUpdate({userId:user_Id.id},{
       userId:user_Id.id,
       avatar:profilePicName
     },
     {
       new: true,
       upsert: true
     });
       response.status(200).json({message:"Profile photo uploaded."})
     }
   }catch(error){
    response.status(500).json({message:"file not uploded"})
   }

}
//select user profile photo
exports.user_profile_photo = async (request,response)=>{
  try{
  const {userId} = request.body;
  const user_Id = jwt.verify(userId,process.env.SECRET_KEY);
  let photo = await userPhoto.findOne({userId:user_Id.id}).exec();
  if(photo===null){
    response.status(400).json({message:"upload profile picture"})
  }else{
    response.status(200).json(photo);
  }
  }catch(err){
    response.status(500).json({message:"server is not responding."})
  }
}
// fetch user for message
exports.Find_user = async (request,response)=>{
  try{
    const {friendId} =request.body;
    const user = await userDetails.findOne({
    userId:friendId
   });
   response.status(200).json(user)
  }catch(err){
    console.log(err)
   response.status(500).json({message:"server problem ,user can not find"})
  }

}
//check validate route 
exports.valid = (req,res)=>{
  const token=req.cookies.admintoken;
 res.send(token);
  
}