const express =require("express"); // require the express
const { register, verifyUser, loginUser, myProfile } = require("../controllers/user.js");
const {isAuth} = require("../middlewares/isAuth.js");
const router=express.Router();// create the router object

router.post("/user/register",register); // create the route for the register user 
router.post("/user/verify",verifyUser);//create the route for the verify user
router.post("/user/login",loginUser); //create the route for the ligin user 
router.get("/user/me", isAuth,myProfile);//create the route for the my profile and use   the isAuth middleware for the Authentiation 

module.exports=router; 