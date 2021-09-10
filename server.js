const express =require("express");
const dotenv =require("dotenv");
const route =require("./routes/router");
const dbConnection = require("./database/db.connection");
const bodyparser =require('body-parser');
const fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser')
const path = require("path");

const app = express();
//set view engine
app.set("view engine","ejs");
//app.set("views",path.resolve(__dirname,"views/ejs"));


//socet.io server
const httpServer = require("http").createServer(app)
const io = require("socket.io")(httpServer,{
    cors:{
        origin:"http://localhost:3000",  
    }
});

let users=[]
//add user and socket id
const adduser = (userid,socketid)=>{
   let checkuser = users.some((arg)=>arg.userid===userid)
   if(!checkuser){
       users.push({userid,socketid})
   }
}

//remove user from user array
const removeuser = (socketid)=>{
 users = users.filter((user)=>user.socketid !==socketid)
}
//found private chat user
const foundUser=(userid)=>{
   return users.find((user)=>user.userid===userid);
   console.log(userid)
}

//socket connection 
io.on("connection", socket => { 
    //console.log(`user socket id is :${socket.id}`)
    
    socket.on("addUserId",(id)=>{
        adduser(id,socket.id);
        io.emit("socketid",users);
    });
    
    //user chat message
    socket.on("messagedetails",(arg)=>{
        let friendId = foundUser(arg.receiverId);
        if(friendId){
            io.to(friendId.socketid).emit("socketMessage",arg);
        }
    });
    //user disconnect
    socket.on("disconnect",()=>{
        removeuser(socket.id)
        io.emit("socketid",users);
        console.log("a user disconnected..")
    })

 });
 

//use dot env for env variabel
dotenv.config();
const port = process.env.PORT ||5000;

//parse body parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

//use express file upload
app.use(fileUpload());

//make public folder for client
app.use(express.static("public"));

//cors using for multiple client site request
var cors = require('cors');
app.use(cors({
    origin:"*",
}));

//connection of mongo db 
dbConnection();
app.use(cookieParser());
app.use('/',route);

// start app
httpServer.listen(port,()=>{
 console.log(`server is start on http://localhost:${port}`)
});