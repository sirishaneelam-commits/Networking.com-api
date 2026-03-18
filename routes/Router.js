const express = require('express');
const router = express.Router();
const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   limit: 10,
});

// Controllers
const {
  RegisterUser,
  authUser,
  Subscribe,
  Is_employee,
  Is_employer,
  get_user
} = require('../Controllers/Controllers.js');

// User routes (all lowercase)
router.post('/register', RegisterUser);       
router.post('/login', authUser); 
router.post('/pay', Subscribe);
router.post('/is-employee', Is_employee);
router.post('/is-employer', Is_employer);  
router.post('/get-user', get_user);   

module.exports = router;
