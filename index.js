const express =require ("express"); // import the express
const dotenv= require("dotenv"); // import dotenv
const connectedDb =require("./database/db"); //import the mongoose connection
dotenv.config(); // acessing the any value from the dot env
const app=express(); // create the object of app 
const Razorpay = require("razorpay"); //requiring the razorpay
const cors=require("cors"); //import the cors for cross request 

const instance = new Razorpay({ //creating the instsnce variable for razorpay
    key_id:process.env.Razorpay_key,
    key_secret:process.env.Razorpay_Secret,
});
module.exports={ instance };

//use the middleware for  read the json data
app.use(express.json());
//use the cors
const corsOptions = {
    origin: "https://learning-management-system-frontend-phi.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

app.use(cors(corsOptions));

const PORT =process.env.PORT  ; // defining the port 

app.get("/",(req,res)=>{ // root router
    res.send("this is start my frend ");
});

app.use("/uploads",express.static("uploads"));//to use the uploads folder anywhare we use the express static method
// importing routes
const userRoutes=require("./routes/user"); 
const courseRoutes=require("./routes/course");
const adminRoutes=require("./routes/admin");

// using routes
app.use("/api",userRoutes);
app.use("/api",courseRoutes);
app.use("/api",adminRoutes);

app.listen(PORT , (req,res)=>{ // server testing
    console.log(`Server is listing to PORT : ${PORT}`);
    connectedDb();
})
