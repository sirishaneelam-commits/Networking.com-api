const { Card } = require('../models/model.js')
const asyncHandler = require('express-async-handler')

const CreateCard = asyncHandler(async(req,res)=>{
    const {title,description,email,phone_number} = req.body

    if(!title || !description || !email || !phone_number){  // FIX: return added
        return res.status(400).json({ message:"Please fill in all fields" })
    }

    const card = await Card.create({ title, description, email, phone_number }) // FIX: phone_number lowercase
    card.save()
    res.status(201).json({
        message:'Card created successfully!',
        card
    })
})

const getcard = asyncHandler(async(req,res)=>{
    const cards = await Card.find()
    res.status(200).json(cards)
})

module.exports = { CreateCard, getcard }

