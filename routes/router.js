const express =require("express");
const render = require("../render/render");
const userController = require("../controller/user.controller");
const postController = require('../controller/posts.controller')
const validation = require("../validateRoute/valid.route.js");
const chatController = require("../controller/ChatController");
const adminController = require("../controller/admin.controller")
const route =express.Router();
route.get('/',render.homeRoute);
//user routing
route.post('/api/createuser',userController.createUser);
route.get('/api/userfind',userController.findbyemail);
route.post('/api/loginuser',userController.login);
route.post('/api/userdetails',userController.userdetailsRoute);
route.post('/api/updateusdetails',userController.updateUserDetails);
route.post('/api/showuserdetils',userController.userDetails);
route.post('/api/profilepicupload',userController.profilePhotoUpload);
route.post('/api/avatar',userController.user_profile_photo);
route.post('/api/userfindformessage',userController.Find_user);
//post routing
route.post('/api/createpost',postController.createPost);
route.post('/api/showallpost',postController.showPost);
route.post("/api/usersinglepost",postController.postByUserId);
route.post("/api/updatepost",postController.updatePost);
route.post('/api/deleteuserpost',postController.deletePost);
route.post('/api/searchpost',postController.search);

//chat rute
route.post("/api/messagesave",chatController.saveMsg);
route.post("/api/messageshow",chatController.fetchMessage);
route.post("/api/chatMessage",chatController.chatMessage);
//admin route 
route.post("/api/admin/login",adminController.adminlogin);
route.get("/api/admin/register",adminController.adminRegister);
route.get('/api/admin/login',adminController.loginpage);
route.get('/api/admin/home',validation,adminController.homepage);
route.get('/api/admin/logout',adminController.adminLogout);
route.get('/api/admin/singlepost/:id',validation,adminController.singlePost);
route.get('/api/admin/singleuser/:id',validation,adminController.singleUser);
route.get('/api/admin/deletepost/:id',validation,adminController.deletepost);
//route for test
route.get('/api/validroute',validation,userController.valid);
module.exports =route;