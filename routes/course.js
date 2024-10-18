const express=require("express");
const { getAllCourses, getSingleCourse, fetchLectures, fetchLecture, getMyCourses, paymentVerification ,checkout} = require("../controllers/course");
const { isAuth } = require("../middlewares/isAuth");

const router=express.Router();

router.get("/course/all",getAllCourses); //route for get the all courses
router.get("/course/:id",getSingleCourse); //to get single course
router.get("/lectures/:id",isAuth,fetchLectures); //to acess the lectures
router.get("/lecture/:id",isAuth,fetchLecture); //to acess the lecture from lectures
router.get("/mycourses",isAuth,getMyCourses);//to get the all subcribed courses
router.post("/course/checkout/:id",isAuth,checkout); 
router.post("/verification/:id",isAuth,paymentVerification);

module.exports=router;