const { validate } = require('../model/post.create');
const {isEmail,isEmpty} =require("validator");
const postCollection = require('../model/post.create');
const userPhoto = require("../model/profilepic.create");
const jwt = require("jsonwebtoken");

const handleError = (err)=>{
    let errorMsg = {userId:"",postBody:""}
    if(err.message.includes("blogPost validation failed")){
        Object.values(err.errors).forEach(({properties})=>{
           errorMsg[properties.path]=properties.message; 
        });
        return errorMsg;
    }
}
const checkuserId =(userId)=>{
    const user_id = jwt.verify(userId,process.env.SECRET_KEY);
    return user_id;
}
const createPost = async (request,response)=>
{
    try{
        let {userId,postBody,Studentclass,address,salary}=request.body;
        const user_id =checkuserId(userId);
        let profileAvatar;
        let userProfilePic = await userPhoto.findOne({userId:user_id.id});
        if(userProfilePic=== null){
            profileAvatar= ""
        }else{
            profileAvatar=userProfilePic.avatar
        }
        let post = await new postCollection({
            userId:user_id.id,
            postBody,
            Studentclass,
            address,
            salary,
            avatar:profileAvatar
        });
        let savedPost = await post.save();
        response.json({message:"post saved successfully"});
    }catch(err){
        const errorMessage = handleError(err);
        response.json(errorMessage)
    }
}
//show post for user
const showPost = async (request,response)=>
{
    try{
        const {page}=request.body;
        const pagenumber =parseInt(page);
        const perpage = 4;
        const startIndex = (pagenumber-1)*perpage;
        // const endIndex = page*perpager;
        // let post = await postCollection.find().limit(limit).skip(startIndex).sort({date:"desc"}).exec();
        let aggregate = postCollection.aggregate();
        let post = await aggregate.lookup({
             from:"uerdetails",
             localField:"userId",
             foreignField:"userId",
             as:"userDetails"
        }).sort({date:"desc"}).skip(startIndex).limit(perpage);
            response.status(200).json({post});        
    }catch(err){
      console.log(err)
      response.status(400).json({status:400,message:"post not found."});
    }

}
//single post for user profile
const postByUserId = async (request,response) =>
{
    try{
        const {userId}=request.body;
        const user_id =checkuserId(userId)
        let post = await postCollection.find({userId:user_id.id}).sort({date:"desc"});
        if(post.length===0){
            response.status(400).json({message:'post not found'});
            return;
        }else{
            response.status(200).json({post:post});
            return;
        }
    }catch(err){
     response.status(500).json({message:"server problem"});
    }
}
//update post 
const updatePost = async (request,response)=>{
    try{
       const {postId,userId,postBody,Studentclass,address,salary}=request.body;
    //    console.log(userId);
        if(isEmpty(postId)){
            response.json({postId:"post Id not found"});
        }else if(isEmpty(postBody)){
           response.json({postBody:"post is empty"})
        }else if(isEmpty(Studentclass)){
            response.json({Studentclass:"class is empty"})
        }else if(isEmpty(address)){
            response.json({address:"address is empty"})
        }else if(isEmpty(salary)){
            response.json({salary:"salary is empty"})
        }else{
        const user_id =checkuserId(userId);
        let profileAvatar;
        let userProfilePic = await userPhoto.findOne({userId:user_id.id});
        if(userProfilePic=== null){
            profileAvatar= ""
        }else{
            profileAvatar=userProfilePic.avatar
        }
            let saveEditPost = await postCollection.findByIdAndUpdate(postId,{
                $set:{
                 postBody,
                 Studentclass,
                 address,
                 salary,
                 avatar:profileAvatar
                }
            })
            response.status(200).json({message:"post updated successfully"})
        }

   }catch(err){
    const errorMessage = handleError(err);
    response.json(errorMessage)
   }
}
const deletePost = async (request,response)=>{
const {postDeleteId}=request.body;
try{
    let deleteResponse = await postCollection.findByIdAndDelete(postDeleteId);
    if(deleteResponse){
        response.json({message:"post deleted..."});
    }
}catch(error){
  response.json({message:"post not found"})
}
}

//multiple field search
const search = async (req,res)=>{
    try{
        const {searchValue} = req.body;
        let finalSearchValue =searchValue.trim(); 
        let regex = new RegExp(finalSearchValue,'i');
        // let searchresponse = await postCollection.find({$or:[{postBody:regex},{Studentclass: regex},{address:regex}]});
        let aggregate = postCollection.aggregate();
        let searchresponse = await aggregate.lookup({
                 from:"uerdetails",
                 localField:"userId",
                 foreignField:"userId",
                 as:"userDetails"
            }).match({$or:[{postBody:regex},{Studentclass: regex},{address:regex}]});

            let postLen = searchresponse.length;
            if(postLen === 0){
                res.json({message:"No post found"})
            }else{
                res.json({post:searchresponse});
            }

    }catch(err){
     console.log(err)
     res.json({message:"server problem"})
    }

}
//check updateMany() method
const update_many = async (request,response)=>{
    const {userId} = request.body;
    const user_id =checkuserId(userId)
    let upM = await postCollection.updateMany({userId:user_id.id},
        {
           Studentclass:"Updated class" 
        });
        response.json(upM)
}

module.exports ={createPost,showPost,postByUserId,updatePost,deletePost,update_many,search,checkuserId};