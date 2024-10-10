const mongoose = require("mongoose");

 const connectedDb = async()=>{
    try{
    await mongoose.connect(process.env.DB);
    console.log("Connected to the database !");
    }
    catch(err){
        console.log(err);
    }
};
module.exports= connectedDb;
