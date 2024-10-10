const multer =require("multer"); // import the multer 
const {v4 : uuid}=require("uuid"); //import the uuid

const storage=multer.diskStorage({
    destination(req,file,cb){ //we create the storage and use the cb(callback)
        cb(null,"uploads/")//pass the two parameters in the cb function
    },
    filename(req,file,cb){
       const id=uuid(); //now we need to generate the random id because every image or video needs the diffrent id for this we use the package uuid
       const extName=file.originalname.split(".").pop();  // to find the extention of the file
       const fileName=`${id}.${extName}` ;   //file name create  according to the using the id and the extention
       cb(null,fileName); //null for the error to null the error and file name is created
    },

});

// Multer config for multiple file uploads
const uploadFiles = multer({ storage }).fields([
    { name: "image", maxCount: 1 },  // For course images
    { name: "lecture", maxCount: 1 }, // For lecture videos
]);

//const uploadFiles=multer({storage}).single("image");

module.exports=uploadFiles;