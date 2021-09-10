const jwt = require("jsonwebtoken");
const validation =(request,response,next)=>{
      const token = request.cookies.admintoken;
      if(!token) return response.status(401).json({message:"Access denied.."});
      try{
          const verified = jwt.verify(token,process.env.SECRET_KEY);
          request.user = verified;
          request.head = token;
          next();
      }catch{
          response.status.send("Invalid token.")
      }
}
module.exports =validation;