// main/mongodb.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Import routes (up one level to repo root)
const UserRoutes = require("../routes/Router.js");
const CardRoutes = require("../routes/CardRouter.js");

const app = express();

console.log("Starting server…");

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:3000', // change to your frontend URL in production
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Route middlewares
app.use("/api/users", UserRoutes);
app.use("/api/cards", CardRoutes);

// Connect to MongoDB and start server
const mongoURI = process.env.MONGOOSE_CONNECTION_STRING;

if (!mongoURI) {
  console.error("Error: MONGOOSE_CONNECTION_STRING is not defined!");
  process.exit(1);
}

// Mongoose v9+ no longer needs useNewUrlParser/useUnifiedTopology
mongoose.connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Catch-all for unhandled exceptions and rejections
process.on("uncaughtException", (err) => console.error("Uncaught Exception:", err));
process.on("unhandledRejection", (err) => console.error("Unhandled Rejection:", err));