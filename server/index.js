// const express = require("express");
// const morgan = require("morgan");
// require("dotenv").config();
// const connectToDatabase = require("./config/db");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const path = require("path");

// const authrouter = require("./routes/authrouter");
// const categoryRouter = require("./routes/categoryRouter");
// const productrouter = require("./routes/productrouter");
// const sitemapRoute=require("./routes/sitemap")


// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//   origin: "*", // Allow requests from any origin
//   credentials: true
// }));

// // Connect to Database
// connectToDatabase();
// app.disable('x-powered-by');

// // Add middleware to set your custom header instead
// app.use((req, res, next) => {
//   res.setHeader('X-Powered-By', 'Ritwin');
//   next();
// });

// const PORT = process.env.PORT || 5000;

// // ✅ API Routes should be ABOVE the wildcard route
// app.use("/", sitemapRoute); // Add the sitemap route
// app.use("/api/v1/user", authrouter);
// app.use("/api/v1/category", categoryRouter);
// app.use("/api/v1/product", productrouter);

// // Serve static files from React app
// app.use(express.static(path.join(__dirname, "../client/build")));

// // ✅ Move this to the bottom so API routes are processed first
// app.get("*", (req, res) => {
//   if (req.originalUrl.startsWith("/api")) {
//     res.status(404).json({ message: "API Route Not Found" });
//   } else {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
//   }
// });

// // Default Route
// app.get("/", (req, res) => {
//   res.json("Hello");
// });

// // Start the Server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });






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
const sitemapRoute = require("./routes/sitemap");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "*",
  credentials: true
}));

// Connect to Database
connectToDatabase();
app.disable('x-powered-by');

// Custom header
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Ritwin');
  next();
});

const PORT = process.env.PORT || 5000;

// ✅ API Routes
app.use("/", sitemapRoute);
app.use("/api/v1/user", authrouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productrouter);

// ✅ Serve React Static Files Properly
const buildPath = path.join(__dirname, "../client/build");
app.use(express.static(buildPath));

// ✅ Ensure API Routes Return JSON, Not HTML
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ message: "API Route Not Found" });
  }
  next();
});

// ✅ Serve React App for All Other Routes
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

