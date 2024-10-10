const express=require("express"); //import the express
const {isAuth, isAdmin} = require("../middlewares/isAuth"); //import the middlaeware for user is authenticated or not and user is admin or not to checking we create the middleware and require it
const {createCourse, addLecture, deleteLecture, deleteCourse, getAllStats, updateRole, getAllUser } = require("../controllers/admin");
const uploadFiles = require("../middlewares/multer");
const router=express.Router(); //creating the router object from the express

router.post("/course/new",isAuth, isAdmin,uploadFiles,createCourse);// route is created for the adding the courses and we added the authentication for tha user is login or not by using the isAuth middleware and for user is admin or not we created the middleware name is isAdmin for checks and uploads file 
router.post("/course/:id",isAuth,isAdmin,uploadFiles,addLecture); //route is created for the adding the lecturs and first of all checks the all authentiactions
router.delete("/lecture/:id",isAuth,isAdmin,deleteLecture);//route is created for the delete the lectures
router.delete("/course/:id",isAuth,isAdmin,deleteCourse);//this route is created for the delete the course
router.get("/stats",isAuth,isAdmin,getAllStats);//this route is created for get the all information about  the user and courses and lectures
router.put("/user/:id",isAuth,isAdmin,updateRole);//this route is created for the updating the role of user
router.get("/users",isAuth,isAdmin,getAllUser);//this route is created for the getting the all users
module.exports=router;