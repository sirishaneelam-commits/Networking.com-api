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

// ✅ Improved CORS setup to allow production + all Vercel preview URLs
const allowedOrigins = [
  "https://networking-com-frontend-ofly.vercel.app", // production
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);

    // allow production or any preview URL matching this project
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/networking-com-frontend-ofly.*\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }

    // reject any other origin
    return callback(new Error("Not allowed by CORS"));
  },
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