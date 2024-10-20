const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    mainrole:{ //we creted this because this function is created after completing the all project so wwe dont want to change teh routes
        type:String,
        default:"user",
    },
    subscription:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses",
    }],
    resetPasswordExpire: Date,
},{
    timestamps:true,
});
const User = mongoose.model("User",UserSchema);
module.exports =User;