require('dotenv').config({ path: '../.env' }); // make sure path is correct
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const {User} = require('../models/model.js');
const generateToken = require('./Token/Token.js');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const RegisterUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please enter all required fields" });
    }

    const userExists = await User.findOne({ username });

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, password, is_employee: false, is_employer: false });

    if (user) {
        res.status(201).json({
            message: 'User created successfully',
            username: user.username,
            token: generateToken(user._id)
        });
    } else {
        res.status(500).json({ message: "Failed to create user" });
    }
});

// Authenticate user
const authUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });

    if (!userExists) {
        return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, userExists.password);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({
        message: 'Successfully logged in',
        username: userExists.username,
        token: generateToken(userExists._id)
    });
});

// Stripe subscription
const Subscribe = asyncHandler(async (req, res) => {
    const plan = req.query.plan?.trim().toLowerCase();

    if (!plan) {
        return res.status(400).json({ message: "Package does not exist", status: false });
    }

    let priceId;
    switch (plan) {
        case "basic":
            priceId = "price_1T7ULGPJzdQ1xq5QstpN5vYc";
            break;
        case "advanced":
            priceId = "price_1T7UOZPJzdQ1xq5Q1ohRSFe6";
            break;
        default:
            return res.status(400).json({ message: "Package does not exist", status: false });
    }

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/cancel",
    });

    return res.status(200).json({ status: true, url: session.url });
});

const Is_employer = asyncHandler(async (req, res) => {
  const { username, is_employee } = req.body;

  if (is_employee === true) {
    return res.status(400).json({
      message: 'User cannot be an employer because they are already an employee'
    });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.is_employer = true;
  await user.save(); // <- actually updates the database

  res.status(200).json({
    message: "User updated successfully",
    username: user.username,
    is_employer: user.is_employer
  });
});

// Mark as employee
const Is_employee = asyncHandler(async (req, res) => {
  const { username, is_employer,password } = req.body;

  if (is_employer === true) {
    return res.status(400).json({
      message: 'User cannot be an employee because they are already an employer'
    });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.is_employee = true;
  await user.save(); // <- actually updates the database

  res.status(200).json({
    message: "User updated successfully",
    username: user.username,
    is_employee: user.is_employee,
    password:user.password
  });
});

// Get user info
const get_user = asyncHandler(async (req, res) => {
    const { username,password } = req.body;

    try {
        // Correct async call: findOne not findone
        const user = await User.findOne({username});

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: 'User found',
            username: user.username,
            is_employee: user.is_employee,
            is_employer: user.is_employer 
        });

    } catch (err) {
        console.error(`An unexpected error occurred: ${err}`);
        res.status(500).json({
            message: `An unexpected error occurred: ${err}`
        });
    }
});


module.exports = { RegisterUser, authUser, Subscribe, Is_employer, Is_employee, get_user };