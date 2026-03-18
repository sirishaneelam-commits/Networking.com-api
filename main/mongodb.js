// mongodb.js
const mongoose = require('mongoose');
const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');

// Corrected paths for Render
const UserRoutes = require('./routes/Router.js');
const CardRoutes = require('./routes/CardRouter.js');

// Load environment variables
dotenv.config();  

const app = express();

// Enable CORS for localhost:3000 and allow common methods and headers
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse incoming JSON requests
app.use(express.json());

// Route middlewares
app.use('/api/users', UserRoutes);
app.use('/api/cards', CardRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING)
    .then(() => {
        console.log('MongoDB connected');
        const Port = process.env.PORT || 8000;
        app.listen(Port, () => {
            console.log(`App listening on port: ${Port}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });


