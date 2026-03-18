

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();


const UserRoutes = require("./routes/Router.js");
const CardRoutes = require("./routes/CardRouter.js");

const app = express();


console.log("Starting server…");

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Route middlewares
app.use("/api/users", UserRoutes);
app.use("/api/cards", CardRoutes);


const mongoURI = process.env.MONGOOSE_CONNECTION_STRING;

if (!mongoURI) {
  console.error("Error: MONGOOSE_CONNECTION_STRING is not defined in environment variables!");
  process.exit(1);
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); 
  });


process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

