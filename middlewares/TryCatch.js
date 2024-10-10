const TryCatch=(handler)=>{ // we created this function because we alwas nee to use the try catch block in the code so we create the function for that
    return async(req,res,next)=>{
        try{
            await handler(req,res,next);
        }catch(err){
            res.status(500).json({
                message:err.message,
            });
        }
    }
};
module.exports=TryCatch;