const express=require('express')
const morgan = require("morgan");
require('dotenv').config();

const connectToDatabase= require("./config/db")
const cors=require("cors")
const cookieParser = require("cookie-parser");
const path = require("path"); // Import path module for working with file and directory paths
const authrouter=require("./routes/authrouter")
const categoryRouter=require("./routes/categoryRouter")
const productrouter = require("./routes/productrouter"); // Ensure this is correctconst formidable=require("express-formidable")
const app=express();
const Razorpay=require("razorpay")
app.use(express.json());





//app.get me req and res milte h
const PORT = process.env.PORT || 5000; // Use environment variable for PORT
connectToDatabase();

app.use(cookieParser());



app.use(cors())
app.use(cors({
  origin: "*", // Allow requests from this origin in development
  credentials: true
}));


// Serve static files from the React app (client/build directory)
app.use(express.static(path.join(__dirname, "./client/build")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Serve React app for non-API requests
  app.get("*", (req, res) => {
    if (!req.originalUrl.startsWith("/api")) {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    }
  });
}
app.get("/",(req,res)=>{
  res.json('hello')
})


//routes 


app.use("/api/v1/user", authrouter);
app.use("/api/v1/category",categoryRouter)
app.use("/api/v1/product",productrouter)


// Catch-all route for serving React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
