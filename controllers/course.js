//now create the contoller for the get all courses

const Courses = require("../models/Courses");
const TryCatch = require("../middlewares/TryCatch");
const Lecture = require("../models/Lecture");
const User = require("../models/User.js"); // require User model
const { instance } = require("../index.js");
const crypto = require('crypto');
const Payment = require("../models/Payment.js");

//creating the controller for the getting the all courses
const getAllCourses=TryCatch(async(req,res)=>{
    const courses=await Courses.find();
    res.json({
        courses,
    });
});

//controller for the get single course through the id 
const getSingleCourse=TryCatch(async(req,res)=>{
    
    const course=await Courses.findById(req.params.id);

    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }
    console.log(course);

    res.json({
        course,
    });
    
});

//creating the controller for accesing the course's all lectures  route
const fetchLectures=TryCatch(async(req,res)=>{
    let {id}=req.params;
    let course=await Courses.findById(id);
    const lectures=await Lecture.find({ course: course._id });

    const user=await User.findById(req.user._id);//find the user by its id

    if(user.role ==="admin"){ //if user is admin then he can acess the course
        return res.json({
            lectures,
        });
    }

    //if user is not admin then checks that user has subscription or not 
    if(!user.subscription.includes(lectures.course)){
        return res.status(400).json({
            message:"You Hava not Subscribed to this Course !",
        });
    }

    //if user has lectures subscription then 
    res.json({
        lectures,
    });


});

//to acess the lecture from the lectures
const fetchLecture=TryCatch(async(req,res)=>{
    const lecture=await Lecture.findById(req.params.id);

    const user=await User.findById(req.user._id);//find the user by its id

    if(user.role ==="admin"){ //if user is admin then he can acess the course
        return res.json({
            lecture,
        });
    }

    //if user is not admin then checks that user has subscription or not 
    if(!user.subscription.includes(req.params.id)){
        return res.status(400).json({
            message:"You Hava not Subscribed to this Course !",
        });
    }

    //if user has lectures subscription then 
    res.json({
        lecture,
    });

});

//now we create the route for get my courses or to user get all courses which he has subcribed
const getMyCourses=TryCatch(async(req,res)=>{

    // Check if the user has any subscriptions
    if (!req.user.subscription || !req.user.subscription.length) {
        return res.status(404).json({ message: "You have not subscribed to any courses." });
    }

    const courses=await Courses.find({ _id: { $in: req.user.subscription } });//this line is used for the finding the all courses from the user subscription
    
    if (!courses.length) {
        return res.status(200).json({ 
            success: true, 
            message: "No courses enrolled.", 
            courses: [] });
    }

    res.json({
        success: true,
        courses,
    });
});

//now create the controller for checkout
const checkout=TryCatch(async(req,res)=>{
    const user=await User.findById(req.user._id); //find the user
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const course=await Courses.findById(req.params.id); //find the course

    if(user.subscription.includes(course.id)){ //check that user has this course already subcription or not 
        return res.status(400).json({
            message:"You already Have this Course",
        });
    }

    const options={  //
        amount:Number(course.price*100),
        currency:"INR",
    }
    const order=await instance.orders.create(options);

    res.json({
        order,
        course,
    });
});

//cntroller for payment verification
const paymentVerification=TryCatch(async(req,res)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body; //for payment verification acess the those thngs from the req.body
    const body = razorpay_order_id + "|" + razorpay_payment_id; 
    const expectedSignature=crypto.createHmac("sha256",process.env.Razorpay_Secret).update(body).digest("hex");

    //for authentec payment
    const isAuthentic=expectedSignature === razorpay_signature;

    if(isAuthentic){
        await Payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        const user=await User.findById(req.user._id); //then find the user 
        const course=await Courses.findById(req.params.id);//then find the course
        user.subscription.push(course._id); //adding the course in the user subscription array
        await user.save(); //save the user with this adding the changes
        res.status(200).json({ //and give this message
            message:"Course is purchesed Successfuily",
        });
    }else{
        return res.status.json({
            message:"Payment Failed",
        });
    }

})


module.exports={getAllCourses , getSingleCourse ,fetchLectures ,fetchLecture ,getMyCourses , checkout ,paymentVerification};