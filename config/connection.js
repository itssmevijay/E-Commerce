const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/E-Commerce"

module.exports = async function connectDB(){
    try{
        await mongoose.connect(url,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        }).then(()=>{
            console.log("database connected");
        })
    }catch(err){
        console.log(err);
    }
}