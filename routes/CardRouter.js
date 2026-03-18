const express = require('express')
const router = express.Router()
const { rateLimit } = require("express-rate-limit")
const { CreateCard, getcard } = require('../Controllers/CardControllers.js')

const limiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   limit: 10
})


router.post('/', limiter, CreateCard)  
router.get('/', getcard)                

module.exports = router

