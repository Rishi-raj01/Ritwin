const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const connectToDatabase = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const authrouter = require("./routes/authrouter");
const categoryRouter = require("./routes/categoryRouter");
const productrouter = require("./routes/productrouter");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "*", // Allow requests from any origin
  credentials: true
}));

// Connect to Database
connectToDatabase();

const PORT = process.env.PORT || 5000;

// Serve static files from the React app (client/build directory)
app.use(express.static(path.join(__dirname, "../client/build")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Serve React app for non-API requests
  app.get("*", (req, res) => {
    if (!req.originalUrl.startsWith("/api")) {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    }
  });
}

// API Routes
app.use("/api/v1/user", authrouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productrouter);

// Default Route
app.get("/", (req, res) => {
  res.json("Hello");
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
