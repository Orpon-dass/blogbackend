const adminmodel =  require("../model/admin.model");
const bcrypt =require("bcrypt");
const {isEmail,isEmpty} =require("validator");
const postCollection = require('../model/post.create');
const jwt = require("jsonwebtoken");
const userDetails = require("../model/user.details");


exports.adminRegister = async (req,res)=>{
    try{
        let password = "hellow123";
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const adminLogin= new adminmodel({
          email:"orponchandro@gmail.com",
          password:hashedPassword,
        });
        let admindata = await adminLogin.save();
        res.status(200).json({message:"registration successful"});
       // let token = jwt.sign({id:userdata._id},process.env.SECRET_KEY)
        //response.header("auth-token",token).json({token:token});
    }catch(err){
       res.status(500).json({message:"server problem"});
       console.log(err)
    }
}

//admin login code goes here
exports.adminlogin = async (request,response)=>{
    const {email,password}=request.body;
   try{
     if(isEmpty(email)){
       response.json({message:"Field can not be empty"});
       return;
     }else if(!isEmail(email)){
      response.json({message:"Enter a valid email"});
      return;
     }else if(isEmpty(password)){
      response.json({message:"Field can not be empty"});
      return;
     }else{
       const user = await adminmodel.findOne({email:email});
       if(user!==null){
         let validPassword = await bcrypt.compare(password,user.password);
         if(validPassword){
           let token = jwt.sign({id:user._id},process.env.SECRET_KEY);
          //  response.header("admintoken",token).redirect("/api/admin/home");
          //set cookie for admin
          const cookie_time=60*60*24*7*1000;
          response.cookie("admintoken",token,{ maxAge: cookie_time }).redirect("/api/admin/home");
         }else{
         response.json({message:"email or password is invalid"});
         }
       }else{
         response.json({message:"email or password is invalid"});
       }
     }
      
   }catch(err){
       response.status(500).json({message:"server is not responding",err:err.message});
       console.log(err)
   }
}
// home page 
exports.loginpage= (request,response)=>{
  response.render("Form");
}
//logout page 
exports.adminLogout = (request,response)=>{
  response.clearCookie("admintoken").redirect("/api/admin/login");

}
// home page 
exports.homepage =async (request,response)=>{
  const allpost = await postCollection.find().sort({date:"desc"});
  response.status(201).render("index",{post:allpost});
}
//single post 
exports.singlePost= async (request,response)=>{
  try{
    const id = request.params.id;
    const singlePost = await postCollection.findById(id);
    response.render("Singlepost",{singlepost:singlePost})
  }catch(err){
   console.log(err)
  }
}
//single user 
exports.singleUser= async (request, response)=>{
  try{
    const id =  request.params.id;
    const single_User = await userDetails.findOne({userId:id});
    response.render("Singleuser",{user:single_User})
  }catch(err){
    console.log(err);
  }
}
//delete post 
exports.deletepost = async (request,response)=>{
  try{
    const message = "post deleted";
    const id = request.params.id;
    const delPost= await postCollection.findByIdAndDelete(id);
    response.redirect('/api/admin/home');
  }catch(err){
    console.log(err)
  }
}