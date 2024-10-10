const User = require("../models/User.js"); // require User model
const bcrypt=require("bcrypt"); // require the bcrypt for the storing the password 
const jwt=require("jsonwebtoken");// require the jsonwebtoken for the jwt
const sendMail = require("../middlewares/sendMail.js"); //require the sendingthe mail middleware to send the email to the user emaile
const TryCatch = require("../middlewares/TryCatch.js");

// controller for the register Route
const register=async(req,res)=>{  
    try{
  const {email,name,password}=req.body;  // accessing the user info 
  let user=await User.findOne({email});  // find the user by its detail from database
  if(user){ // if user is already exists then show the error message
    return res.status(400).json({
        message:"User is already Exists ! "
    });
}

 // we need to store the passord in hash formate for this we use bcrypt.hash() method and add the salt value 
  const hashPassword=await bcrypt.hash(password,10);
    user={
        name,
        email,
        password:hashPassword
    }
    // now we need to generate the opt 
    const otp=Math.floor(Math.random()*1000000); // using the generate the random  number we genarate the otp of 6 digit

    // then we create the activation token for this we create the jwt token  and use the jwt.sign() method  
    const activationToken= jwt.sign({
        user,
        otp,
    },process.env.Activatin_Secret, // then we need to pass the jwt secret 
     {
         expiresIn:"5m" // add the expire of that token 
     } 
    );

    const data={ //create the variable of name data  (now we create the middleware to to send the data to the user email )
        name,
        otp
    }
    await sendMail(
        email,
        "Learning Management System By Shubham Sharad Mane ", // this is the subject value
        data
    );

    res.status(200).json({
        message:"Otp Is transfered to your mail ",
        activationToken, // and also pass the activation token 
    })

}
    catch(err){
        res.status(500).json({
            message:err.message,
        })
    }
}

// now crate the controller for the verify the user 
const verifyUser=TryCatch(async(req,res)=>{
    const {otp,activationToken}=req.body;  // take the otp and the ActivationToken from the user 

    // now verify that activationToken we use the jwt.veryfy() method
    const verify=jwt.verify(activationToken,process.env.Activatin_Secret);

    if(!verify){ // if verifaction is not done then show this message to the user 
        return res.status(500).json({ 
            message:"OTP is Expired !",
        });
    }

    // verify the otp
    if(verify.otp !== otp){ // if otp is not equals whith user entered otp then this message will printed
        return  res.status(500).json({ 
            message:"Wrong OTP ! ",
        });
    }

    // now we create the user after all verifiaction is done 
    await User.create({
        name:verify.user.name, // we used verify.user because in above code we passed the the user and otp in the ActivationToken 
        email:verify.user.email,
        password:verify.user.password,
    }); //now user is created 

    res.json({ // that message will displayed and status is automatically 200 
        message:"User is Registered !",
    })
});

// now we create the login user controller 
const loginUser=TryCatch(async(req,res)=>{
    const {email,password}=req.body;
    const user =await User.findOne({email}); // finding the user from the data base by using the user entered email because email is unique
    if(!user){ //if user not exits
        return res.status(400).json({
            message:"No User With This Email",
        });
    } 
    const MatchPassword= await bcrypt.compare(password, user.password)// now we compaire the password which is entered by the user withe stored the passpord by using the bcrypt.compair() methods 

    if(!MatchPassword){ // condition for if password is not match then 
        return res.status(400).json({
            message:"Wrong Password !",
        });
    }

    //if the user and password is correct and matched sucessfully then login the user for this we create the token 
    const token= jwt.sign({_id: user._id},process.env.Jwt_Sec,{expiresIn:"10d",}); // store the id in the id of user 

    res.json({
        message:` Wellcome Back ${user.name}`,
        token,
        user,
});
});


// now we create the route the for access the id  or using id we create the my profile route
const myProfile=TryCatch(async(req,res)=>{
    const user =await User.findById(req.user._id); //for this we need to create the middleware isAuth.js for accessing the user with its id 
     res.json({
        user  //sending the user in the response
     })
});

module.exports={register , verifyUser , loginUser ,myProfile};