const TryCatch = require("../middlewares/TryCatch"); //import trycatch middleware
const Courses = require("../models/Courses");//requireing the courses model
const Lecture = require("../models/Lecture"); //requireing the lecture model
const fs=require("fs"); 
const { promisify } = require('util'); //require the promisify which is buydefault present in the node.js
const User = require("../models/User.js"); // require User model

//controller for the create course
const createCourse=TryCatch(async(req,res)=>{ 
    const {title,description,price,category,duration,createdBy}=req.body;
   const image= req.files?.image; //for image and the video store in the server we use the multer and create the middleware of multer.js
      // Check if file is uploaded
  if (!image) {
    return res.status(400).json({ message: "Image file is required!" });
  }

  // Log the file for debugging
  console.log('Uploaded file:', image);

    await Courses.create({ //creating the courses
         
        title,
        description,
        category,
        createdBy,
        image:image[0].path, //if image is avalable then its path is give to the image
        duration,
        price,
    });
    res.status(200).json({
        message:"Cource is created sucessfully ! ",
    });
});

//xreate the controller for the addlecture
const addLecture=TryCatch(async(req,res)=>{
    const course=await Courses.findById(req.params.id) //find the course by this id

    if(!course){
        return res.status(404).json({
            message:"No Course With This Id ",
        });
    }

    const {title,description}=req.body;
    //const file=req.files;
    const video=req.files?.lecture?.[0];
    if (!video) {
        return res.status(400).json({ message: "Lecture video is required" });
    }
    const lecture= await Lecture.create({
        title,
        description,
        video:video.path, //file?
        course:course._id,
    });
    res.status(201).json({
        message:"Lecture is created ",
        lecture,
    });
});

//now create the controller for th delete lecture
const deleteLecture=TryCatch(async(req,res)=>{
    const lecture=await Lecture.findById(req.params.id);

    fs.rm(lecture.video, (err) => {
        if (err) {
            console.error("Error deleting the video:", err);
        } else {
            console.log("Video is deleted");
        }
    });

    await lecture.deleteOne();
    res.json({
        message:"Lecture is Deleted ",
    });
});

const unlinkAsync=promisify(fs.unlink);
//now we create the route for the delete course
const deleteCourse=TryCatch(async(req,res)=>{
    const course=await Courses.findById(req.params.id); //finding the course throw the course id 
    const lectures=await Lecture.find({course:course._id}); //finding the all lectures from the lecture throw the course id 

    await Promise.all( //for deliting the all lectures
        lectures.map(async(lecture)=>{
            await unlinkAsync(lecture.video); //that unlinkAsync is used to delete the all lectures
            console.log("video deleted !")
        })
    );
    
    fs.rm(course.image, (err) => { //that is used because after deleteing the course we also need to delete the thaimbnail image of the course
        if (err) {
            console.error("Error deleting the image:", err);
        } else {
            console.log("image is deleted");
        }
    });

    await Lecture.find({course:req.params.id}).deleteMany(); // to delete the all lectures from the database
    await course.deleteOne();//for deleting the course from databse
    await User.updateMany({},{$pull:{subscription:req.params.id}});//removing the deleted course from the user subscription

    res.json({
        message:"Course is deleted ",
    });

});
//now we create the route for the get all stats of all courses
const getAllStats=TryCatch(async(req,res)=>{
    const totalCourses= (await Courses.find()).length; //for get the how many courses is avalaible
    const totalLectures=(await Lecture.find()).length;//to get the how many lectures are avaliable
    const totalUsers=(await User.find()).length;//to find the how many users are present
    const stats={//create the object which has the all information ablute above 
        totalCourses,
        totalLectures,
        totalUsers,
    }

    res.json({
        stats,
    });
});

//controller for the getting the all users
const getAllUser=TryCatch(async(req,res)=>{

    const users=await User.find({_id:{$ne:req.user._id}}).select("-password"); //in the find we gave the condition for ony show the users id and details not admin and not show the password

    res.json({users});
});

//controller for the updateRole
const updateRole=TryCatch(async(req,res)=>{
    if(req.user.mainrole !== "superadmin") return res.status(403).json({message:"This EndPoint Assign to SuperAdmin",});
    const user=await User.findById(req.params.id); //find the user by its id

    if(user.role === "user"){
        user.role ="admin";
        await user.save();

        return res.status(200).json({
            message:"Role Updated to Admin !",
        })
    }

    if(user.role === "admin"){
        user.role ="user";
        await user.save();

        return res.status(200).json({
            message:"Role Updated to User !",
        })
    }
});

module.exports={createCourse ,addLecture ,deleteLecture , deleteCourse ,getAllStats,getAllUser,updateRole}; //exporting the all controller for the routes 