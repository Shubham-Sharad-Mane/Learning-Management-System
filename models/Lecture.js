const mongoose = require("mongoose");

const LectureSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    video:{
        type:String,
        required:true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});
const Lecture = mongoose.model("Lecture",LectureSchema);
module.exports=Lecture;