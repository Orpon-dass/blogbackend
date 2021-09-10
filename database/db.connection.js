const mongoose =require("mongoose");
//create connection
const connectDatabase = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false,
            useCreateIndex:true
         });
         console.log(`database connected ${conn.connection.host}`)
    }catch(err){
     console.log(err);
     process.exit(1);
    }
}
module.exports =connectDatabase;
