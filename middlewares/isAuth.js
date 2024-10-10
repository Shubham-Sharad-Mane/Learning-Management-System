const jwt=require("jsonwebtoken"); // require the jwt 
const User=require("../models/User");//require the user model for the accesing the data from the user

const isAuth=async(req,res,next)=>{
    try{
        const token=req.headers.token;// access the token from the request header because token always in request header

        if(!token){ // if token is not avalable because if we not logigged in then token is not awailable 
            return res.status(403).json({
                message:"Please Login",
            });
        }

        // now decode the token 
        const decodeData=jwt.verify(token,process.env.Jwt_Sec); // take the all data from the token 
        req.user=await User.findById(decodeData._id)
        next();
    }catch(err){
        res.status(500).json({
            message:"Login First"
        })
    }
};

//const isAuth = async (req, res, next) => {
//     try {
//         // Access the token from the Authorization header (Bearer token format)
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(403).json({
//                 message: "Please login",
//             });
//         }

//         // Extract the token (removing 'Bearer ' from the string)
//         const token = authHeader.split(" ")[1];

//         if (!token) {
//             return res.status(403).json({
//                 message: "Please login",
//             });
//         }

//         // Decode the token
//         const decodedData = jwt.verify(token, process.env.Jwt_Sec);

//         // Attach the user to the request after finding by the ID
//         req.user = await User.findById(decodedData._id);

//         // If the user is not found (token is invalid or user deleted)
//         if (!req.user) {
//             return res.status(404).json({
//                 message: "User not found",
//             });
//         }

//         next();
//     } catch (err) {
//         res.status(500).json({
//             message: "Login first",
//         });
//     }
// };

const isAdmin=async(req,res,next)=>{
    try{
        if(req.user.role !== "admin"){
            return res.status(403).json({
                message:" You are not admin !",
            });
        }
        next();

    }catch(err){
        res.status(500).json({
            message:err.message,
        });
    }
}
module.exports={isAuth , isAdmin};