const mongoose =require("mongoose");

const CoursesSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    duration:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    createdBy:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
});
const Courses=mongoose.model("Courses",CoursesSchema); //createing the model for courses 
module.exports=Courses;